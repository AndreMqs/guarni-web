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

As telas de tarefas, histórico, usuários, configurações, auditoria e mídia usam dados de demonstração enquanto os respectivos contratos do backend não estiverem disponíveis. Os dados simulados e seu comportamento ficam exclusivamente em `src/api`; as views nunca consomem mocks diretamente.

O fluxo de dados segue `view → hook do TanStack Query → função de src/api`. Tabs, buscas, filtros, seleção e outros estados puramente visuais são controlados pelo frontend. Quando um endpoint real estiver disponível, a intenção é substituir somente a implementação da função em `src/api`, preservando os hooks e as views.

O login continua mockado nesta fase e retorna o perfil usado na navegação da demonstração. Na integração com o backend, esse perfil deverá vir da sessão/membership autenticada.

Contas de demonstração (senha `demonstracao123`):

- `demo`: dono, com acesso à gestão e à execução de tarefas.
- `demo.funcionario`: funcionário, com acesso às tarefas e ao histórico de execução.

Dono e gerente acessam **Executar tarefas** no painel Hoje ou no menu Mais.
Dentro da execução, **Mais → Voltar à gestão** retorna ao painel. Todos os
usuários ativos podem ser responsáveis por tarefas, independentemente do papel.

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
