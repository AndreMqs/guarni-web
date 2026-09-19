import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it, vi } from 'vitest';
import { render } from '../../test/render';
import { UploadArea } from './UploadArea';

it('offers separate camera and gallery inputs and forwards the selected photo', async () => {
  const onFileSelect = vi.fn();
  render(<UploadArea title="Evidência" onFileSelect={onFileSelect} />);
  const camera = screen.getByLabelText('Foto da câmera');
  const gallery = screen.getByLabelText('Foto da galeria');
  expect(camera).toHaveAttribute('capture', 'environment');
  expect(gallery).not.toHaveAttribute('capture');
  const cameraClick = vi.spyOn(camera, 'click');
  const galleryClick = vi.spyOn(gallery, 'click');
  const user = userEvent.setup();
  await user.click(screen.getByRole('button', { name: 'Tirar foto' }));
  expect(cameraClick).toHaveBeenCalledOnce();
  await user.click(screen.getByRole('button', { name: 'Escolher da galeria' }));
  expect(galleryClick).toHaveBeenCalledOnce();
  const file = new File(['photo'], 'camera.jpg', { type: 'image/jpeg' });
  await user.upload(camera, file);
  expect(onFileSelect).toHaveBeenCalledWith(file);
  fireEvent.change(gallery, { target: { files: [] } });
  expect(onFileSelect).toHaveBeenCalledTimes(1);
});

it('disables both sources during submission', () => {
  render(<UploadArea title="Evidência" disabled />);
  expect(screen.getByRole('button', { name: 'Tirar foto' })).toBeDisabled();
  expect(screen.getByRole('button', { name: 'Escolher da galeria' })).toBeDisabled();
});
