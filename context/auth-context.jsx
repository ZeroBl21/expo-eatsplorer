import { GITHUB_CLIENT_ID } from '@env';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuthRequest } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import api from "../api/db"

const AuthContext = createContext();

const CLIENT_ID = GITHUB_CLIENT_ID;

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/' + CLIENT_ID,
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);
  const [user, setUser] = useState(null);
  const [isNewUser, setIsNewUser] = useState(false);

  const [request, response, handleLogin] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['identity', 'user:email'],
      redirectUri: Linking.createURL(),
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const { code } = response.params;
      api.users.authenticate(code).then(data => {
        setUser(data.user)
        setIsNewUser(!data.exists)
        setAuthToken(data.token && data.exists ? data.token : null)
      })
    }
  }, [response]);

  const handleLogout = () => {
    setAuthToken(null);
    setUser(null);
    setIsNewUser(false);
  };

  return (
    <AuthContext.Provider value={
      {
        authToken,
        setAuthToken,
        user,
        setUser,
        isNewUser,
        setIsNewUser,
        handleLogin,
        handleLogout,
        request
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
