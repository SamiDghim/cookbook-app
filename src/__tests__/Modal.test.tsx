import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import Modal from '../components/Modal';
import renderWithProviders from './test-utils';

test('Modal renders and calls confirm/cancel', async () => {
  const onConfirm = vi.fn();
  const onCancel = vi.fn();
  renderWithProviders(
    <Modal open={true} title="Confirm" confirmText="Yes" cancelText="No" onConfirm={onConfirm} onCancel={onCancel}>
      <p>Are you sure?</p>
    </Modal>
  );

  expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  fireEvent.click(screen.getByText('No'));
  expect(onCancel).toHaveBeenCalled();
  fireEvent.click(screen.getByText('Yes'));
  expect(onConfirm).toHaveBeenCalled();
});
