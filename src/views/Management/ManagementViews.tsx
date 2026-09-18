import {
  Avatar,
  BottomSheet,
  Button,
  Card,
  Checkbox,
  DetailRows,
  FormField,
  Frame,
  Group,
  MenuCard,
  Notice,
  ProgressBar,
  SearchField,
  Select,
  SelectionCard,
  Stack,
  StatusBadge,
  SuccessState,
  SummaryMetrics,
  Tabs,
  TaskCard,
  Text,
  TextArea,
  TextButton,
  TextInput,
  Timeline,
  Title,
  ToggleRow,
} from '../../components';
import { routes, type AppRoute, type Navigate } from '../../navigation';

const managerTasks = [
  { title: 'Higienizar bancada da cozinha', date: '31 ago', assignee: 'Geral', status: 'Pendente' },
  { title: 'Conferir validade dos molhos', date: '31 ago', assignee: 'Marina Souza', status: 'Pendente' },
  { title: 'Limpeza profunda do estoque', date: '30 ago', assignee: 'Geral', status: 'Feita' },
];

const tasksByDate = [
  { title: 'Higienizar bancada da cozinha', due: '10:00', assignee: 'Geral', evidence: 'Criada manualmente' },
  { title: 'Conferir validade dos molhos', due: '15:00', assignee: 'Marina Souza', evidence: 'Criada manualmente' },
  { title: 'Fotografar fechamento do caixa', due: '23:30', assignee: 'Rafael Lima', evidence: 'Foto obrigatória' },
];

function ManagerDashboardView({ navigate, isUnitSelectionOpen = false }: { navigate: Navigate; isUnitSelectionOpen?: boolean }) {
  return (
    <Frame title="Restaurante Tatuapé" action="TROCAR" onAction={() => navigate(routes.management.unitSelection)} navigate={navigate} bottomNav="today" navMode="management">
      <Stack gap="lg">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <Stack gap={2}><Title order={2}>Boa noite, André</Title><Text size="xs" tone="muted">Fechamento operacional às 03:00</Text></Stack>
          <Text size="xs" tone="success">Atualizado agora</Text>
        </Group>

        <Card onClick={() => navigate(routes.management.previousDaySummary)}>
          <Stack>
            <Group justify="space-between"><Text weight={700}>Ontem · 31 ago</Text><StatusBadge tone="neutral">Encerrado</StatusBadge></Group>
            <Group justify="space-between"><Text size="sm">16 de 18 tarefas feitas</Text><Text weight={700}>89%</Text></Group>
            <ProgressBar value={89} />
            <Text size="xs" tone="danger">2 tarefas precisam de revisão</Text>
            <TextButton>Revisar o que não foi feito ›</TextButton>
          </Stack>
        </Card>

        <Card onClick={() => navigate(routes.management.currentDaySummary)}>
          <Stack>
            <Group justify="space-between"><Text weight={700}>Hoje · 1 set</Text><StatusBadge tone="pending">Em andamento</StatusBadge></Group>
            <Group justify="space-between"><Text size="sm">14 de 18 tarefas feitas</Text><Text weight={700}>78%</Text></Group>
            <ProgressBar value={78} />
            <Text size="xs" tone="warning">3 pendentes · 1 atrasada</Text>
            <TextButton>Ver tarefas pendentes ›</TextButton>
          </Stack>
        </Card>

        <MenuCard icon="◷" title="Outros dias" subtitle="Consultar o histórico completo" onClick={() => navigate(routes.management.history)} />
      </Stack>

      {isUnitSelectionOpen && (
        <BottomSheet>
          <Stack gap="lg">
            <Stack gap="xs"><Title order={2}>Trocar restaurante</Title><Text tone="muted">Veja rapidamente a situação de cada unidade.</Text></Stack>
            <SelectionCard initials="RT" title="Restaurante Tatuapé" subtitle="Hoje: 14 de 18 feitas · Ontem: 2 não feitas" isSelected />
            <SelectionCard initials="RL" title="Restaurante Liberdade" subtitle="Hoje: 17 de 20 feitas · 3 pendentes" />
            <Button isFullWidth onClick={() => navigate(routes.management.dashboard)}>ABRIR UNIDADE SELECIONADA</Button>
            <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.dashboard)}>CANCELAR</Button>
          </Stack>
        </BottomSheet>
      )}
    </Frame>
  );
}

