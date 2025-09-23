import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import { rest } from 'msw';
import renderWithProviders from './test-utils';
import { server } from '../mocks/server';
import RecipeList from '../components/RecipeList';

test('delete then undo triggers restore endpoint', async () => {
  const user = userEvent.setup();

  server.use(
    rest.get('http://localhost:4000/api/recipes', (req: any, res: any, ctx: any) => res(ctx.json([{ id: 'r1', title: 'Toast Test', description: 'x', ingredients: ['a'], steps: ['b'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null }]))),
    rest.delete('http://localhost:4000/api/recipes/:id', (req: any, res: any, ctx: any) => {
      const { id } = req.params as any;
      return res(ctx.json({ id, deletedAt: new Date().toISOString() }));
    })
  );

  let restoreCalled = false;
  server.use(rest.post('http://localhost:4000/api/recipes/:id/restore', (req: any, res: any, ctx: any) => {
    restoreCalled = true;
    return res(ctx.json({ id: (req.params as any).id, deletedAt: null }));
  }));

  renderWithProviders(<RecipeList onSelect={() => {}} />);
  expect(await screen.findByText('Toast Test')).toBeInTheDocument();
  await user.click(screen.getByText('Delete'));
  expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
  await user.click(screen.getByText('Delete'));
  expect(await screen.findByText('Recipe deleted')).toBeInTheDocument();
  await user.click(screen.getByText('Undo'));
  expect(restoreCalled).toBe(true);
});
