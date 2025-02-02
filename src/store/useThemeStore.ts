import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
}

interface ThemeActions {
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState & ThemeActions>()(
  persist(
    (set) => ({
      isDarkMode: false,
      toggleTheme: () => 
        set((state) => {
          const newDarkMode = !state.isDarkMode;
          // Actualizar la clase dark en el documento
          if (newDarkMode) {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          return { isDarkMode: newDarkMode };
        }),
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // Asegurar que la clase dark se aplique al cargar la página
        if (state?.isDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
    }
  )
);