function ManagementMenuView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Mais" navigate={navigate} bottomNav="more" navMode="management">
      <Stack gap="lg">
        <Card>
          <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap"><Avatar initials="AC" /><Stack gap={0}><Text weight={700}>André Câmara</Text><Text size="xs" tone="muted">Gerente · Unidade Tatuapé</Text></Stack></Group>
            <Text>⌄</Text>
          </Group>
        </Card>
        <Stack><Text size="xs" tone="muted" weight={700}>GESTÃO</Text><MenuCard icon="✓" title="Cadastro de tarefas" subtitle="Criar, editar e copiar tarefas" onClick={() => navigate(routes.management.taskCatalog)} /><MenuCard icon="▦" title="Tarefas por data" subtitle="Consultar tarefas por data" onClick={() => navigate(routes.management.tasksByDate)} /><MenuCard icon="●" title="Usuários" subtitle="Papéis, acessos e responsáveis" onClick={() => navigate(routes.management.users)} /><MenuCard icon="⚙" title="Configurações" subtitle="Visão operacional da unidade" onClick={() => navigate(routes.management.unitSettings)} /></Stack>
        <Stack><Text size="xs" tone="muted" weight={700}>CONTA</Text><MenuCard icon="↪" title="Sair" subtitle="Encerrar esta sessão" /></Stack>
      </Stack>
    </Frame>
  );
}

function TaskCatalogView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Cadastro de tarefas" action="+ NOVA" onAction={() => navigate(routes.management.taskCreateDetails)} backTo={routes.management.menu} navigate={navigate}>
      <Stack gap="lg">
        <SearchField placeholder="Buscar atividade" />
        <Tabs items={['Todas', 'Hoje', 'Futuras', 'Passadas']} active="Todas" />
        <Text size="xs" tone="muted">18 tarefas cadastradas</Text>
        <Stack>
          {managerTasks.map((task) => (
            <TaskCard
              key={task.title}
              title={task.title}
              status={task.status}
              tone={task.status === 'Feita' ? 'done' : 'pending'}
              due={task.date}
              assignee={task.assignee}
              action={(
                <Group justify="space-between" style={{ marginTop: 10 }}>
                  <Text size="xs" tone="muted">Criada manualmente</Text>
                  <TextButton onClick={(event) => { event.stopPropagation(); navigate(routes.management.taskCopy); }}>COPIAR</TextButton>
                </Group>
              )}
              onClick={() => navigate(routes.management.taskEditConfirmation)}
            />
          ))}
        </Stack>
        <Text size="xs" tone="muted">Copiar cria outra tarefa independente na data escolhida.</Text>
      </Stack>
    </Frame>
  );
}

function TaskDetailsFormView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Cadastrar tarefa" backTo={routes.management.taskCatalog} navigate={navigate}>
      <Stack gap="lg">
        <Text size="xs">Etapa 1 de 3</Text><ProgressBar value={33} /><Title order={2}>Informações principais</Title>
        <FormField label="Título *"><TextInput placeholder="Ex.: Higienizar bancada" /></FormField>
        <FormField label="Descrição (opcional)"><TextArea placeholder="Explique o que deve ser feito" /></FormField>
        <Stack><Text size="sm" weight={600}>Tipo de atribuição</Text><SelectionCard icon="✓" title="Geral" subtitle="Qualquer funcionário pode executar" isSelected /><SelectionCard icon="○" title="Pessoal" subtitle="Exige um responsável específico" onClick={() => navigate(routes.management.assigneeSelection)} /></Stack>
        <Text size="xs" tone="muted">No MVP não há categoria, prioridade ou subtarefas.</Text>
        <Button isFullWidth onClick={() => navigate(routes.management.taskCreateDate)}>CONTINUAR</Button>
      </Stack>
    </Frame>
  );
}

