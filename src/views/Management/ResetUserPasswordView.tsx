import { useState } from 'react';
import { Button, Form, Frame, Notice, PasswordField, Stack, SuccessState } from '../../components';
import { useResetUserPasswordMutation, useUserQuery } from '../../hooks/management';
import { routes, type Navigate } from '../../navigation';
import { resetUserPasswordSchema } from '../../schemas/auth';
import { useManagementStore } from '../../stores';

export function ResetUserPasswordView({ navigate }: { navigate: Navigate }) {
  const userId = useManagementStore(state => state.selectedUserId);
  const { data: user, isPending, isError } = useUserQuery(userId);
  const mutation = useResetUserPasswordMutation();
  const [values, setValues] = useState({ newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});
  const [saved, setSaved] = useState(false);
  function submit() {
    if (!user || mutation.isPending) return;
    const result = resetUserPasswordSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.issues) fieldErrors[issue.path[0] as keyof typeof values] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate({ userId: user.id, newPassword: result.data.newPassword }, {
      onSuccess: () => {
        setValues({ newPassword: '', confirmPassword: '' });
        setSaved(true);
        mutation.reset();
      },
    });
  }
  return <Frame title="Redefinir senha" backTo={routes.management.userEdit} navigate={navigate}>
    {saved ? <SuccessState title="Senha redefinida" description="Informe a senha temporária ao usuário. Ele poderá alterá-la em Mais > Alterar minha senha."><Button onClick={() => navigate(routes.management.userEdit)}>VOLTAR PARA USUÁRIO</Button></SuccessState>
      : isPending ? <Notice>Carregando usuário...</Notice>
        : isError || !user ? <Notice tone="danger">Não foi possível carregar o usuário.</Notice>
          : <Form onSubmit={event => { event.preventDefault(); submit(); }}><Stack gap="lg">
            <Notice>Defina uma nova senha temporária para {user.name} (@{user.username}). A senha anterior deixará de funcionar. A senha atual não pode ser visualizada.</Notice>
            {([['newPassword', 'Nova senha temporária'], ['confirmPassword', 'Confirmar nova senha']] as const).map(([key, label]) => <PasswordField key={key} label={label} autoComplete="new-password" value={values[key]} isRequired disabled={mutation.isPending} errorMessage={errors[key]} helperText={key === 'newPassword' ? 'Use de 12 a 128 caracteres.' : undefined} onChange={event => { setValues({ ...values, [key]: event.currentTarget.value }); setErrors({ ...errors, [key]: undefined }); }} />)}
            {mutation.isError && <Notice tone="danger">{mutation.error.message}</Notice>}
            <Button type="submit" isFullWidth isLoading={mutation.isPending}>CONFIRMAR REDEFINIÇÃO</Button>
            <Button variant="secondary" disabled={mutation.isPending} onClick={() => navigate(routes.management.userEdit)}>CANCELAR</Button>
          </Stack></Form>}
  </Frame>;
}
