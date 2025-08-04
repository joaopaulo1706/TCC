import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let db = null;
let operationQueue = [];
let isInitialized = false;

const processQueue = () => {
  operationQueue.forEach(op => {
    try {
      op.resolve(db.executeAsync(op.sql, op.params));
    } catch (error) {
      op.reject(error);
    }
  });
  operationQueue = [];
};

export const initDatabase = async () => {
  console.log('Iniciando inicialização do banco de dados local...');

  if (Platform.OS === 'web') {
    console.warn('SQLite não é suportado no navegador.');
    throw new Error('SQLite não disponível no navegador.');
  }

  // Verifica se o módulo SQLite está disponível
  if (!SQLite || !SQLite.openDatabaseAsync) {
    console.error('Módulo SQLite não está disponível:', SQLite);
    throw new Error('Módulo SQLite não está disponível');
  }

  try {
    // Abrir conexão com o banco de dados
    console.log('Abrindo conexão com o banco de dados...');
     db = await SQLite.openDatabaseAsync('localDatabase.db');
    isInitialized = true;
    processQueue(); // Processa operações pendentes
    
    // Verificar se a conexão foi estabelecida
    if (!db) {
      throw new Error('Falha ao abrir conexão com o banco de dados');
    }
    console.log('Conexão com o banco de dados estabelecida com sucesso');

    // Verificar se as tabelas já existem
    const tableCheck = await db.getAllAsync(
  `SELECT name FROM sqlite_master WHERE type='table' AND name='funcionario'`
);

if (!tableCheck || tableCheck.length === 0) {
  console.log('Tabela funcionario não existe, criando tabelas...');
  // Proceda com a criação das tabelas
}

    // Se a tabela não existe, criar todas as tabelas
    if (!tableCheck) {
      console.log('Criando tabelas do banco de dados...');
      
      
    await db.execAsync(`
 
  -- Tabela de Produtores (productor)
  CREATE TABLE IF NOT EXISTS productor (
    cod INTEGER PRIMARY KEY AUTOINCREMENT,
    nome VARCHAR(49) NOT NULL,
    cnpj INTEGER,
    email VARCHAR(59),
     last_sync TEXT,
    telefone INTEGER,
    rg_indicacao VARCHAR(59),
    endereco_id INTEGER,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (endereco_id) REFERENCES endereco(cod)
  );

  -- Tabela de Endereços (endereco)
  CREATE TABLE IF NOT EXISTS endereco (
    cod INTEGER PRIMARY KEY AUTOINCREMENT,
    bairro VARCHAR(49) NOT NULL,
    cidade VARCHAR(49) NOT NULL,
    numero VARCHAR(49) NOT NULL,
     last_sync TEXT,
    complemento VARCHAR(59),
    cep VARCHAR(49),
    uf CHAR(2) NOT NULL,
    referencia INTEGER
  );

  -- Tabela de Despesas (despesas)
  CREATE TABLE IF NOT EXISTS despesas (
    cod INTEGER PRIMARY KEY AUTOINCREMENT,
    funcionario VARCHAR(59) NOT NULL,
    manutencao_implementos REAL,
    insumo VARCHAR(59),
    transporte REAL,
    outras_despesas REAL,
    energia_eletrica REAL,
    combustivel REAL,
     last_sync TEXT,
    manutencao_benfeitorias REAL,
    armazenamento REAL,
    data DATE DEFAULT CURRENT_DATE,
    productor_id INTEGER,
    FOREIGN KEY (productor_id) REFERENCES productor(cod)
  );

  -- Tabela de Propriedades (corrigido para propriedade)
  CREATE TABLE IF NOT EXISTS propriedade (
    cod INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao_lavour VARCHAR(59) NOT NULL,
    area REAL NOT NULL,
    variedade VARCHAR(49),
    expectativa_producao VARCHAR(59),
    solo INTEGER,
    caracteristicas VARCHAR(59),
    observacoes VARCHAR(60),
    foto BLOB,
    endereco_id INTEGER,
    limites VARCHAR(59),
    tipo_cultivo VARCHAR(50),
    cultivar_id INTEGER,
    tipo_despacho VARCHAR(59),
    productor_id INTEGER NOT NULL,
     last_sync TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (endereco_id) REFERENCES endereco(cod),
    FOREIGN KEY (cultivar_id) REFERENCES cultivar(cod),
    FOREIGN KEY (productor_id) REFERENCES productor(cod)
  );

  -- Tabela de Cultivos (cultivar)
  CREATE TABLE IF NOT EXISTS cultivar (
    cod INTEGER PRIMARY KEY AUTOINCREMENT,
    descricao VARCHAR(59) NOT NULL,
    data_plantio DATE NOT NULL,
    data_prevista_colheita DATE,
    insumo VARCHAR(59),
    correcao_solo VARCHAR(59),
     last_sync TEXT,
    produto_esperado VARCHAR(59),
    foto BLOB,
    propriedade_id INTEGER NOT NULL,
    FOREIGN KEY (propriedade_id) REFERENCES propriedade(cod)
  );

  -- Tabela de Relacionamento Cultiva (cultiva)
  CREATE TABLE IF NOT EXISTS cultiva (
    cod INTEGER PRIMARY KEY AUTOINCREMENT,
    productor_id INTEGER NOT NULL,
    propriedade_id INTEGER NOT NULL,
    despesa_id INTEGER,
    data_inicio DATE DEFAULT CURRENT_DATE,
    last_sync TEXT,
    data_fim DATE,
    status TEXT CHECK(status IN ('ativo', 'inativo', 'suspenso')),
    FOREIGN KEY (productor_id) REFERENCES productor(cod),
    FOREIGN KEY (propriedade_id) REFERENCES propriedade(cod),
    FOREIGN KEY (despesa_id) REFERENCES despesas(cod)
  );

  -- Triggers para atualização de timestamps
  CREATE TRIGGER IF NOT EXISTS update_productor_timestamp
  BEFORE UPDATE ON productor
  BEGIN
    UPDATE productor SET updated_at = CURRENT_TIMESTAMP WHERE cod = OLD.cod;
  END;

  CREATE TRIGGER IF NOT EXISTS update_propriedade_timestamp
  BEFORE UPDATE ON propriedade
  BEGIN
    UPDATE propriedade SET updated_at = CURRENT_TIMESTAMP WHERE cod = OLD.cod;
  END;
`);

    console.log('Banco de dados inicializado com sucesso');
  }} catch (error) {
    operationQueue.forEach(op => op.reject(error));
    throw error;
  }
};
export const databaseService = {
  async executeQuery(sql, params = []) {
    if (!isInitialized) {
      throw new Error('Banco de dados não inicializado');
    }
    
    try {
      console.log(`Executando query: ${sql}`, params);
      
      // Para consultas SELECT, usamos getAllAsync
      if (sql.trim().toUpperCase().startsWith('SELECT')) {
        const result = await db.getAllAsync(sql, params);
        console.log('Query SELECT executada com sucesso', result);
        return { rows: result }; // Padroniza o retorno para ter a propriedade rows
      } 
      // Para outras operações (INSERT, UPDATE, DELETE), usamos runAsync
      else {
        const result = await db.runAsync(sql, params);
        console.log('Query executada com sucesso', result);
        return result;
      }
    } catch (error) {
      console.error('Erro na query:', sql, error);
      throw error;
    }
  },
  /**
   * Insere um novo registro na tabela
   */
  async insert(table, data) {
    const columns = Object.keys(data).join(', ');
    const placeholders = Object.keys(data).map(() => '?').join(', ');
    const values = Object.values(data);
    const sql = `INSERT INTO ${table} (${columns}) VALUES (${placeholders})`;
    
    try {
      const result = await this.executeQuery(sql, values);
      return { success: true, id: result.lastInsertRowId };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Busca registros em uma tabela
   */
  async select(table, where = '', params = [], orderBy = '', limit = '') {
    const whereClause = where ? `WHERE ${where}` : '';
    const orderClause = orderBy ? `ORDER BY ${orderBy}` : '';
    const limitClause = limit ? `LIMIT ${limit}` : '';
    const sql = `SELECT * FROM ${table} ${whereClause} ${orderClause} ${limitClause}`;
    
    try {
      const result = await this.executeQuery(sql, params);
      return { success: true, data: result.rows || [] }; // Ajuste aqui
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Atualiza registros em uma tabela
   */
  async update(table, data, where, params = []) {
    const setClause = Object.keys(data)
      .map(key => `${key} = ?`)
      .join(', ');
    const values = [...Object.values(data), ...params];
    const sql = `UPDATE ${table} SET ${setClause} WHERE ${where}`;
    
    try {
      const result = await this.executeQuery(sql, values);
      return { success: true, changes: result.changes };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Remove registros de uma tabela
   */
  async delete(table, where, params = []) {
    const sql = `DELETE FROM ${table} WHERE ${where}`;
    
    try {
      const result = await this.executeQuery(sql, params);
      return { success: true, changes: result.changes };
    } catch (error) {
      return { success: false, error };
    }
  },

  /**
   * Insere um registro com UUID como ID
   */
  async insertWithUUID(table, data) {
    const id = this.generateUUID();
    const result = await this.insert(table, { id, ...data });
    return { ...result, id };
  },

  /**
   * Obtém a última data de sincronização de uma tabela
   */
  async getLastSync(table) {
    try {
      // Verifica se a tabela existe
      const tableCheck = await this.executeQuery(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`, 
        [table]
      );
      
      if (!tableCheck.rows || tableCheck.rows.length === 0) {
        console.warn(`Tabela ${table} não existe`);
        return null;
      }

      // Verifica se a coluna last_sync existe
      const columnCheck = await this.executeQuery(
        `PRAGMA table_info(${table})`
      );
      
      const hasLastSync = columnCheck.rows.some(col => col.name === 'last_sync');
      
      if (!hasLastSync) {
        console.warn(`Coluna last_sync não existe na tabela ${table}`);
        return null;
      }

      const result = await this.executeQuery(
        `SELECT last_sync FROM ${table} ORDER BY last_sync DESC LIMIT 1`
      );
      
      return result.rows?.length > 0 ? result.rows.item(0).last_sync : null;
    } catch (error) {
      console.error(`Erro ao obter last_sync para tabela ${table}:`, error);
      return null;
    }
  },

  /**
   * Atualiza a data de sincronização para uma tabela
   */
  async updateLastSync(table, date = new Date().toISOString()) {
    try {
      // Verifica se a tabela tem a coluna last_sync
      const columnCheck = await this.executeQuery(
        `PRAGMA table_info(${table})`
      );
      
      const hasLastSync = columnCheck.rows.some(col => col.name === 'last_sync');
      
      if (!hasLastSync) {
        console.warn(`Coluna last_sync não existe na tabela ${table}`);
        return false;
      }

      await this.executeQuery(
        `UPDATE ${table} SET last_sync = ?`,
        [date]
      );
      
      return true;
    } catch (error) {
      console.error(`Erro ao atualizar last_sync para tabela ${table}:`, error);
      return false;
    }
  },

  /**
   * Obtém registros que precisam ser sincronizados
   */
  async getUnsyncedRecords(table) {
    try {
      const result = await this.executeQuery(
        `SELECT * FROM ${table} WHERE last_sync IS NULL OR updated_at > last_sync`
      );
      return result.rows || []; // Ajuste aqui
    } catch (error) {
      console.error(`Erro ao buscar registros não sincronizados de ${table}:`, error);
      return [];
    }
  },

  /**
   * Gera um UUID v4
   */
  generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  },

  /**
   * Verifica se uma tabela existe
   */
  async tableExists(tableName) {
    try {
      const result = await this.executeQuery(
        `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
        [tableName]
      );
      return result.rows.length > 0;
    } catch (error) {
      console.error(`Erro ao verificar existência da tabela ${tableName}:`, error);
      return false;
    }
  },

  /**
   * Obtém informações sobre as colunas de uma tabela
   */
  async getTableColumns(tableName) {
    try {
      const result = await this.executeQuery(`PRAGMA table_info(${tableName})`);
      return result.rows ? result : [];
    } catch (error) {
      console.error(`Erro ao obter colunas da tabela ${tableName}:`, error);
      return [];
    }
  },

  /**
   * Executa uma transação
   */
  async transaction(operations) {
    try {
      await db.execAsync('BEGIN TRANSACTION');
      
      try {
        const results = [];
        for (const op of operations) {
          const result = await this.executeQuery(op.sql, op.params);
          results.push(result);
        }
        
        await db.execAsync('COMMIT');
        return { success: true, results };
      } catch (error) {
        await db.execAsync('ROLLBACK');
        return { success: false, error };
      }
    } catch (error) {
      return { success: false, error };
    }
  }
};

/**
 * Obtém a instância do banco de dados
 */
export const getDbInstance = () => db;

/**
 * Fecha a conexão com o banco de dados
 */
export const closeDatabase = async () => {
  if (db) {
    await db.closeAsync();
    db = null;
    console.log('Conexão com o banco de dados fechada');
  }
};

/**
 * Deleta o banco de dados (apenas para desenvolvimento)
 */
export const deleteDatabase = async () => {
  if (db) {
    await db.closeAsync();
    await SQLite.deleteDatabaseAsync('localDatabase.db');
    db = null;
    console.log('Banco de dados deletado');
  }
};