function AssigneeSelectionView({ navigate }: { navigate: Navigate }) {
  const users = [
    { initials: 'MS', name: 'Marina Souza', role: 'Funcionária' },
    { initials: 'RL', name: 'Rafael Lima', role: 'Funcionário · Ativo' },
    { initials: 'JV', name: 'João Vieira', role: 'Funcionário · Ativo' },
    { initials: 'CM', name: 'Carla Mendes', role: 'Gerente · Ativo' },
  ];
  return (
    <Frame title="Responsável" action="CONFIRMAR" onAction={() => navigate(routes.management.taskCreateDate)} backTo={routes.management.taskCreateDetails} navigate={navigate}>
      <Stack gap="lg">
        <Stack gap="xs"><Text size="xs" tone="muted" weight={700}>ATIVIDADE PESSOAL</Text><Title order={2}>Escolha um usuário ativo</Title></Stack>
        <SearchField placeholder="Buscar por nome ou usuário" />
        <Stack>{users.map((user, index) => <SelectionCard key={user.name} initials={user.initials} title={user.name} subtitle={user.role} isSelected={index === 0} />)}</Stack>
        <Text size="xs" tone="muted">A lista exibe somente usuários ativos da unidade.</Text>
      </Stack>
    </Frame>
  );
}

function TaskDateFormView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Cadastrar tarefa" backTo={routes.management.taskCreateDetails} navigate={navigate}>
      <Stack gap="lg">
        <Text size="xs">Etapa 2 de 3</Text><ProgressBar value={66} /><Title order={2}>Quando executar?</Title>
        <FormField label="Data de execução *"><TextInput type="date" value="2026-08-31" /></FormField>
        <Text size="xs" tone="muted">Escolha hoje ou outra data para esta tarefa.</Text>
        <Notice tone="warning">Para repetir uma tarefa depois, use Copiar tarefa.</Notice>
        <Button isFullWidth onClick={() => navigate(routes.management.taskCreateRules)}>CONTINUAR</Button>
      </Stack>
    </Frame>
  );
}

function TaskRulesFormView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Cadastrar tarefa" backTo={routes.management.taskCreateDate} navigate={navigate}>
      <Stack gap="lg">
        <Text size="xs">Etapa 3 de 3</Text><ProgressBar value={100} /><Title order={2}>Regras de execução</Title>
        <FormField label="Horário limite"><TextInput type="time" value="10:00" /></FormField>
        <ToggleRow title="Evidência obrigatória" subtitle="Exigir uma foto para concluir" />
        <ToggleRow title="Comentário do executor" subtitle="Campo opcional na conclusão" />
        <Text size="xs" tone="muted">Se a evidência não for obrigatória, a tarefa poderá ser concluída sem mídia. “Não feita” sempre exige justificativa.</Text>
        <Button isFullWidth onClick={() => navigate(routes.management.taskCreateReview)}>✓ &nbsp; REVISAR TAREFA</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.taskCreateDate)}>VOLTAR</Button>
      </Stack>
    </Frame>
  );
}

function TaskEditView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Editar tarefa" backTo={routes.management.taskCatalog} navigate={navigate}>
      <Stack gap="lg"><Title order={2}>Conferir validade dos molhos</Title><FormField label="Horário limite"><TextInput type="time" value="15:00" /></FormField><ToggleRow title="Evidência obrigatória" subtitle="Exigir uma foto para concluir" /><Button isFullWidth>SALVAR ALTERAÇÕES</Button></Stack>
      <BottomSheet>
        <Stack gap="lg">
          <Stack gap="xs"><Title order={2}>Aplicar alterações?</Title><Text tone="muted">As mudanças serão aplicadas somente a esta tarefa pendente.</Text></Stack>
          <Notice tone="success"><Stack gap={2}><Text weight={700}>Histórico preservado</Text><Text size="sm">Outras tarefas e registros de execução não serão modificados.</Text></Stack></Notice>
          <Button isFullWidth onClick={() => navigate(routes.management.taskCatalog)}>CONFIRMAR ALTERAÇÕES</Button>
          <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.taskCatalog)}>CANCELAR</Button>
        </Stack>
      </BottomSheet>
    </Frame>
  );
}

