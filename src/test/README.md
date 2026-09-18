# Testes do frontend

- `npm test`: executa a suíte uma vez.
- `npm run test:watch`: acompanha alterações durante o desenvolvimento.
- `npm run test:theme`: executa somente os testes em `src/theme`.
- `npm run build`: verifica também os tipos dos testes, além de gerar o bundle.

Os arquivos `*.test.ts` e `*.test.tsx` ficam junto do código testado. Importe
`test`, `expect` e demais funções do Vitest explicitamente. Os testes têm um
tsconfig próprio para manter os tipos de Node separados da aplicação.

Para componentes, importe `render` de `src/test/render.ts`. Esse helper usa o
`ThemeProvider` real do Guarni. Importe consultas como `screen` de
`@testing-library/react` e use `userEvent.setup()` de `@testing-library/user-event`
quando houver interações a verificar. Prefira consultas por papel e nome acessível.

O setup carrega os matchers de `@testing-library/jest-dom/vitest`, limpa o DOM
entre testes e fornece `matchMedia`, ausente no jsdom. Outros mocks de navegador
serão acrescentados somente quando algum componente precisar deles.

O setup também fornece `ResizeObserver` e os eventos de `document.fonts`, usados
pelo Mantine em abas e campos de texto com altura automática, conforme o
[guia de testes do Mantine](https://mantine.dev/guides/vitest/).

Para hooks com React Query, use `createQueryTestContext` de `src/test/query.tsx`.
Cada teste cria seu próprio cliente, desativa retries e limpa o cache no
`afterEach`. Os testes exercitam consultas e mutations reais; spies simulam
falhas na fronteira da API, sem substituir o React Query.

A cobertura dos fluxos inclui:

- Login por perfil, falha com nova tentativa e limpeza do cache no logout.
- Rotas por área, deep links, hash inválido e sincronização com `popstate`.
- Filtros de tarefas, consultas desabilitadas, atualização após conclusão e
  preservação do cache quando o salvamento falha.
- Invalidação de dados de gestão e atualização das configurações da unidade.
- Atualização de mídias e comprovante de correção na auditoria.
- Seleção de tarefas, foto obrigatória, envio e limpeza do rascunho de execução,
  e justificativa obrigatória para tarefas não feitas.

As APIs atuais são mocks em memória. Estes testes verificam os contratos do
frontend e não substituem testes com um backend real ou testes E2E no navegador.

Os testes do tema preservam as verificações de paleta, contraste e fallback.
Os testes do provider conferem a integração dos tokens com o DOM e que a
configuração por código prevalece sobre uma preferência salva.

jsdom não valida layout, responsividade ou aparência: essas verificações continuam
no navegador. Não há mudança de comportamento do provider para o ambiente de testes.

Referências: [Vitest](https://vitest.dev/guide/),
[React Testing Library](https://testing-library.com/docs/react-testing-library/setup/)
e [Mantine com Vitest](https://mantine.dev/guides/vitest/).
