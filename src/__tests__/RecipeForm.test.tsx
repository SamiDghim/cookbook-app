import { screen, fireEvent, waitFor } from '@testing-library/react';
import { test, expect, vi } from 'vitest';
import renderWithProviders from './test-utils';
import RecipeForm from '../components/RecipeForm';

test('submits a new recipe', async () => {
  const onSubmit = vi.fn();
  renderWithProviders(<RecipeForm initial={null} onSubmit={onSubmit} />);
  fireEvent.change(screen.getByLabelText(/Recipe Title/i), { target: { value: 'Cake' } });
  fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Yummy' } });
  // fill first ingredient and step
  fireEvent.change(screen.getByPlaceholderText(/Ingredient 1/i), { target: { value: 'Eggs' } });
  fireEvent.change(screen.getByPlaceholderText(/Step 1/i), { target: { value: 'Mix' } });
  fireEvent.click(screen.getByRole('button', { name: /save recipe/i }));
  await waitFor(() => {
    expect(onSubmit).toHaveBeenCalled();
  });
});