function UsersView({ navigate }: { navigate: Navigate }) {
  const users = [
    { initials: 'AC', name: 'André Câmara', role: 'Dono' },
    { initials: 'CM', name: 'Carla Mendes', role: 'Gerente' },
    { initials: 'MS', name: 'Marina Souza', role: 'Funcionária' },
    { initials: 'RL', name: 'Rafael Lima', role: 'Funcionário' },
    { initials: 'JV', name: 'João Vieira', role: 'Funcionário' },
  ];
  return (
    <Frame title="Usuários" action="+ NOVO" backTo={routes.management.menu} navigate={navigate}>
      <Stack gap="lg">
        <SearchField placeholder="Buscar usuário" /><Text size="xs" tone="muted">8 usuários ativos</Text>
        <Stack>{users.map((user) => <SelectionCard key={user.name} initials={user.initials} title={user.name} subtitle={`${user.role} · Ativo`} onClick={() => navigate(routes.management.userEdit)} />)}</Stack>
        <Notice tone="warning">A unidade deve manter pelo menos um dono ativo.</Notice>
      </Stack>
    </Frame>
  );
}

function EditUserView({ navigate }: { navigate: Navigate }) {
  const roles = [
    { title: 'Funcionário', subtitle: 'Executa e consulta tarefas' },
    { title: 'Gerente', subtitle: 'Gerencia atividades, usuários e configurações' },
    { title: 'Dono', subtitle: 'Inclui permissões de auditoria de negócio' },
  ];
  return (
    <Frame title="Editar usuário" backTo={routes.management.users} navigate={navigate}>
      <Stack gap="lg">
        <Group wrap="nowrap"><Avatar initials="CM" /><Stack gap={0}><Title order={2}>Carla Mendes</Title><Text size="xs" tone="muted">carla</Text></Stack></Group>
        <Stack><Text size="sm" weight={600}>Papel na unidade</Text>{roles.map((role, index) => <SelectionCard key={role.title} icon={index === 1 ? '✓' : '○'} title={role.title} subtitle={role.subtitle} isSelected={index === 1} />)}</Stack>
        <ToggleRow title="Usuário ativo" subtitle="Pode acessar esta unidade" />
        <Text size="xs" tone="muted">Papéis não são cumulativos. A interface e as permissões seguem o papel selecionado.</Text>
        <Button isFullWidth onClick={() => navigate(routes.management.users)}>SALVAR USUÁRIO</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.userReassignment)}>DESATIVAR ACESSO</Button>
      </Stack>
    </Frame>
  );
}

function UserReassignmentView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Desativar usuário" backTo={routes.management.userEdit} navigate={navigate}>
      <Stack gap="lg">
        <Notice tone="warning"><Stack gap={2}><Text weight={700}>Antes de desativar Marina</Text><Text size="sm">Reatribua as tarefas pendentes vinculadas a ela.</Text></Stack></Notice>
        <Title order={2}>Itens que exigem ação</Title>
        <Card><Group justify="space-between"><Stack gap={2}><Text weight={700}>3 tarefas pendentes</Text><Text size="xs" tone="muted">Hoje e próximos dias</Text></Stack><TextButton>REATRIBUIR</TextButton></Group></Card>
        <Card><Group justify="space-between"><Stack gap={2}><Text weight={700}>2 atividades pessoais</Text><Text size="xs" tone="muted">Criadas para datas futuras</Text></Stack><TextButton>REATRIBUIR</TextButton></Group></Card>
        <Button isFullWidth disabled>DESATIVAR APÓS REATRIBUIÇÃO</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.userEdit)}>CANCELAR</Button>
      </Stack>
    </Frame>
  );
}

