import { Link } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import { useAuth } from './Auth';

export default function NavBar() {
  const { user, token, logout } = useAuth();
  const [open, setOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, []);

  // useAuth().logout will handle clearing token and updating axios headers

  return (
    <div className="bg-white border-b">
      <div className="container flex items-center justify-between py-3">
        <div>
          <Link to="/" className="font-bold text-lg">Recipes</Link>
        </div>
        <div className="flex items-center gap-3" ref={menuRef}>
          <Link to="/search" className="text-sm text-gray-600">Search</Link>

          <div className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              className="text-sm text-gray-600 px-3 py-1 border rounded"
            >
              Account
            </button>

            {open && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded shadow-md z-50">
                {token ? (
                  <div className="flex flex-col">
                        <Link to="/profile" className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Profile</Link>
                        <button type="button" onClick={() => { logout(); setOpen(false); }} className="text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Logout</button>
                        {user && <div className="px-3 py-1 text-xs text-gray-500">{user.username}</div>}
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <Link to="/login" className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Login</Link>
                    <Link to="/signup" className="px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">Sign up</Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
