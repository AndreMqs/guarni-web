# Guarni Web

Frontend mobile-first do Guarni, checklist operacional para restaurantes.

## Stack

- React + TypeScript + Vite
- Mantine encapsulado pelos componentes internos do projeto
- Zustand para estado compartilhado quando necessário
- SCSS Modules
- TanStack Query
- Zod
- Vitest + React Testing Library

## Executar

```bash
npm ci
npm run dev
```

Build, testes e lint:

```bash
npm run build
npm test
npm run lint
```

## Implementação atual

A aplicação contém a primeira implementação completa das telas de produto presentes nas referências do Penpot/PDFs. O código da aplicação não depende dos identificadores dos wireframes: arquivos, componentes, rotas e stores usam nomes descritivos baseados em domínio e comportamento.

As telas de tarefas, histórico, usuários, configurações, auditoria e mídia usam dados de demonstração enquanto os respectivos contratos do backend não estiverem disponíveis. Não foram criados endpoints HTTP fictícios.

O login mantém o contrato já previsto para `POST /v1/auth/login`, embora a função de API continue mockada nesta fase.

As referências de design e regras de negócio continuam em `docs/design/guarni/` e `docs/frontend-context.md`.

## Organização

- `src/components`: componentes internos de UI; cada componente reutilizável possui sua própria pasta e encapsula Mantine ou a primitiva visual correspondente
- `src/views/Employee`: telas e estados da operação diária
- `src/views/Management`: telas de gestão
- `src/views/Audit`: auditoria, retenção e estados excepcionais
- `src/navigation`: rotas descritivas, tipos e store Zustand de navegação
- `src/theme`: tema semântico centralizado
- `src/api`, `src/hooks`, `src/schemas`, `src/constants`: contratos e lógica já existentes, organizados por responsabilidade

Views e componentes de negócio não importam Mantine diretamente. Componentes compostos reutilizam os wrappers internos do Guarni, preservando a possibilidade de trocar a implementação visual sem reescrever as telas.

Os wireframes contêm pequenas inconsistências visuais. A implementação preserva conteúdo, hierarquia e fluxos, mas corrige alinhamentos, espaçamentos e responsividade em vez de reproduzir esses defeitos pixel a pixel.
