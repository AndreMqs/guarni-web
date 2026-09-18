# Schemas do frontend

Os schemas validam e normalizam dados antes de uma chamada HTTP. Eles melhoram a
experiência do formulário, mas a API continua responsável pela validação e pela
autorização definitiva.

## Login

`auth.ts` agrupa os schemas do contexto de autenticação. O contrato de login foi
conferido em 18/09/2026 contra o repositório local `guarni-api`, branch `main`,
commit `b431649`:

- `POST /v1/auth/login` recebe somente `username` e `password`.
- `username` usa `trim` e lowercase, aceita `a-z`, números, `.`, `_` e `-`, com
  comprimento entre 1 e 60 caracteres.
- `password` não é normalizada e aceita de 12 a 128 caracteres.
- A API retorna `401` com mensagem genérica quando as credenciais não conferem.

`LoginFormValues` representa os valores recebidos do formulário e
`LoginCredentials` representa a saída normalizada pronta para envio. O schema não
define armazenamento do token, cliente HTTP, refresh ou comportamento de sessão.

As constantes locais espelham o contrato HTTP atual porque os repositórios são
separados. Ao alterar o DTO correspondente na API, atualizar as constantes e os
testes do frontend no mesmo fluxo de integração.

## Organização

Schemas, constantes, APIs e hooks são agrupados em arquivos por contexto de
negócio, como `auth.ts` ou `tasks.ts`. Um novo arquivo não deve ser criado para
cada função, query, mutation ou schema. Componentes visuais permanecem isolados
com sua implementação, tipos, estilos e testes.
