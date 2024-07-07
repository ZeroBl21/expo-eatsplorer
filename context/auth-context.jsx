import { GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET } from '@env';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import * as Linking  from 'expo-linking';

const AuthContext = createContext();

const CLIENT_ID = GITHUB_CLIENT_ID;
const CLIENT_SECRET = GITHUB_CLIENT_SECRET;

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/<CLIENT_ID>',
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken] = useState(null);

  const [request, response, handleLogin] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['identity'],
      redirectUri: Linking.createURL(),
    },
    discovery
  );
  console.log(Linking.createURL())
  console.log("Response", response)

  useEffect(() => {

    if (response?.type === 'success') {
      const { code } = response.params;
      fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code: code,
        }),
      })
        .then(response => response.json())
        .then(data => setAuthToken(data.access_token))
        .catch(error => console.error('Error:', error));
    }
  }, [response]);

  const handleLogout = () => {
    setAuthToken(null);
  };

  return (
    <AuthContext.Provider value={{ authToken, handleLogin, handleLogout, request }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
