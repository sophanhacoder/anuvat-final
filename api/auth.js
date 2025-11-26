import client from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const login = async (email, password) => {
  try {
    const response = await client.post('/auth/login', { email, password });
    const token = response.data?.token || response.data?.data?.token || response.data?.idToken;
    
    if (token) {
      await AsyncStorage.setItem('authToken', token);
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message || 'Login failed';
  }
};

export const logout = async () => {
  try {
    await AsyncStorage.removeItem('authToken');
  } catch (error) {
    console.log('Error during logout:', error);
  }
};

export const getToken = async () => {
  try {
    return await AsyncStorage.getItem('authToken');
  } catch (error) {
    console.log('Error getting token:', error);
    return null;
  }
};

export const isAuthenticated = async () => {
  try {
    const token = await AsyncStorage.getItem('authToken');
    return !!token;
  } catch (error) {
    return false;
  }
};
