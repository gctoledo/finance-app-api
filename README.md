# Finance App

Projeto de um dashboard financeiro para organização das finanças, onde o usuário poderá cadastrar sua conta, registrar suas despesas, ganhos e investimentos.

## 🔥 Introdução

O projeto consiste em um dashboard financeiro, como citado anteriormente. Nele tentei ao máximo seguir os princípios de SOLID, utilizando Clean Architecture, dividindo o projeto em camadas e suas funções, sendo elas os Controllers (responsáveis por receber e responder as requisições), Use Cases (responsáveis pelas regras de negócio) e Repositories (responsáveis pela comunicação com o banco de dados), facilitando assim a manutenção, legibilidade e teste do código. Todos os dados ficam armazenados em um banco de dados PostgreSQL e toda a comunicação com o banco de dados fica responsável pelo Prisma ORM. Esse repositório contém o back-end do projeto, onde criei uma API REST em que as rotas foram criadas utilizando Express com Node.js.

O projeto também possui uma branch onde deixei a versão do projeto antes da migração para o Prisma, para fins didáticos.

#

Rotas disponíveis:

Usuário:

-   Seleção do usuário por ID (GET)

-   Seleção do balanço financeiro do usuário (GET)

-   Criação (POST)

-   Remoção (DELETE)

-   Atualização (PATCH)

Transações:

-   Seleção de transações (GET)

-   Criação (POST)

-   Remoção (DELETE)

-   Atualização (PATCH)

#

### 🔨 Guia de instalação

Para visualizar o projeto é necessário possuir o NodeJS instalado em sua máquina. Você pode fazer um clone do repositório e executar os seguintes comandos no terminal para visualizar o projeto:

Clone o projeto

```
  git clone https://github.com/gctoledo/finance-app-api
```

Entre no diretório do projeto

```
  cd finance-app-api
```

Instale as dependências

```
  npm install
```

Inicie o servidor

```
  npm run start:dev
```

## 📦 Tecnologias usadas:

-   ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
-   ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
-   ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
-   ![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
