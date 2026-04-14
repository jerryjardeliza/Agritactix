import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../api/axios';

const useStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      login: async (email, password) => {
        const { data } = await api.post('/auth/login', { email, password });
        set({ user: data.user, token: data.token });
        return data.user;
      },

      register: async (username, email, password) => {
        const { data } = await api.post('/auth/register', { username, email, password });
        set({ user: data.user, token: data.token });
        return data.user;
      },

      logout: () => set({ user: null, token: null }),

      updatePoints: (points) =>
        set((s) => ({ user: s.user ? { ...s.user, points } : null })),

      refreshUser: async () => {
        try {
          const { data } = await api.get('/auth/me');
          set((s) => ({ user: { ...s.user, ...data } }));
        } catch {}
      },
    }),
    { name: 'agritactix-auth', partialize: (s) => ({ user: s.user, token: s.token }) }
  )
);

export default useStore;