function TasksByDateView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Tarefas por data" action="▦" backTo={routes.management.menu} navigate={navigate}>
      <Stack gap="lg">
        <Select value="2026-09-01" options={[{ value: '2026-09-01', label: 'Terça-feira, 1 set' }, { value: '2026-08-31', label: 'Segunda-feira, 31 ago' }]} ariaLabel="Data das tarefas" />
        <Text size="xs" tone="muted">5 tarefas cadastradas</Text>
        <Stack>{tasksByDate.map((task) => <TaskCard key={task.title} title={task.title} due={task.due} assignee={task.assignee} evidence={task.evidence} />)}</Stack>
        <Notice>Datas futuras são permitidas. Alterações ficam sempre vinculadas à tarefa concreta.</Notice>
      </Stack>
    </Frame>
  );
}

function UnitSettingsView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Configurações" backTo={routes.management.menu} navigate={navigate}>
      <Stack gap="lg">
        <Text size="xs" tone="muted" weight={700}>UNIDADE</Text>
        <FormField label="Nome"><TextInput value="Restaurante Tatuapé" /></FormField>
        <FormField label="Fuso horário"><TextInput value="America/Sao_Paulo" readOnly /></FormField>
        <Text size="xs" tone="muted" weight={700}>DIA OPERACIONAL</Text>
        <FormField label="Horário de fechamento *"><TextInput type="time" value="03:00" /></FormField>
        <Notice tone="warning"><Stack gap={2}><Text weight={700}>O que acontece no fechamento</Text><Text size="sm">Pendências viram “Não feita” automaticamente com o motivo padrão, preservando o histórico.</Text></Stack></Notice>
        <Text size="xs" tone="muted">Uma foto por execução. Disponível por 60 dias após o envio.</Text>
        <Button isFullWidth onClick={() => navigate(routes.management.menu)}>SALVAR CONFIGURAÇÕES</Button>
      </Stack>
    </Frame>
  );
}

function TaskReviewView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Revisar tarefa" action="EDITAR" onAction={() => navigate(routes.management.taskCreateDetails)} backTo={routes.management.taskCreateRules} navigate={navigate}>
      <Stack gap="lg">
        <Text tone="muted">Confira os dados antes de cadastrar.</Text>
        <Card><Stack><StatusBadge tone="pending">Tarefa geral</StatusBadge><Title order={2}>Higienizar bancada da cozinha</Title><Text size="sm">Limpar superfície, cantos e área próxima à pia antes do atendimento.</Text></Stack></Card>
        <Card><Stack><Title order={3}>Configuração</Title><DetailRows rows={[{ label: 'Atribuição', value: 'Geral' }, { label: 'Data de execução', value: 'Hoje, 31 ago' }, { label: 'Horário', value: '10:00' }, { label: 'Evidência', value: 'Foto obrigatória' }]} /></Stack></Card>
        <Notice tone="success"><Stack gap={2}><Text weight={700}>Pronta para cadastrar</Text><Text size="sm">Uma nova tarefa será criada para a data escolhida, com status pendente.</Text></Stack></Notice>
        <Button isFullWidth onClick={() => navigate(routes.management.taskCreated)}>✓ &nbsp; CADASTRAR TAREFA</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.taskCreateRules)}>VOLTAR E AJUSTAR</Button>
      </Stack>
    </Frame>
  );
}

function TaskCreatedView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Cadastro concluído" navigate={navigate}>
      <SuccessState title="Tarefa cadastrada" description="“Higienizar bancada da cozinha” foi criada para a data escolhida.">
        <Stack style={{ width: '100%' }}>
          <Card><DetailRows rows={[{ label: 'Data de execução', value: 'Hoje, 31 ago · até 10:00' }, { label: 'Responsável', value: 'Geral' }]} /></Card>
          <Button isFullWidth onClick={() => navigate(routes.management.tasksByDate)}>VER TAREFA CADASTRADA</Button>
          <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.taskCreateDetails)}>CADASTRAR OUTRA TAREFA</Button>
          <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.menu)}>VOLTAR PARA GESTÃO</Button>
        </Stack>
      </SuccessState>
    </Frame>
  );
}

