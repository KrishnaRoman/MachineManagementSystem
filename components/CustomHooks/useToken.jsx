import { useState } from 'react';

export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = tokenString;
    return userToken
  };
  const [token, setToken] = useState(getToken());

  const saveToken = userToken => {
    localStorage.setItem('token', userToken.token);
    // localStorage.setItem('allowed_roles', userToken.allowed_roles);
    localStorage.setItem('default_role', userToken.default_role);
    localStorage.setItem('username', userToken.username);
    setToken(userToken.token);
  };

  return {
    setToken: saveToken,
    token
  }

}