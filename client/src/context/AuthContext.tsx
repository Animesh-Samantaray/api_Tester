import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  fullName: string;
  username: string;
  email: string;
  avatar: string; // Avatar template name or URL
  createdAt: string;
}

export interface ApiRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: { key: string; value: string; active: boolean }[];
  params: { key: string; value: string; active: boolean }[];
  bodyType: 'none' | 'json' | 'form-data' | 'raw';
  body: string;
  timestamp: number;
  response?: {
    status: number;
    statusText: string;
    time: number;
    size: number;
    body: string;
    headers: Record<string, string>;
  };
}

export interface ApiCollection {
  id: string;
  name: string;
  description: string;
  requests: ApiRequest[];
  createdAt: number;
}

export interface EnvVariable {
  key: string;
  value: string;
  enabled: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signup: (fullName: string, username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (fullName: string, avatar: string) => void;
  changePassword: (oldPassword: string, newPassword: string) => Promise<boolean>;
  forgotPasswordSimulate: (email: string) => Promise<boolean>;
  resetPasswordSimulate: (token: string, newPassword: string) => Promise<boolean>;
  
  // Dashboard & API Tester state
  history: ApiRequest[];
  collections: ApiCollection[];
  envVariables: EnvVariable[];
  stats: {
    totalRequests: number;
    successCount: number;
    failCount: number;
    methodDistribution: Record<string, number>;
  };
  
  // Operations
  addToHistory: (req: ApiRequest) => void;
  clearHistory: () => void;
  createCollection: (name: string, description: string) => void;
  addToCollection: (collectionId: string, req: ApiRequest) => void;
  deleteCollection: (collectionId: string) => void;
  updateEnvVariables: (vars: EnvVariable[]) => void;
  incrementStats: (isSuccess: boolean, method: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Preset avatars
export const AVATAR_PRESETS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80',
];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [history, setHistory] = useState<ApiRequest[]>([]);
  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    successCount: 0,
    failCount: 0,
    methodDistribution: { GET: 0, POST: 0, PUT: 0, DELETE: 0, PATCH: 0 } as Record<string, number>,
  });

  // Load user and configurations on start
  useEffect(() => {
    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
      setUser(JSON.parse(activeUser));
      setIsAuthenticated(true);
    }

    // Load History
    const savedHistory = localStorage.getItem('api_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    } else {
      // Default demo history items
      const demoHistory: ApiRequest[] = [
        {
          id: 'demo-h1',
          name: 'Get User List',
          method: 'GET',
          url: 'https://jsonplaceholder.typicode.com/users',
          headers: [{ key: 'Accept', value: 'application/json', active: true }],
          params: [],
          bodyType: 'none',
          body: '',
          timestamp: Date.now() - 3600000 * 2,
          response: {
            status: 200,
            statusText: 'OK',
            time: 142,
            size: 1.6,
            body: JSON.stringify([{ id: 1, name: 'Leanne Graham', email: 'Sincere@april.biz' }], null, 2),
            headers: { 'content-type': 'application/json' }
          }
        },
        {
          id: 'demo-h2',
          name: 'Create Post',
          method: 'POST',
          url: 'https://jsonplaceholder.typicode.com/posts',
          headers: [{ key: 'Content-Type', value: 'application/json', active: true }],
          params: [],
          bodyType: 'json',
          body: JSON.stringify({ title: 'New API Tool', body: 'This is built with React', userId: 1 }, null, 2),
          timestamp: Date.now() - 3600000 * 5,
          response: {
            status: 201,
            statusText: 'Created',
            time: 215,
            size: 0.25,
            body: JSON.stringify({ id: 101, title: 'New API Tool', body: 'This is built with React', userId: 1 }, null, 2),
            headers: { 'content-type': 'application/json' }
          }
        }
      ];
      setHistory(demoHistory);
      localStorage.setItem('api_history', JSON.stringify(demoHistory));
    }

    // Load Collections
    const savedCollections = localStorage.getItem('api_collections');
    if (savedCollections) {
      setCollections(JSON.parse(savedCollections));
    } else {
      const demoCollections: ApiCollection[] = [
        {
          id: 'col-1',
          name: 'JSONPlaceholder API',
          description: 'Standard fake online REST API for testing and prototyping.',
          createdAt: Date.now() - 86400000 * 3,
          requests: [
            {
              id: 'req-col-1',
              name: 'Get All Todos',
              method: 'GET',
              url: '{{baseUrl}}/todos',
              headers: [],
              params: [{ key: '_limit', value: '5', active: true }],
              bodyType: 'none',
              body: '',
              timestamp: Date.now()
            },
            {
              id: 'req-col-2',
              name: 'Delete Post 1',
              method: 'DELETE',
              url: '{{baseUrl}}/posts/1',
              headers: [],
              params: [],
              bodyType: 'none',
              body: '',
              timestamp: Date.now()
            }
          ]
        }
      ];
      setCollections(demoCollections);
      localStorage.setItem('api_collections', JSON.stringify(demoCollections));
    }

    // Load Environment Variables
    const savedEnv = localStorage.getItem('api_env');
    if (savedEnv) {
      setEnvVariables(JSON.parse(savedEnv));
    } else {
      const defaultEnv = [
        { key: 'baseUrl', value: 'https://jsonplaceholder.typicode.com', enabled: true },
        { key: 'authToken', value: 'bearer_token_demo_xyz123', enabled: false }
      ];
      setEnvVariables(defaultEnv);
      localStorage.setItem('api_env', JSON.stringify(defaultEnv));
    }

    // Load Statistics
    const savedStats = localStorage.getItem('api_stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      const initialStats = {
        totalRequests: 24,
        successCount: 22,
        failCount: 2,
        methodDistribution: { GET: 15, POST: 5, PUT: 2, DELETE: 2, PATCH: 0 },
      };
      setStats(initialStats);
      localStorage.setItem('api_stats', JSON.stringify(initialStats));
    }
  }, []);

  // Simulating Sign Up
  const signup = async (fullName: string, username: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    
    // Check email or username exists
    const exists = users.some((u: any) => u.email === email || u.username === username);
    if (exists) {
      throw new Error('User with this email or username already exists');
    }

    const newUser = {
      fullName,
      username,
      email,
      password, // In a real app this is hashed, simulated here
      avatar: AVATAR_PRESETS[Math.floor(Math.random() * AVATAR_PRESETS.length)],
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    localStorage.setItem('registered_users', JSON.stringify(users));
    return true;
  };

  // Simulating Login
  const login = async (email: string, password: string, rememberMe: boolean): Promise<boolean> => {
    // Check custom registered users first
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    let matchedUser = users.find((u: any) => u.email === email && u.password === password);

    // Fallback default admin user for instant testing convenience
    if (!matchedUser && email === 'admin@api.com' && password === 'admin123') {
      matchedUser = {
        fullName: 'Alex Carter',
        username: 'alexcarter',
        email: 'admin@api.com',
        avatar: AVATAR_PRESETS[0],
        createdAt: new Date().toISOString()
      };
    }

    if (matchedUser) {
      const userProfile: User = {
        fullName: matchedUser.fullName,
        username: matchedUser.username,
        email: matchedUser.email,
        avatar: matchedUser.avatar,
        createdAt: matchedUser.createdAt
      };

      setUser(userProfile);
      setIsAuthenticated(true);
      
      if (rememberMe) {
        localStorage.setItem('activeUser', JSON.stringify(userProfile));
      } else {
        sessionStorage.setItem('activeUser', JSON.stringify(userProfile));
      }
      return true;
    }
    
    throw new Error('Invalid email or password');
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('activeUser');
    sessionStorage.removeItem('activeUser');
  };

  const updateProfile = (fullName: string, avatar: string) => {
    if (!user) return;
    const updated = { ...user, fullName, avatar };
    setUser(updated);

    // Update in localStorage active session
    if (localStorage.getItem('activeUser')) {
      localStorage.setItem('activeUser', JSON.stringify(updated));
    } else {
      sessionStorage.setItem('activeUser', JSON.stringify(updated));
    }

    // Update in registered list
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const index = users.findIndex((u: any) => u.email === user.email);
    if (index !== -1) {
      users[index].fullName = fullName;
      users[index].avatar = avatar;
      localStorage.setItem('registered_users', JSON.stringify(users));
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    if (!user) return false;
    
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const index = users.findIndex((u: any) => u.email === user.email);
    
    if (index !== -1) {
      if (users[index].password !== oldPassword) {
        throw new Error('Incorrect current password');
      }
      users[index].password = newPassword;
      localStorage.setItem('registered_users', JSON.stringify(users));
      return true;
    }

    // Default user password update mock
    if (user.email === 'admin@api.com') {
      if (oldPassword !== 'admin123') {
        throw new Error('Incorrect current password');
      }
      // Success simulation
      return true;
    }

    throw new Error('User not found in system storage');
  };

  const forgotPasswordSimulate = async (email: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const exists = users.some((u: any) => u.email === email) || email === 'admin@api.com';
    if (!exists) {
      throw new Error('No account found with this email address');
    }
    // Simulate link generation
    localStorage.setItem('reset_token', 'simulate-reset-token-xyz');
    localStorage.setItem('reset_email', email);
    return true;
  };

  const resetPasswordSimulate = async (token: string, newPassword: string): Promise<boolean> => {
    const savedToken = localStorage.getItem('reset_token');
    const resetEmail = localStorage.getItem('reset_email');
    
    if (!savedToken || savedToken !== token) {
      throw new Error('Invalid or expired password reset link');
    }

    const users = JSON.parse(localStorage.getItem('registered_users') || '[]');
    const index = users.findIndex((u: any) => u.email === resetEmail);
    
    if (index !== -1) {
      users[index].password = newPassword;
      localStorage.setItem('registered_users', JSON.stringify(users));
      localStorage.removeItem('reset_token');
      localStorage.removeItem('reset_email');
      return true;
    }

    if (resetEmail === 'admin@api.com') {
      localStorage.removeItem('reset_token');
      localStorage.removeItem('reset_email');
      return true;
    }

    throw new Error('Error resetting password. User not found.');
  };

  const addToHistory = (req: ApiRequest) => {
    setHistory((prev) => {
      const updated = [req, ...prev.slice(0, 49)]; // Limit to 50 items
      localStorage.setItem('api_history', JSON.stringify(updated));
      return updated;
    });
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('api_history');
  };

  const createCollection = (name: string, description: string) => {
    const newCol: ApiCollection = {
      id: 'col-' + Math.random().toString(36).substring(2, 9),
      name,
      description,
      requests: [],
      createdAt: Date.now()
    };
    setCollections((prev) => {
      const updated = [newCol, ...prev];
      localStorage.setItem('api_collections', JSON.stringify(updated));
      return updated;
    });
  };

  const addToCollection = (collectionId: string, req: ApiRequest) => {
    setCollections((prev) => {
      const updated = prev.map((col) => {
        if (col.id === collectionId) {
          const reqCopy = { ...req, id: 'req-col-' + Math.random().toString(36).substring(2, 9) };
          return { ...col, requests: [...col.requests, reqCopy] };
        }
        return col;
      });
      localStorage.setItem('api_collections', JSON.stringify(updated));
      return updated;
    });
  };

  const deleteCollection = (collectionId: string) => {
    setCollections((prev) => {
      const updated = prev.filter((col) => col.id !== collectionId);
      localStorage.setItem('api_collections', JSON.stringify(updated));
      return updated;
    });
  };

  const updateEnvVariables = (vars: EnvVariable[]) => {
    setEnvVariables(vars);
    localStorage.setItem('api_env', JSON.stringify(vars));
  };

  const incrementStats = (isSuccess: boolean, method: string) => {
    setStats((prev) => {
      const methodKey = method.toUpperCase();
      const updatedMethodDist = { ...prev.methodDistribution };
      if (updatedMethodDist[methodKey] !== undefined) {
        updatedMethodDist[methodKey] += 1;
      } else {
        updatedMethodDist[methodKey] = 1;
      }

      const updated = {
        totalRequests: prev.totalRequests + 1,
        successCount: prev.successCount + (isSuccess ? 1 : 0),
        failCount: prev.failCount + (isSuccess ? 0 : 1),
        methodDistribution: updatedMethodDist
      };
      localStorage.setItem('api_stats', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        signup,
        logout,
        updateProfile,
        changePassword,
        forgotPasswordSimulate,
        resetPasswordSimulate,
        history,
        collections,
        envVariables,
        stats,
        addToHistory,
        clearHistory,
        createCollection,
        addToCollection,
        deleteCollection,
        updateEnvVariables,
        incrementStats
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