function ManagementHistoryView({ navigate }: { navigate: Navigate }) {
  const days = [
    { day: 'Ontem · 30 ago', count: '16 de 18', rate: 89, note: '2 não feitas', tone: 'danger' as const },
    { day: 'Sábado · 29 ago', count: '14 de 14', rate: 100, note: 'Sem pendências', tone: 'success' as const },
    { day: 'Sexta-feira · 28 ago', count: '19 de 22', rate: 86, note: '3 não feitas', tone: 'danger' as const },
  ];
  return (
    <Frame title="Histórico" action="FILTRAR" navigate={navigate} bottomNav="history" navMode="management">
      <Stack gap="lg">
        <Select value="aug-2026" options={[{ value: 'aug-2026', label: 'Agosto de 2026' }]} ariaLabel="Mês do histórico" />
        <Stack><Title order={2}>Resumo dos dias anteriores</Title><SummaryMetrics values={[{ value: '84%', label: 'concluídas', tone: 'success' }, { value: 11, label: 'não feitas', tone: 'danger' }, { value: 142, label: 'total' }]} /></Stack>
        <Stack><Title order={2}>Dias recentes</Title>{days.map((day) => <Card key={day.day} onClick={() => navigate(routes.management.previousDayDetails)}><Stack gap="sm"><Group justify="space-between"><Text weight={700}>{day.day}</Text><Text weight={700}>{day.rate}%</Text></Group><Group justify="space-between"><Text size="xs" tone="muted">{day.count}</Text><Text size="xs" tone={day.tone}>{day.note}</Text></Group><ProgressBar value={day.rate} /></Stack></Card>)}</Stack>
      </Stack>
    </Frame>
  );
}

function PreviousDayDetailsView({ navigate, showFilters = false }: { navigate: Navigate; showFilters?: boolean }) {
  return (
    <Frame title="Domingo, 30 ago" action="FILTRAR" onAction={() => navigate(routes.management.historyFilters)} backTo={routes.management.history} navigate={navigate}>
      <Stack gap="lg">
        <Group justify="space-between"><Text size="xs" tone="muted">Dia encerrado às 03:00</Text><StatusBadge tone="neutral">Encerrado</StatusBadge></Group>
        <SummaryMetrics values={[{ value: 16, label: 'feitas', tone: 'success' }, { value: 2, label: 'não feitas', tone: 'danger' }, { value: 18, label: 'total' }]} />
        <Tabs items={['Todas', 'Status: todos', 'Responsável: todos']} active="Todas" />
        <Stack><TaskCard title="Higienizar bancada da cozinha" status="Feita" tone="done" due="10:18" assignee="André Câmara" onClick={() => navigate(routes.management.previousDayTaskDetails)} /><TaskCard title="Organizar estoque seco" status="Não feita" tone="danger" due="14:05" assignee="Rafael Lima" onClick={() => navigate(routes.management.previousDayTaskDetails)} /><TaskCard title="Fotografar fechamento do caixa" status="Feita" tone="done" due="23:42" assignee="Marina Souza" /></Stack>
      </Stack>
      {showFilters && (
        <BottomSheet>
          <Stack gap="lg">
            <Title order={2}>Filtrar histórico</Title>
            <Stack><Text size="sm" weight={600}>Status</Text><Checkbox label="Feitas" defaultChecked /><Checkbox label="Não feitas" defaultChecked /><Checkbox label="Pendentes encerradas automaticamente" /></Stack>
            <FormField label="Responsável"><Select value="all" options={[{ value: 'all', label: 'Todos os usuários' }]} /></FormField>
            <FormField label="Período"><TextInput value="28/08/2026 — 30/08/2026" /></FormField>
            <Button isFullWidth onClick={() => navigate(routes.management.previousDayDetails)}>APLICAR FILTROS</Button>
            <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.previousDayDetails)}>LIMPAR FILTROS</Button>
          </Stack>
        </BottomSheet>
      )}
    </Frame>
  );
}

