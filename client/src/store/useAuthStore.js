import { create } from 'zustand';
import api from '../utils/api';
import { getDeviceFingerprint, getDeviceName } from '../utils/fingerprint';

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user')) || null,
  token: localStorage.getItem('token') || null,
  loading: false,
  error: null,

  login: async (email, password, remember = false) => {
    set({ loading: true, error: null });
    try {
      const fingerprint = getDeviceFingerprint();
      const deviceName = getDeviceName();

      const response = await api.post('/api/auth/login', {
        email, password, remember, fingerprint, deviceName
      });
      const { user, token } = response.data;
      
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token);
      
      set({ user, token, loading: false });
      return { success: true };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      const code = err.response?.data?.code || null;
      set({ error: message, loading: false });
      return { success: false, message, code };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const response = await api.post('/api/auth/register', userData);
      set({ loading: false });
      return { success: true, message: response.data.message };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      set({ error: message, loading: false });
      return { success: false, message };
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
}));

export default useAuthStore;
