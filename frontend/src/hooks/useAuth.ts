import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode'; // Wait, let me add jwt-decode

export function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = Cookies.get('token');
      if (token) {
        try {
          const decoded = jwtDecode(token) as { role: string; exp: number };
          if (decoded.exp * 1000 < Date.now()) {
            // Token expired
            logout();
          } else {
            setIsAuthenticated(true);
            setUserRole(decoded.role);
          }
        } catch (error) {
          logout();
        }
      } else {
        setIsAuthenticated(false);
        setUserRole(null);
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const logout = () => {
    Cookies.remove('token');
    setIsAuthenticated(false);
    setUserRole(null);
    router.push('/login');
  };

  return { isAuthenticated, userRole, loading, logout };
}
