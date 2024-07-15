import { GITHUB_CLIENT_ID } from '@env';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuthRequest } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import api from "../api/db"

const CLIENT_ID = GITHUB_CLIENT_ID;

const discovery = {
  authorizationEndpoint: 'https://github.com/login/oauth/authorize',
  tokenEndpoint: 'https://github.com/login/oauth/access_token',
  revocationEndpoint: 'https://github.com/settings/connections/applications/' + CLIENT_ID,
};

interface AuthProps {
  authState?: AuthState;
  promptOauth?: Function;
  handleLogin?: Function;
  handleRegister?: Function;
  handleLogout?: Function;
  request?: any;
}
const AuthContext = createContext<AuthProps>({});

type AuthState = {
  token: string | null;
  authenticated: boolean;
}

const initialAuthState = {
  token: "yes",
  authenticated: true
}

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState(initialAuthState)

  const [request, response, promptOauth] = useAuthRequest(
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
      if (code && authState?.token) return

      api.users.authenticate(code).then(data => {
        if (!data?.user) return
        setAuthState({
          token: data.token,
          authenticated: true
        })
      })
    }
  }, [response]);

  async function handleLogin(email: string, password: string) {
    const result = await api.users.login({
      email: email,
    }, password);
    if (!result.isSuccess) {
      return false
    }

    setAuthState({
      token: result.token,
      authenticated: true
    })

    return true
  }

  async function handleRegister(username: string, email: string, password: string) {
    const result = await api.users.register({ username, email, password });
    if (!result.isSuccess) {
      Alert.alert("Error", "Cannot register");
      return false;
    }

    setAuthState({
      token: result.token,
      authenticated: true
    })

    return true
  }

  const handleLogout = () => {
    setAuthState(initialAuthState)
  };

  return (
    <AuthContext.Provider value={
      {
        authState,
        promptOauth,
        handleLogin,
        handleRegister,
        handleLogout,
        request
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
