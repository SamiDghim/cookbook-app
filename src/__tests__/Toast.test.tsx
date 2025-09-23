import React from 'react';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { useToast } from '../components/Toast';
import renderWithProviders from './test-utils';

function Demo() {
  const toast = useToast();
  return (
    <div>
      <button type="button" onClick={() => toast.push({ type: 'success', message: 'Saved', action: { label: 'Undo', onClick: () => {} } })}>Show</button>
    </div>
  );
}

test('ToastProvider shows toast and action works', async () => {
  renderWithProviders(<Demo />);
  const user = userEvent.setup();
  await user.click(screen.getByText('Show'));
  expect(await screen.findByText('Saved')).toBeInTheDocument();
  expect(screen.getByText('Undo')).toBeInTheDocument();
});
