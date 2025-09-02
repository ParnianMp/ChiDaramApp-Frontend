import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  joinDate: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithPhone: (phone: string, password: string) => Promise<boolean>;
  register: (userData: Omit<User, 'id' | 'joinDate'> & { password: string }) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in on app start
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const userData = localStorage.getItem('user_data');

      if (token && userData) {
        setUser(JSON.parse(userData));
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_data');
    } finally {
      setIsLoading(false);
    }
  };

  const getRegisteredUsers = (): Array<User & { password: string }> => {
    try {
      const users = localStorage.getItem('registered_users');
      return users ? JSON.parse(users) : [];
    } catch (error) {
      return [];
    }
  };

  const saveRegisteredUsers = (users: Array<User & { password: string }>) => {
    localStorage.setItem('registered_users', JSON.stringify(users));
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user is registered
      const registeredUsers = getRegisteredUsers();
      const foundUser = registeredUsers.find(u => u.email === email && u.password === password);

      if (!foundUser) {
        return false; // User not found or wrong password
      }

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      const token = Math.random().toString(36).substr(2);

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithPhone = async (phone: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user is registered
      const registeredUsers = getRegisteredUsers();
      const foundUser = registeredUsers.find(u => u.phone === phone && u.password === password);

      if (!foundUser) {
        return false; // User not found or wrong password
      }

      // Remove password from user object before storing
      const { password: _, ...userWithoutPassword } = foundUser;
      const token = Math.random().toString(36).substr(2);

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(userWithoutPassword));
      setUser(userWithoutPassword);

      return true;
    } catch (error) {
      console.error('Phone login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Omit<User, 'id' | 'joinDate'> & { password: string }): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Check if user already exists
      const registeredUsers = getRegisteredUsers();
      const existingUser = registeredUsers.find(u => u.email === userData.email || u.phone === userData.phone);

      if (existingUser) {
        return false; // User already exists
      }

      const newUserWithPassword = {
        id: Math.random().toString(36).substr(2, 9),
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        joinDate: new Date().toLocaleDateString('fa-IR'),
        password: userData.password,
      };

      // Save to registered users
      const updatedUsers = [...registeredUsers, newUserWithPassword];
      saveRegisteredUsers(updatedUsers);

      // Remove password before setting as current user
      const { password: _, ...newUser } = newUserWithPassword;
      const token = Math.random().toString(36).substr(2);

      localStorage.setItem('auth_token', token);
      localStorage.setItem('user_data', JSON.stringify(newUser));
      setUser(newUser);

      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    login,
    loginWithPhone,
    register,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
