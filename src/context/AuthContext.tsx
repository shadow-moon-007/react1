import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '../types';

interface AuthContextType {
  user: UserProfile;
  isAuthenticated: boolean;
  activeRole: 'Department Admin' | 'Team Manager' | 'Team Member';
  switchRole: (role: 'Department Admin' | 'Team Manager' | 'Team Member') => void;
  tokenClaims: {
    aud: string;
    iss: string;
    iat: number;
    exp: number;
    oid: string;
    tid: string;
    sub: string;
    upn: string;
    preferred_username: string;
    roles: string[];
    department: string;
    jobTitle: string;
  };
  signOut: () => void;
  signIn: () => void;
}

const defaultUser: UserProfile = {
  id: 'emp-012',
  name: 'Alex Morgan',
  email: 'alex.morgan@gbs.enterprise.corp',
  title: 'Senior Solutions Architect & Operations Lead',
  department: 'Global Business Services (GBS)',
  subDepartment: 'GBS-BTS',
  team: 'Intelligent Automation & RPA',
  role: 'Department Admin',
  tenantId: '72f988bf-86f1-41af-91ab-2d7cd011db47', // Standard Entra ID format
  objectId: '9e4823ab-5bc1-49fa-9482-628d01f56a81',
  initials: 'AM',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(defaultUser);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);

  const switchRole = (newRole: 'Department Admin' | 'Team Manager' | 'Team Member') => {
    setUser((prev) => ({
      ...prev,
      role: newRole,
    }));
  };

  const tokenClaims = {
    aud: 'api://gbs-intranet-core-poc',
    iss: `https://login.microsoftonline.com/${user.tenantId}/v2.0`,
    iat: Math.floor(Date.now() / 1000) - 300,
    exp: Math.floor(Date.now() / 1000) + 3600,
    oid: user.objectId,
    tid: user.tenantId,
    sub: user.objectId,
    upn: user.email,
    preferred_username: user.email,
    roles: [user.role],
    department: user.department,
    jobTitle: user.title,
  };

  const signOut = () => {
    setIsAuthenticated(false);
  };

  const signIn = () => {
    setIsAuthenticated(true);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        activeRole: user.role,
        switchRole,
        tokenClaims,
        signOut,
        signIn,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const ProtectedRoute: React.FC<{
  children: ReactNode;
  requiredRole?: 'Department Admin' | 'Team Manager';
}> = ({ children, requiredRole }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center">
        <h2 className="text-xl font-semibold text-[#111111] mb-2">Authentication Required</h2>
        <p className="text-sm text-[#6B6B6B] mb-4">
          Please sign in via Microsoft Entra ID to access this area.
        </p>
      </div>
    );
  }

  if (requiredRole && user.role !== requiredRole && user.role !== 'Department Admin') {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-12 h-12 rounded-full bg-red-100 text-[#C8102E] flex items-center justify-center mb-4 font-semibold text-lg">
          !
        </div>
        <h2 className="text-xl font-semibold text-[#111111] mb-2">Restricted Access</h2>
        <p className="text-sm text-[#6B6B6B] mb-4">
          This area requires the <span className="font-semibold text-[#111111]">{requiredRole}</span> role in Microsoft Entra ID. Your current persona is <span className="font-semibold">{user.role}</span>.
        </p>
        <p className="text-xs text-[#6B6B6B]">
          You can switch personas using the Entra ID role switcher in the top-right header menu.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
