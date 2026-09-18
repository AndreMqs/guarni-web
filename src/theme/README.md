# Tema do Guarni

`types.ts` define o contrato interno, sem tipos do Mantine. `defaultTheme.ts` contém
o fallback claro. `restaurantThemes.ts` contém uma configuração escura ilustrativa
e a escolha atual por código, em `activeTheme`.

Para revisar o modo escuro, altere somente:

```ts
export const activeTheme = exampleDarkTheme
```

Execute `npm run dev` e confira fundo, textos, links, contador, hover e foco pelo
teclado. Depois volte para `defaultTheme`. A escolha é explícita por código e não
depende do sistema operacional ou de uma preferência salva no navegador.
O template inicial continua sendo usado para essa conferência.

As duas configurações são exemplos locais; ainda não existe associação a IDs de
unidades. Quando esse contexto existir, unidades sem configuração usarão o fallback.
Hoje a aplicação inteira usa o tema padrão, inclusive o ponto de entrada.

`createMantineTheme.ts` adapta a configuração para o Mantine e expõe variáveis
`--guarni-*`, disponíveis em CSS e nos futuros SCSS Modules. Por exemplo:

```css
.panel {
  background: var(--guarni-surface);
  color: var(--guarni-text);
  padding: var(--guarni-spacing-md);
  border: var(--guarni-border-width) solid var(--guarni-border);
  border-radius: var(--guarni-radius-md);
}
```

Cores ficam no tema. A cor primária tem uma paleta de dez tons; `shade` escolhe
o tom normal, e o seguinte define o hover. O Mantine calcula a cor de texto para
contraste, também disponível em `--guarni-on-primary`. Cores semânticas cobrem
fundo, superfície, texto, borda, sucesso, aviso, erro, foco e estados desabilitados.
Dimensões da configuração são em pixels de referência e viram `rem` na adaptação,
mantendo a escala padrão do navegador (16 px) e respeitando o zoom do usuário.

Os testes de `npm run test:theme` verificam as duas configurações, o fallback,
a adaptação, as variáveis usadas pelo CSS e contrastes mínimos de 4,5:1 para os
pares de texto avaliados e 3:1 para foco e bordas. Eles usam Vitest; os testes do
provider usam React Testing Library para conferir os tokens no DOM e a escolha
de tema por código. Consulte a [base de testes](../test/README.md) para os comandos
e o helper de renderização. Estes testes não substituem a revisão dos futuros
componentes e seus estados na tela.

Referências: [tema Mantine](https://mantine.dev/theming/theme-object/) e
[variáveis CSS](https://mantine.dev/styles/css-variables/).
