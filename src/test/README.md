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

Os testes do tema preservam as verificações de paleta, contraste e fallback.
Os testes do provider conferem a integração dos tokens com o DOM e que a
configuração por código prevalece sobre uma preferência salva.

jsdom não valida layout, responsividade ou aparência: essas verificações continuam
no navegador. Não há mudança de comportamento do provider para o ambiente de testes.

Referências: [Vitest](https://vitest.dev/guide/),
[React Testing Library](https://testing-library.com/docs/react-testing-library/setup/)
e [Mantine com Vitest](https://mantine.dev/guides/vitest/).
