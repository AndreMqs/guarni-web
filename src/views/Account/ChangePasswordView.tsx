import { useState } from 'react';
import { Button, Form, Frame, Notice, PasswordField, Stack, SuccessState } from '../../components';
import { useChangePasswordMutation } from '../../hooks/login';
import { changePasswordSchema } from '../../schemas/auth';
import type { AppRoute, Navigate } from '../../navigation';

export function ChangePasswordView({ navigate, backTo }: { navigate: Navigate; backTo: AppRoute }) {
  const [values, setValues] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof typeof values, string>>>({});
  const mutation = useChangePasswordMutation();
  function submit() {
    const result = changePasswordSchema.safeParse(values);
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.issues) fieldErrors[issue.path[0] as keyof typeof values] ??= issue.message;
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    mutation.mutate({ currentPassword: values.currentPassword, newPassword: values.newPassword }, {
      onSuccess: () => setValues({ currentPassword: '', newPassword: '', confirmPassword: '' }),
    });
  }
  return <Frame title="Alterar minha senha" backTo={backTo} navigate={navigate}>
    {mutation.isSuccess ? <SuccessState title="Senha alterada" description="Use a nova senha no próximo acesso."><Button onClick={() => navigate(backTo)}>VOLTAR PARA MAIS</Button></SuccessState> : <Form onSubmit={event => { event.preventDefault(); submit(); }}>
      <Stack gap="lg">
        <Notice>Use sua senha atual ou a senha temporária fornecida pelo gerente.</Notice>
        {([
          ['currentPassword', 'Senha atual', 'current-password'],
          ['newPassword', 'Nova senha', 'new-password'],
          ['confirmPassword', 'Confirmar nova senha', 'new-password'],
        ] as const).map(([key, label, autoComplete]) => <PasswordField key={key} label={label} autoComplete={autoComplete} value={values[key]} isRequired disabled={mutation.isPending} errorMessage={errors[key]} helperText={key === 'newPassword' ? 'Use de 12 a 128 caracteres.' : undefined} onChange={event => { setValues({ ...values, [key]: event.currentTarget.value }); setErrors({ ...errors, [key]: undefined }); }} />)}
        {mutation.isError && <Notice tone="danger">{mutation.error.message}</Notice>}
        <Button type="submit" isFullWidth isLoading={mutation.isPending}>SALVAR NOVA SENHA</Button>
        <Button variant="secondary" disabled={mutation.isPending} onClick={() => navigate(backTo)}>CANCELAR</Button>
      </Stack>
    </Form>}
  </Frame>;
}
