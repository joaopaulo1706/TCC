🌱 Aplicativo de Gerenciamento de Cultivos para Pequenos produtores agrícolas

App em React Native + Expo (v54) para gerenciar produtores e seus cultivos, com Supabase (Auth + Database) e AsyncStorage para sessão local.

🚀 Tecnologias utilizadas

Expo 54.x

React Native 0.81.x

React

Supabase (@supabase/supabase-js)

AsyncStorage (@react-native-async-storage/async-storage)

react-native-safe-area-context (usado no código com useSafeAreaInsets)

expo-font (carregamento de fontes)

expo-file-system (acesso a arquivos)

@expo/vector-icons (ícones)

react-native-worklets (compatibilidade verificada pelo expo-doctor)

(opcional, mas comum no projeto) react-native-calendars (agenda/calendário)

🧰 Pré-requisitos

Node.js LTS (18+ recomendado) e npm

Expo Go no celular ou emulador Android/iOS configurado

Acesso a um projeto no Supabase

📦 Instalação do projeto
# 1) Clone e entre na pasta
git clone https://github.com/SEU-USUARIO/SEU-REPO.git
cd SEU-REPO

# 2) Limpeza inicial (evita conflitos de cache)
rm -rf node_modules package-lock.json
npm cache verify

# 3) Instale o Expo no range correto e as bases do RN/Expo
npm install expo@^54.0.0
npx expo install --fix

✅ Dependências obrigatórias (com versões esperadas pelo Expo 54)

Os comandos abaixo usam npx expo install, que resolve a versão exata compatível com o seu Expo e evita dor de cabeça.

# Core React/React Native (Expo fixa versões compatíveis)
npx expo install react react-native

# Pacotes Expo que o projeto usa
npx expo install expo-font
npx expo install expo-file-system
npx expo install @expo/vector-icons

# Supabase e sessão local
npx expo install @supabase/supabase-js
npx expo install @react-native-async-storage/async-storage

# Safe area (usado no código com useSafeAreaInsets)
npx expo install react-native-safe-area-context

# Worklets (recomendado: 0.5.1 passou no expo-doctor)
npx expo install react-native-worklets@0.5.1

# (Opcional – se você usa calendário/agenda em alguma tela)
npx expo install react-native-calendars

Conferência de compatibilidade
# Ajusta versões esperadas pelo Expo (ex.: expo 54.0.21, RN 0.81.5 etc.)
npx expo-doctor


Se o expo-doctor sugerir pequenas atualizações (ex.: expo@54.0.21, react-native@0.81.5, expo-font@~14.0.9, expo-file-system@~19.0.17, @expo/vector-icons@^15.0.3), rode novamente npx expo install --fix ou instale o pacote específico com npx expo install NOME@VERSAO_SUGERIDA.

⚙️ Configuração do Supabase

Crie um projeto no Supabase, copie a URL e a anon/public key.

Crie um arquivo .env na raiz:

EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sua-public-key-aqui


Exemplo mínimo do client (src/config/supabaseClient.ts ou .js):

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


SQL inicial (ajuste nomes/relacionamentos conforme seu app):

-- Tabela de produtores
create table if not exists productor (
  id uuid primary key default uuid_generate_v4(),
  nome text not null,
  email text unique not null,
  created_at timestamp with time zone default now()
);

-- Tabela de cultivos
create table if not exists cultivo (
  id uuid primary key default uuid_generate_v4(),
  productor_id uuid references productor(id) on delete cascade,
  nome text not null,
  descricao text,
  created_at timestamp with time zone default now()
);

-- RLS
alter table productor enable row level security;
alter table cultivo enable row level security;

-- Policies mínimas (ajuste depois para restringir por usuário autenticado)
create policy "insert_productor" on productor for insert with check (true);
create policy "select_productor" on productor for select using (true);
create policy "insert_cultivo"   on cultivo  for insert with check (true);
create policy "select_cultivo"   on cultivo  for select using (true);


Dica de segurança: depois que tudo estiver funcionando, troque as policies “abertas” por regras baseadas no auth.uid() para vincular registros ao usuário logado.

▶️ Executando o projeto
npx expo start
# Leia o QR Code no Expo Go OU rode no emulador

🧩 Scripts úteis
# Limpar caches se algo "quebrar"
rm -rf node_modules package-lock.json
npm cache verify
npx expo start -c

# Conferir compatibilidades
npx expo-doctor

🛠️ Solução de problemas comuns

Erro: @react-native-async-storage/async-storage is added as a dependency ... but it doesn't seem to be installed
Causa: pacote não instalado corretamente / cache confuso.
Como resolver:

rm -rf node_modules package-lock.json
npm cache verify
npx expo install @react-native-async-storage/async-storage
npm install


Erro do npm: Override without name: react-native-calendars/react-native-safe-area-context
Causa: campo overrides malformado no package.json (ou lockfile corrompido).
Como resolver:

Abra o package.json e remova qualquer bloco overrides que não tenha chaves válidas.

Limpe e reinstale:

rm -rf node_modules package-lock.json
npm cache verify
npm install


Reaplique dependências com npx expo install --fix e rode npx expo-doctor.

expo-doctor pedindo versões específicas (ex.: expo@54.0.21, react-native@0.81.5)
Use:

npx expo install expo@54.0.21 react-native@0.81.5
npx expo install --fix
npx expo-doctor

👨‍💻 Desenvolvido por

Aplicativo acadêmico (TCC) — pelos guri da catequese 💪🔥
Nunca foi sorte, sempre foi Deus 🙌✨
