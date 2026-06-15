# 🚌 Sistema de Transporte Público Urbano - MongoDB

Este projeto modela a operação de uma rede de transporte público urbano utilizando a arquitetura NoSQL orientada a documentos do **MongoDB**. 

O modelo permite armazenar estruturas hierárquicas diretamente nos documentos (como paradas embutidas nas rotas e ocorrências embutidas nas viagens), eliminando a necessidade de múltiplos JOINs. O sistema abrange a gestão de linhas, frota de veículos, motoristas, passageiros (com bilhetagem eletrônica) e os registros transacionais de cada viagem.

## 🗂️ Estrutura do Repositório

O projeto está dividido em três scripts lógicos, que devem ser executados de forma sequencial para garantir o fluxo de criação e operação do sistema de transportes:

* `01_setup_insertion.mongodb.js`: **A Fundação.** Seleciona o banco `transportePublico` e popula as cinco coleções principais (`linhas`, `veiculos`, `motoristas`, `passageiros` e `viagens`) com dados representativos.
* `02_update_remove.mongodb.js`: **A Manutenção.** Simula operações diárias de gestão (CRUD), como a atualização de status de veículos para manutenção e a limpeza de registros de usuários inativos.
* `03_consults.mongodb.js`: **A Inteligência.** Um compilado de 31 scripts de consulta que exploram de ponta a ponta os recursos do MongoDB. Realiza buscas complexas, junções, cálculos de métricas operacionais e avaliações de desempenho.

## 🚀 Como executar o projeto

Para testar este banco de dados localmente, é necessário possuir o **MongoDB Community Server** e o **MongoDB Compass** instalados.

### Passo a passo de execução via MongoDB Compass (mongosh):

1. Abra o MongoDB Compass e conecte-se ao seu servidor local (geralmente `mongodb://localhost:27017`).
2. Abra o terminal integrado clicando em `>_ Open MongoDB shell`.
3. Copie o conteúdo do arquivo `01_setup_insertion.mongodb.js`, cole no terminal e pressione `Enter` para criar o ecossistema.
4. No menu lateral esquerdo, clique em "Refresh" para visualizar o banco `transportePublico` e suas coleções.
5. Em seguida, copie e execute os arquivos `02_update_remove.mongodb.js` e `03_consults.mongodb.js` diretamente no terminal para aplicar as atualizações de estado e extrair os relatórios gerados.

## 🛠️ Tecnologias e Conceitos Aplicados

Este projeto serve como um laboratório abrangente de operações MongoDB, cobrindo exigências acadêmicas e técnicas por meio de:
* **Modelagem NoSQL:** Embedding (aninhamento) vs Referenciação.
* **Aggregation Pipeline:** Uso aprofundado de operadores como `$lookup` (para simular JOINs), `$match`, `$group`, `$project` e `$unwind`.
* **Operadores Clássicos e Lógica Estrutural:** Implementação de `MapReduce` para processamento de rotinas de custo e `$where` para avaliação de condições lógicas via JavaScript.
* **Lógica Condicional:** Aninhamento de `$cond` para fluxos de decisão dinâmicos.
* **Buscas Otimizadas:** Criação de índices compostos e buscas textuais (`$text`, `$search`).