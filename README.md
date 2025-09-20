# 🌱 Aplicativo de Cadastro de Produtores e Cultivos

Este é um aplicativo desenvolvido em **React Native com Expo** para gerenciamento de produtores e seus cultivos.  
O app utiliza **Supabase** como backend para autenticação (login/cadastro) e banco de dados.  

---

## 🚀 Tecnologias utilizadas

- [Expo](https://expo.dev/) (v54)
- [React Native](https://reactnative.dev/)
- [Supabase](https://supabase.com/) (Auth + Database)
- [AsyncStorage](https://github.com/react-native-async-storage/async-storage) (armazenamento local de sessão)
- Outros pacotes auxiliares

---

## 📦 Instalação

Clone este repositório:

```bash
git clone https://github.com/SEU-USUARIO/SEU-REPO.git
cd SEU-REPO
Instale as dependências principais:

bash
Copiar código
npm install expo@^54.0.0
npx expo install --fix
npx expo-doctor
Dependências do projeto
bash
Copiar código
npx expo install expo-font react-native-worklets
npx expo install react react-native
npx expo install @supabase/supabase-js
npx expo install @react-native-async-storage/async-storage
⚙️ Configuração do Supabase
Crie um projeto no Supabase.

Copie sua URL do projeto e a anon/public key.

Crie um arquivo .env na raiz do projeto:

env
Copiar código
EXPO_PUBLIC_SUPABASE_URL=https://SEU-PROJETO.supabase.co
EXPO_PUBLIC_SUPABASE_KEY=sua-public-key-aqui
Configure as tabelas no Supabase usando o SQL abaixo:

sql
Copiar código
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

-- Permissões para produtores
alter table productor enable row level security;
alter table cultivo enable row level security;

-- Policies para permitir que o usuário insira seus próprios dados
create policy "Permitir inserir no productor"
on productor for insert
with check (true);

create policy "Permitir selecionar do productor"
on productor for select
using (true);

create policy "Permitir inserir cultivo vinculado ao usuário"
on cultivo for insert
with check (true);

create policy "Permitir selecionar cultivo vinculado"
on cultivo for select
using (true);
▶️ Executando o projeto
Inicie o servidor de desenvolvimento:

bash
Copiar código
npx expo start
Depois, abra no celular pelo Expo Go ou emulador Android/iOS.

👨‍💻 Desenvolvido por
Aplicativo desenvolvido para fins acadêmicos (TCC) pelos guri da catequese 💪🔥
Nunca foi sorte, sempre foi Deus 🙌✨
