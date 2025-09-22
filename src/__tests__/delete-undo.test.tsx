import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { test, expect } from 'vitest';
import renderWithProviders from './test-utils';
import { server } from '../mocks/server';
import { rest } from 'msw';
import RecipeList from '../components/RecipeList';

test('delete then undo triggers restore endpoint', async () => {
  const user = userEvent.setup();

  // Prepare MSW handlers: return one recipe initially
  server.use(
    rest.get('http://localhost:4000/api/recipes', (req: any, res: any, ctx: any) => {
      return res(ctx.json([{ id: 'r1', title: 'Toast Test', description: 'x', ingredients: ['a'], steps: ['b'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null }]));
    }),
    // intercept delete and respond with deletedAt
    rest.delete('http://localhost:4000/api/recipes/:id', (req: any, res: any, ctx: any) => {
      const { id } = req.params as any;
      return res(ctx.json({ id, deletedAt: new Date().toISOString() }));
    })
  );

  // Spy for restore handler
  let restoreCalled = false;
  server.use(rest.post('http://localhost:4000/api/recipes/:id/restore', (req: any, res: any, ctx: any) => {
    restoreCalled = true;
    return res(ctx.json({ id: (req.params as any).id, deletedAt: null }));
  }));

  renderWithProviders(<RecipeList onSelect={() => {}} />);
  // wait for recipe to render
  expect(await screen.findByText('Toast Test')).toBeInTheDocument();
  // click delete button for the first recipe
  await user.click(screen.getByText('Delete'));
  // modal should appear
  expect(screen.getByText(/Are you sure/)).toBeInTheDocument();
  await user.click(screen.getByText('Delete'));
  // toast should appear
  expect(await screen.findByText('Recipe deleted')).toBeInTheDocument();
  // click Undo
  await user.click(screen.getByText('Undo'));
  // confirm restore handler ran
  expect(restoreCalled).toBe(true);
});
