import { create } from 'zustand';
import { dictionary } from '../context/AppContext';

export const useAppStore = create((set, get) => ({
  language: 'en',
  fontSize: 0, // -1 (small), 0 (normal), 1 (large)
  user: null,
  isWorkflowModalOpen: false,
  historyList: [],
  hasInitializedUser: false,

  setHistoryList: (list) => set({ historyList: list }),

  openWorkflowModal: () => set({ isWorkflowModalOpen: true }),
  closeWorkflowModal: () => set({ isWorkflowModalOpen: false }),
  toggleWorkflowModal: () => set((state) => ({ isWorkflowModalOpen: !state.isWorkflowModalOpen })),

  setUser: (user) => set({ user, hasInitializedUser: true }),

  loginUser: (userData) => {
    const userObj = typeof userData === 'string' ? { username: userData, name: userData } : userData;
    set({ user: userObj, hasInitializedUser: true });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rti_portal_user', JSON.stringify(userObj));
      } catch (e) {}
    }
  },

  logoutUser: () => {
    set({ user: null, hasInitializedUser: true });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rti_portal_user', 'logged_out');
      } catch (e) {}
    }
  },

  setAvatar: (avatarUrl) => {
    const currentUser = get().user;
    if (currentUser) {
      const updated = { ...currentUser, avatar: avatarUrl };
      set({ user: updated });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('rti_portal_user', JSON.stringify(updated));
        } catch (e) {}
      }
    }
  },

  initUser: () => {
    if (typeof window !== 'undefined') {
      if (get().hasInitializedUser && get().user !== null) {
        return;
      }
      try {
        const savedUser = localStorage.getItem('rti_portal_user');
        if (savedUser === 'logged_out' || savedUser === 'null') {
          if (get().user !== null) set({ user: null, hasInitializedUser: true });
          return;
        }
        if (savedUser) {
          const parsed = JSON.parse(savedUser);
          if (!parsed.avatar) {
            parsed.avatar = '/avatars/avatar-shivam.jpg';
          }
          const currentUser = get().user;
          if (!currentUser || currentUser.username !== parsed.username || currentUser.avatar !== parsed.avatar) {
            set({ user: parsed, hasInitializedUser: true });
          }
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
        aadhaarMasked: 'XXXX-XXXX-8921',
        avatar: '/avatars/avatar-shivam.jpg'
      };
      if (!get().user) {
        set({ user: defaultCitizen, hasInitializedUser: true });
      }
    }
  },
  
  setLanguage: (lang) => {
    const currentLang = get().language;
    const nextLang = lang || (currentLang === 'en' ? 'hi' : 'en');
    if (currentLang !== nextLang) {
      set({ language: nextLang });
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('rti_portal_lang', nextLang);
        } catch (e) {}
      }
    }
  },

  toggleLanguage: () => {
    get().setLanguage();
  },

  setFontSize: (size) => {
    if (get().fontSize !== size) {
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
    }
  },

  userFiledRequests: [],
  
  loadFiledRequests: () => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('rti_portal_filed_requests');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) {
            set({ userFiledRequests: parsed });
          }
        }
      } catch (e) {}
    }
  },

  addFiledRequest: (newReq) => {
    const current = get().userFiledRequests;
    const updated = [newReq, ...current];
    set({ userFiledRequests: updated });
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('rti_portal_filed_requests', JSON.stringify(updated));
      } catch (e) {}
    }
  },

  getTranslations: () => dictionary[get().language] || dictionary.en
}));

