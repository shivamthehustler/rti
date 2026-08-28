import { create } from 'zustand';
import { dictionary } from '../context/AppContext';

export const useAppStore = create((set, get) => ({
  language: 'en',
  fontSize: 0, // -1 (small), 0 (normal), 1 (large)
  user: null,
  isWorkflowModalOpen: false,

  openWorkflowModal: () => set({ isWorkflowModalOpen: true }),
  closeWorkflowModal: () => set({ isWorkflowModalOpen: false }),
  toggleWorkflowModal: () => set((state) => ({ isWorkflowModalOpen: !state.isWorkflowModalOpen })),

  setUser: (user) => set({ user }),

  loginUser: (userData) => {
    const userObj = typeof userData === 'string' ? { username: userData, name: userData } : userData;
    set({ user: userObj });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rti_portal_user', JSON.stringify(userObj));
      } catch (e) {}
    }
  },

  logoutUser: () => {
    set({ user: null });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rti_portal_user', 'logged_out');
      } catch (e) {}
    }
  },

  initUser: () => {
    if (typeof window !== 'undefined') {
      try {
        const savedUser = localStorage.getItem('rti_portal_user');
        if (savedUser === 'logged_out' || savedUser === 'null') {
          set({ user: null });
          return;
        }
        if (savedUser) {
          set({ user: JSON.parse(savedUser) });
          return;
        }
      } catch (e) {}
      // Fallback default citizen user
      const defaultCitizen = {
        username: 'shivam.gupta',
        name: 'Shivam Gupta',
        email: 'citizen.rti@gov.in',
        role: 'Citizen Applicant',
        state: 'Maharashtra',
        digilockerVerified: true,
        aadhaarMasked: 'XXXX-XXXX-8921'
      };
      set({ user: defaultCitizen });
    }
  },
  
  setLanguage: (lang) => {
    const nextLang = lang || (get().language === 'en' ? 'hi' : 'en');
    set({ language: nextLang });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rti_portal_lang', nextLang);
      } catch (e) {}
    }
  },

  toggleLanguage: () => {
    get().setLanguage();
  },

  setFontSize: (size) => {
    set({ fontSize: size });
    if (typeof window !== 'undefined') {
      const root = document.documentElement;
      if (size === -1) {
        root.style.fontSize = '87.5%';
      } else if (size === 1) {
        root.style.fontSize = '112.5%';
      } else {
        root.style.fontSize = '100%';
      }
      try {
        localStorage.setItem('rti_portal_fontsize', size.toString());
      } catch (e) {}
    }
  },

  getTranslations: () => dictionary[get().language] || dictionary.en
}));
