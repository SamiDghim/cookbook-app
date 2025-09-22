// Pragmatic module shims for test-only packages when running on older Node in CI/local
declare module 'msw' {
  export const rest: any;
  export const graphql: any;
  export const setupServer: any;
  export const setupWorker: any;
}

declare module '@testing-library/user-event' {
  const userEvent: any;
  export default userEvent;
}
