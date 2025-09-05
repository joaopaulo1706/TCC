import { supabase } from '../config/supabase'; // Importe sua configuração do Supabase
import { databaseService, initDatabase } from './localDatabase';

const SyncService = {
  async checkSupabaseConnection() {
    try {
      // Testa a conexão tentando ler um registro simples
      const { data, error } = await supabase
        .from('connection_test')
        .select('*')
        .limit(1);
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Erro na conexão com Supabase:', error);
      return false;
    }
  },

  normalizeData(tableName, data) {
    if (!data) return data;

    // Exemplo de normalização, adapte conforme seu schema
    if (tableName === 'propriedade') {
      return {
        ...data,
        created_at: typeof data.created_at === 'string' ? data.created_at : new Date(data.created_at).toISOString(),
        updated_at: typeof data.updated_at === 'string' ? data.updated_at : new Date(data.updated_at).toISOString(),
      };
    }

    if (data.endereco_id && typeof data.endereco_id === 'object') {
      data.endereco_id = data.endereco_id.id;
    }

    return data;
  },

  async syncTable(tableName, batchSize = 100) {
    try {
      const isOnline = await this.checkSupabaseConnection();
      if (!isOnline) {
        console.log(`Modo offline - não sincronizando tabela ${tableName}`);
        return { success: false, offline: true };
      }

      // 1. Obter última data de sincronização
      const lastSync = await databaseService.getLastSync(tableName);
      console.log(`Última sincronização para ${tableName}: ${lastSync}`);

      // 2. Baixar dados do Supabase
      let query = supabase.from(tableName).select('*');
      if (lastSync) {
        query = query.gte('updated_at', lastSync);
      }
      const { data: supabaseData, error } = await query;
      if (error) throw error;

      // 3. Processar em lotes para evitar problemas de memória
      const batches = this.chunkArray(supabaseData, batchSize);

      // 4. Atualizar banco local com os dados do Supabase
      for (const batch of batches) {
        await databaseService.transaction(
          batch.map(item => {
            const normalizedItem = this.normalizeData(tableName, {
              ...item,
              last_sync: new Date().toISOString()
            });

            return {
              sql: `
                INSERT OR REPLACE INTO ${tableName} 
                (${Object.keys(normalizedItem).join(', ')})
                VALUES (${Object.keys(normalizedItem).map(() => '?').join(', ')})
              `,
              params: Object.values(normalizedItem)
            };
          })
        );
      }

      // 5. Enviar alterações locais para o Supabase
      const unsyncedLocal = await databaseService.getUnsyncedRecords(tableName);
      console.log(`Registros locais não sincronizados: ${unsyncedLocal.length}`);

      for (const batch of this.chunkArray(unsyncedLocal, batchSize)) {
        for (const item of batch) {
          const { id, ...data } = item;
          const normalizedData = this.normalizeData(tableName, data);

          // Upsert (insere ou atualiza)
          const { error: upsertError } = await supabase
            .from(tableName)
            .upsert([{ id, ...normalizedData }], { onConflict: ['id'] });
          if (upsertError) console.error(upsertError);
        }

        // Atualizar last_sync no banco local
        await databaseService.transaction(
          batch.map(item => ({
            sql: `UPDATE ${tableName} SET last_sync = ? WHERE id = ?`,
            params: [new Date().toISOString(), item.id]
          }))
        );
      }

      return {
        success: true,
        table: tableName,
        downloaded: supabaseData.length,
        uploaded: unsyncedLocal.length,
        lastSync: new Date().toISOString()
      };
    } catch (error) {
      console.error(`Erro na sincronização da tabela ${tableName}:`, error);
      return { success: false, error: error.message };
    }
  },

  async fullSync() {
    try {
      await initDatabase();

      const tables = [
        'productor',
        'endereco',
        'propriedade',
        'cultivar',
        'safra',
        'despesas',
        'investimentos',
        'agenda',
        'receitas'
      ];

      const results = {};
      for (const table of tables) {
        if (await databaseService.tableExists(table)) {
          results[table] = await this.syncTable(table);
        } else {
          console.warn(`Tabela ${table} não existe no banco local`);
          results[table] = { success: false, error: 'Tabela não existe localmente' };
        }
      }

      return results;
    } catch (error) {
      console.error('Erro na sincronização completa:', error);
      throw error;
    }
  },

  async incrementalSync() {
    try {
      const tables = await databaseService.executeQuery(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'"
      );

      const results = {};
      for (const table of tables.rows) {
        const tableName = table.name;
        if (!['sqlite_sequence'].includes(tableName)) {
          results[tableName] = await this.syncTable(tableName);
        }
      }

      return results;
    } catch (error) {
      console.error('Erro na sincronização incremental:', error);
      throw error;
    }
  },

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  async resolveConflicts(tableName) {
    try {
      const conflictedRecords = await databaseService.getUnsyncedRecords(tableName);

      for (const record of conflictedRecords) {
        // Obter versão mais recente do Supabase
        const { data: supabaseRecord, error } = await supabase
          .from(tableName)
          .select('*')
          .eq('id', record.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = not found
          console.error(error);
          continue;
        }

        const supabaseUpdated = supabaseRecord
          ? new Date(supabaseRecord.updated_at)
          : new Date(0);
        const localUpdated = new Date(record.updated_at || 0);

        if (supabaseRecord && supabaseUpdated > localUpdated) {
          // Supabase é mais recente, sobrescreve local
          await databaseService.update(
            tableName,
            this.normalizeData(tableName, {
              ...supabaseRecord,
              id: record.id,
              last_sync: new Date().toISOString()
            }),
            'id = ?',
            [record.id]
          );
        } else {
          // Local é mais recente, envia para Supabase
          const { error: upsertError } = await supabase
            .from(tableName)
            .upsert([{ ...record }], { onConflict: ['id'] });
          if (upsertError) console.error(upsertError);

          await databaseService.update(
            tableName,
            { last_sync: new Date().toISOString() },
            'id = ?',
            [record.id]
          );
        }
      }

      return { success: true, resolved: conflictedRecords.length };
    } catch (error) {
      console.error(`Erro na resolução de conflitos para ${tableName}:`, error);
      return { success: false, error };
    }
  }
};

export default SyncService;