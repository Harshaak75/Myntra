import { createContext, useContext, useState } from "react";


const SidebarContext = createContext({
    isOpen: false,
    openMenu: () => {},
    closeMenu: () => {},
  });
  
  // Step 2: Create Provider Component
  export function SidebarProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
  
    const openMenu = () => setIsOpen(true);
    const closeMenu = () => setIsOpen(false);
  
    return (
      <SidebarContext.Provider value={{ isOpen, openMenu, closeMenu }}>
        {children}
      </SidebarContext.Provider>
    );
  }
  
  // Step 3: Custom Hook to use Sidebar Context
  export function useSidebar() {
    return useContext(SidebarContext);
  }