function PreviousDayTaskDetailsView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Detalhe da tarefa" action="⋯" backTo={routes.management.previousDayDetails} navigate={navigate}>
      <Stack gap="lg">
        <StatusBadge tone="danger">Não feita</StatusBadge><Title order={2}>Organizar estoque seco</Title><Text size="xs" tone="muted">Domingo, 30 ago · encerrada às 14:05</Text>
        <Notice tone="danger"><Stack gap={2}><Text weight={700}>Motivo informado</Text><Text size="sm">Faltou o produto de limpeza específico para finalizar a organização.</Text></Stack></Notice>
        <DetailRows rows={[{ label: 'Responsável', value: 'Rafael Lima' }, { label: 'Executor', value: 'Rafael Lima' }, { label: 'Evidência', value: 'Nenhuma' }]} />
        <Stack><Title order={3}>Histórico da ocorrência</Title><Timeline events={[{ title: 'Marcada como não feita', meta: '14:05 · Rafael · motivo informado' }, { title: 'Atribuída ao responsável', meta: '08:00 · Gerente' }]} /></Stack>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.audit.executionCorrection)}>CORRIGIR EXECUÇÃO</Button>
      </Stack>
    </Frame>
  );
}

function PreviousDaySummaryView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Ontem · 31 ago" action="FILTRAR" backTo={routes.management.dashboard} navigate={navigate}>
      <Stack gap="lg">
        <Group justify="space-between"><Text size="xs">Restaurante Tatuapé</Text><Text size="xs" tone="muted">Encerrado 03:00</Text></Group>
        <SummaryMetrics values={[{ value: 16, label: 'feitas', tone: 'success' }, { value: 2, label: 'não feitas', tone: 'danger' }, { value: 18, label: 'total' }]} />
        <Notice tone="danger"><Stack gap={2}><Text weight={700}>O dia fechou com 2 tarefas não feitas</Text><Text size="sm">Revise os motivos informados pela equipe.</Text></Stack></Notice>
        <Title order={2}>Requer atenção</Title>
        <TaskCard title="Organizar estoque seco" status="Não feita" tone="danger" due="14:05" assignee="Rafael Lima" evidence="Motivo informado" onClick={() => navigate(routes.management.previousDayTaskDetails)} />
        <TaskCard title="Fotografar fechamento do caixa" status="Não feita" tone="danger" due="03:00" assignee="Sem executor" evidence="Não concluída até o fechamento" />
        <Notice tone="success">16 tarefas concluídas</Notice>
      </Stack>
    </Frame>
  );
}

function CurrentDaySummaryView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Hoje · 1 set" action="ATUALIZAR" backTo={routes.management.dashboard} navigate={navigate}>
      <Stack gap="lg">
        <Group justify="space-between"><Text tone="primary">Acompanhamento ao vivo</Text><Text tone="success">●</Text></Group>
        <Text size="xs" tone="muted">Fecha às 03:00 · atualizado há 1 min</Text>
        <SummaryMetrics values={[{ value: 14, label: 'feitas', tone: 'success' }, { value: 3, label: 'pendentes' }, { value: 1, label: 'atrasada', tone: 'danger' }]} />
        <Stack gap="xs"><Group justify="space-between"><Text size="xs">78% concluído</Text><Text size="xs">faltam 2h 18m</Text></Group><ProgressBar value={78} /></Stack>
        <Title order={2}>Precisa de atenção</Title><TaskCard title="Higienizar área de atendimento" status="Atrasada" tone="danger" due="22:00" assignee="Marina Souza" />
        <Title order={2}>Ainda pendentes</Title><TaskCard title="Conferir fechamento dos freezers" due="até 01:30" assignee="Rafael Lima" /><TaskCard title="Organizar estoque seco" due="até 02:00" assignee="Geral" evidence="sem responsável" />
      </Stack>
    </Frame>
  );
}

