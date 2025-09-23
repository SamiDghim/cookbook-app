import { rest } from 'msw';

const handlers = [
  rest.get('http://localhost:4000/api/recipes', (req: any, res: any, ctx: any) => res(ctx.status(200), ctx.json([
      { id: 'm1', title: 'Mocked', description: 'From MSW', ingredients: ['x'], steps: ['y'], createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), deletedAt: null },
    ])))
];
export default handlers;
