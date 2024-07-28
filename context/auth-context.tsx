import React, { createContext, useContext, useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useAuthRequest } from 'expo-auth-session';
import * as Linking from 'expo-linking';
import api from "../api/db";
import { GITHUB_CLIENT_ID } from '@env';
import { router } from 'expo-router';

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
  userId: number | null;
}

const initialAuthState = {
  token: null,
  authenticated: false,
  userId: null,
}

export const AuthProvider = ({ children }: any) => {
  const [authState, setAuthState] = useState(initialAuthState);

  const [request, response, promptOauth] = useAuthRequest(
    {
      clientId: CLIENT_ID,
      scopes: ['identity', 'user:email'],
      redirectUri: Linking.createURL(),
    },
    discovery
  );

  useEffect(() => {
    async function loginUserWithGithub() {
      if (response?.type === 'success') {
        const { code } = response.params;
        if (code && authState?.token) return;

        try {
          const data = await api.users.loginGithub(code);
          if (!data.isSuccess) return;
          setAuthState({
            token: data?.token,
            authenticated: true,
            userId: data?.user?.id,
          });
          router.replace("/home");
        } catch (error) {
          console.error('Error logging in with GitHub:', error);
        }
      }
    }

    if (!authState.token) {
      loginUserWithGithub();
    }
  }, [response]);

  async function handleLogin(email: string, password: string) {
    const result = await api.users.login({ email: email }, password);
    if (!result.isSuccess) {
      return false;
    }

    setAuthState({
      token: result.token,
      authenticated: true,
      userId: result.id_usuario,
    });

    return true;
  }

  async function handleRegister(username: string, email: string, password: string) {
    const result = await api.users.register({ username, email, password });
    if (!result.isSuccess) {
      Alert.alert("Error", "Cannot register");
      return false;
    }

    setAuthState({
      token: result.token,
      authenticated: true,
      userId: result.id_usuario,
    });

    return true;
  }

  const handleLogout = () => {
    setAuthState(initialAuthState);
  };

  return (
    <AuthContext.Provider value={{
      authState,
      promptOauth,
      handleLogin,
      handleRegister,
      handleLogout,
      request,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
