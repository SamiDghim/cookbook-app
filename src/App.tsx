import { QueryClientProvider } from '@tanstack/react-query';
import { createBrowserRouter, RouterProvider , Outlet } from 'react-router-dom';
import Recipes from './routes/Recipes';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import PublicSearch from './pages/PublicSearch';
import queryClient from './store/queryClient';
import './index.css';

function RootLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Recipes /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'profile', element: <Profile /> },
  { path: 'search', element: <PublicSearch /> },
    ],
  },
]);

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
