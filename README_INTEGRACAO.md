# FAST Frete — Frontend integrado ao backend Spring Boot

Este frontend usa diretamente a API Spring Boot em `http://localhost:8080/api`.

## Executar localmente

Na raiz deste projeto, onde está o `package.json`:

```cmd
copy .env.example .env
pnpm install
pnpm dev
```

Abra `http://localhost:5173`.

O backend precisa estar rodando separadamente:

```cmd
cd caminho\\fastfrete_backend
mvn spring-boot:run
```

A API deve responder em:

```text
http://localhost:8080/api/health
```

## Integrações implementadas

- Login em `POST /auth/login`, com sessão persistida no navegador;
- dashboard em `GET /dashboard/summary`;
- lista, filtro, paginação, consulta, criação, recálculo e exclusão de pedidos;
- criação de pedido com itens reais do catálogo;
- simulação com cidades, produtos e valores retornados pelo backend;
- administração de cidades e produtos com busca, ativação, criação e exclusão;
- histórico de importações em `GET /imports`;
- upload de tarifas e produtos em endpoints multipart;
- upload de PDF com cidade e valor do frete;
- logout local da sessão.

O arquivo `src/lib/api.ts` centraliza todos os endpoints e a conversão de moeda, números e datas.
