import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/auth.service';
import { collectionService } from '../services/collection.service';
import api from '../services/axios';

export interface User {
  fullName: string;
  username: string;
  email: string;
  avatar: string; // Default avatar or backend URL
  role: string;
  createdAt: string;
}

export interface ApiRequest {
  id: string;
  name: string;
  method: string;
  url: string;
  headers: { key: string; value: string; active: boolean }[];
  params: { key: string; value: string; active: boolean }[];
  bodyType: 'none' | 'json';
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
  isVerifying: boolean;
  login: (email: string, password: string, rememberMe: boolean) => Promise<boolean>;
  signup: (fullName: string, username: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (fullName: string, avatar: string) => Promise<void>;
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
    averageResponseTime: number;
  };
  
  // Operations
  addToHistory: (req: ApiRequest) => void;
  clearHistory: () => void;
  createCollection: (name: string, description: string) => void;
  addToCollection: (collectionId: string, req: ApiRequest) => void;
  deleteCollection: (collectionId: string) => void;
  updateEnvVariables: (vars: EnvVariable[]) => void;
  incrementStats: (isSuccess: boolean, method: string) => void;
  fetchHistory: () => Promise<void>;
  fetchStats: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Premium generic SVG default avatar (Purple Theme Person Icon)
export const DEFAULT_AVATAR = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%237c3aed'><path d='M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z'/></svg>";

// Preset avatars is just an array of the default avatar (as requested, no random generation/presets needed)
export const AVATAR_PRESETS = [DEFAULT_AVATAR];

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isVerifying, setIsVerifying] = useState<boolean>(true);
  const [history, setHistory] = useState<ApiRequest[]>([]);
  const [collections, setCollections] = useState<ApiCollection[]>([]);
  const [envVariables, setEnvVariables] = useState<EnvVariable[]>([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    successCount: 0,
    failCount: 0,
    methodDistribution: { GET: 0, POST: 0, PUT: 0, DELETE: 0, PATCH: 0 } as Record<string, number>,
    averageResponseTime: 0,
  });

  // Dynamic mappers
  const mapBackendRequestToFrontend = (item: any): ApiRequest => {
    const headersArray = item.headers && typeof item.headers === 'object'
      ? Object.entries(item.headers).map(([key, value]) => ({
          key,
          value: String(value),
          active: true,
        }))
      : [];

    const parsedParams: { key: string; value: string; active: boolean }[] = [];
    try {
      const urlObj = new URL(item.url.includes("//") ? item.url : "http://" + item.url);
      urlObj.searchParams.forEach((value, key) => {
        parsedParams.push({ key, value, active: true });
      });
    } catch (e) {
      // ignore
    }

    let bodyStr = "";
    let bodyType: 'none' | 'json' = 'none';
    if (item.body) {
      bodyStr = typeof item.body === "string" ? item.body : JSON.stringify(item.body, null, 2);
      if (bodyStr && bodyStr !== "{}") {
        bodyType = 'json';
      }
    }

    let mappedResponse = undefined;
    if (item.status !== undefined) {
      mappedResponse = {
        status: item.status || 200,
        statusText: "OK",
        time: item.responseTime || 0,
        size: 0,
        body: "",
        headers: {},
      };
    }

    return {
      id: item._id,
      name: `${item.method} ${item.url.split("?")[0].replace("https://", "").replace("http://", "")}`,
      method: item.method,
      url: item.url,
      headers: headersArray,
      params: parsedParams,
      bodyType,
      body: bodyStr,
      timestamp: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
      response: mappedResponse,
    };
  };

  const fetchHistory = async () => {
    try {
      const response = await api.get('/history');
      if (response.data && response.data.success) {
        const mapped = response.data.data.map((item: any) => mapBackendRequestToFrontend(item));
        setHistory(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch history:", error);
    }
  };

  const fetchCollections = async () => {
    try {
      const response = await collectionService.getCollections();
      if (response.success && response.data) {
        const mapped = response.data.map((col: any) => ({
          id: col._id,
          name: col.name,
          description: col.description,
          requests: col.requests.map((r: any) => ({
            id: r._id,
            name: r.name,
            method: r.method,
            url: r.url,
            headers: r.headers || [],
            params: r.params || [],
            bodyType: r.bodyType || 'none',
            body: r.body || '',
            timestamp: r.createdAt ? new Date(r.createdAt).getTime() : Date.now(),
          })),
          createdAt: col.createdAt ? new Date(col.createdAt).getTime() : Date.now(),
        }));
        setCollections(mapped);
      }
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await authService.getStats();
      if (response.success && response.stats) {
        setStats({
          totalRequests: response.stats.totalRequests,
          successCount: response.stats.successCount,
          failCount: response.stats.failCount,
          methodDistribution: {
            GET: response.stats.methodDistribution.GET || 0,
            POST: response.stats.methodDistribution.POST || 0,
            PUT: response.stats.methodDistribution.PUT || 0,
            DELETE: response.stats.methodDistribution.DELETE || 0,
            PATCH: response.stats.methodDistribution.PATCH || 0,
          },
          averageResponseTime: response.stats.averageResponseTime || 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  // Load user and configurations on start
  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await authService.getMe();
        if (response.success && response.user) {
          const mappedUser: User = {
            fullName: response.user.name,
            username: response.user.email.split('@')[0],
            email: response.user.email,
            avatar: response.user.avatar || DEFAULT_AVATAR,
            role: response.user.role || "Developer",
            createdAt: response.user.createdAt,
          };
          setUser(mappedUser);
          setIsAuthenticated(true);
          
          // Fetch backend data
          await Promise.all([
            fetchHistory(),
            fetchCollections(),
            fetchStats()
          ]);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsVerifying(false);
      }
    };
    checkSession();

    // Load Environment Variables (UI workspace preferences kept in localstorage as not backed up in DB)
    const savedEnv = localStorage.getItem('api_env');
    if (savedEnv) {
      setEnvVariables(JSON.parse(savedEnv));
    } else {
      const defaultEnv = [
        { key: 'baseUrl', value: 'https://jsonplaceholder.typicode.com', enabled: true },
      ];
      setEnvVariables(defaultEnv);
      localStorage.setItem('api_env', JSON.stringify(defaultEnv));
    }
  }, []);

  // Sign Up with backend integration
  const signup = async (fullName: string, _username: string, email: string, password: string): Promise<boolean> => {
    // Avoid generating random avatars. Pass default avatar URL
    await authService.register(fullName, email, password, DEFAULT_AVATAR);
    return true;
  };

  // Login with backend integration
  const login = async (email: string, password: string, _rememberMe: boolean): Promise<boolean> => {
    const response = await authService.login(email, password);
    if (response.success && response.user) {
      const userProfile: User = {
        fullName: response.user.name,
        username: response.user.email.split('@')[0],
        email: response.user.email,
        avatar: response.user.avatar || DEFAULT_AVATAR,
        role: response.user.role || "Developer",
        createdAt: response.user.createdAt
      };

      setUser(userProfile);
      setIsAuthenticated(true);

      // Fetch user workspace data
      await Promise.all([
        fetchHistory(),
        fetchCollections(),
        fetchStats()
      ]);
      return true;
    }
    
    throw new Error('Invalid email or password');
  };

  // Logout with backend integration
  const logout = async () => {
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setHistory([]);
      setCollections([]);
      setStats({
        totalRequests: 0,
        successCount: 0,
        failCount: 0,
        methodDistribution: { GET: 0, POST: 0, PUT: 0, DELETE: 0, PATCH: 0 },
        averageResponseTime: 0,
      });
    }
  };

  // Update Profile on Backend
  const updateProfile = async (fullName: string, avatar: string) => {
    if (!user) return;
    const response = await authService.updateProfile(fullName, avatar);
    if (response.success && response.user) {
      setUser({
        fullName: response.user.name,
        username: response.user.email.split('@')[0],
        email: response.user.email,
        avatar: response.user.avatar || DEFAULT_AVATAR,
        role: response.user.role || "Developer",
        createdAt: response.user.createdAt
      });
    }
  };

  // Change Password on Backend
  const changePassword = async (oldPassword: string, newPassword: string): Promise<boolean> => {
    const response = await authService.changePassword(oldPassword, newPassword);
    return response.success;
  };

  // Real Backend Forgot Password
  const forgotPasswordSimulate = async (email: string): Promise<boolean> => {
    const response = await authService.forgotPassword(email);
    if (response.success) {
      if (response.token) {
        // Expose token in dev/mock resets for seamless navigation
        localStorage.setItem('reset_token', response.token);
      }
      return true;
    }
    throw new Error(response.message || "Failed to trigger password reset");
  };

  // Real Backend Reset Password
  const resetPasswordSimulate = async (token: string, newPassword: string): Promise<boolean> => {
    const response = await authService.resetPassword(token, newPassword);
    if (response.success) {
      localStorage.removeItem('reset_token');
      return true;
    }
    throw new Error(response.message || "Failed to reset password");
  };

  // Refresh history and stats after a request sends successfully
  const addToHistory = (_req: ApiRequest) => {
    fetchHistory();
    fetchStats();
  };

  const clearHistory = async () => {
    try {
      const response = await api.delete('/history');
      if (response.data && response.data.success) {
        setHistory([]);
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to clear history on backend:", error);
    }
  };

  const createCollection = async (name: string, description: string) => {
    try {
      const response = await collectionService.createCollection(name, description);
      if (response.success) {
        fetchCollections();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to create collection:", error);
    }
  };

  const addToCollection = async (collectionId: string, req: ApiRequest) => {
    try {
      // Strip frontend-specific id so backend can generate it
      const { id, ...cleanReq } = req;
      const response = await collectionService.saveRequest(collectionId, cleanReq);
      if (response.success) {
        fetchCollections();
      }
    } catch (error) {
      console.error("Failed to save request to collection:", error);
    }
  };

  const deleteCollection = async (collectionId: string) => {
    try {
      const response = await collectionService.deleteCollection(collectionId);
      if (response.success) {
        fetchCollections();
        fetchStats();
      }
    } catch (error) {
      console.error("Failed to delete collection:", error);
    }
  };

  const updateEnvVariables = (vars: EnvVariable[]) => {
    setEnvVariables(vars);
    localStorage.setItem('api_env', JSON.stringify(vars));
  };

  const incrementStats = (_isSuccess: boolean, _method: string) => {
    // Stats are computed dynamically on the backend
    fetchStats();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isVerifying,
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
        incrementStats,
        fetchHistory,
        fetchStats
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