function CopyTaskView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Copiar tarefa" backTo={routes.management.taskCatalog} navigate={navigate}>
      <Stack gap="lg">
        <Text tone="muted">Revise os dados antes de criar a cópia.</Text>
        <FormField label="Título *"><TextInput value="Higienizar bancada da cozinha" /></FormField>
        <FormField label="Descrição (opcional)"><TextArea value="Limpar superfície e cantos antes da abertura." /></FormField>
        <FormField label="Data de execução *"><TextInput type="date" value="2026-08-31" /></FormField>
        <FormField label="Atribuição"><TextInput value="Geral" /></FormField>
        <Checkbox label="Exigir uma foto para concluir" defaultChecked />
        <Text size="xs" tone="muted">A cópia começa pendente. Fotos, justificativas e histórico não são copiados.</Text>
        <Button isFullWidth onClick={() => navigate(routes.management.taskCopyCreated)}>CRIAR CÓPIA</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.taskCatalog)}>CANCELAR</Button>
      </Stack>
    </Frame>
  );
}

function TaskCopyCreatedView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Cópia criada" backTo={routes.management.taskCatalog} navigate={navigate}>
      <SuccessState title="Tarefa copiada" description="Higienizar bancada da cozinha · Hoje, 31 ago · Geral · Status: Pendente">
        <Stack style={{ width: '100%' }}><Text size="xs" tone="muted" align="center">A tarefa original e seu histórico permanecem intactos.</Text><Button isFullWidth onClick={() => navigate(routes.management.taskCatalog)}>VER TAREFAS</Button></Stack>
      </SuccessState>
    </Frame>
  );
}

export function ManagementView({ route, navigate }: { route: AppRoute; navigate: Navigate }) {
  switch (route) {
    case routes.management.dashboard: return <ManagerDashboardView navigate={navigate} />;
    case routes.management.menu: return <ManagementMenuView navigate={navigate} />;
    case routes.management.taskCatalog: return <TaskCatalogView navigate={navigate} />;
    case routes.management.taskCreateDetails: return <TaskDetailsFormView navigate={navigate} />;
    case routes.management.assigneeSelection: return <AssigneeSelectionView navigate={navigate} />;
    case routes.management.taskCreateDate: return <TaskDateFormView navigate={navigate} />;
    case routes.management.taskCreateRules: return <TaskRulesFormView navigate={navigate} />;
    case routes.management.taskEditConfirmation: return <TaskEditView navigate={navigate} />;
    case routes.management.users: return <UsersView navigate={navigate} />;
    case routes.management.userEdit: return <EditUserView navigate={navigate} />;
    case routes.management.userReassignment: return <UserReassignmentView navigate={navigate} />;
    case routes.management.tasksByDate: return <TasksByDateView navigate={navigate} />;
    case routes.management.unitSettings: return <UnitSettingsView navigate={navigate} />;
    case routes.management.taskCreateReview: return <TaskReviewView navigate={navigate} />;
    case routes.management.taskCreated: return <TaskCreatedView navigate={navigate} />;
    case routes.management.history: return <ManagementHistoryView navigate={navigate} />;
    case routes.management.previousDayDetails: return <PreviousDayDetailsView navigate={navigate} />;
    case routes.management.previousDayTaskDetails: return <PreviousDayTaskDetailsView navigate={navigate} />;
    case routes.management.historyFilters: return <PreviousDayDetailsView navigate={navigate} showFilters />;
    case routes.management.previousDaySummary: return <PreviousDaySummaryView navigate={navigate} />;
    case routes.management.currentDaySummary: return <CurrentDaySummaryView navigate={navigate} />;
    case routes.management.unitSelection: return <ManagerDashboardView navigate={navigate} isUnitSelectionOpen />;
    case routes.management.taskCopy: return <CopyTaskView navigate={navigate} />;
    case routes.management.taskCopyCreated: return <TaskCopyCreatedView navigate={navigate} />;
    default: return null;
  }
}
