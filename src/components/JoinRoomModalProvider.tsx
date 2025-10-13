import React, { createContext, useState, useContext, useCallback } from 'react';
import JoinRoomModal from './JoinRoomModal';

// Create context
interface ModalContextType {
  openJoinRoomModal: () => void;
  closeJoinRoomModal: () => void;
  isJoinRoomModalOpen: boolean;
}

const ModalContext = createContext<ModalContextType>({
  openJoinRoomModal: () => {},
  closeJoinRoomModal: () => {},
  isJoinRoomModalOpen: false
});

// Custom hook to use the modal context
export const useJoinRoomModal = () => useContext(ModalContext);

// Provider component
export default function JoinRoomModalProvider({ children }: { children: React.ReactNode }) {
  const [isJoinRoomModalOpen, setIsJoinRoomModalOpen] = useState(false);
  
  const openJoinRoomModal = useCallback(() => {
    setIsJoinRoomModalOpen(true);
  }, []);
  
  const closeJoinRoomModal = useCallback(() => {
    setIsJoinRoomModalOpen(false);
  }, []);
  
  // Create the context value
  const contextValue = {
    openJoinRoomModal,
    closeJoinRoomModal,
    isJoinRoomModalOpen
  };
  
  return (
    <ModalContext.Provider value={contextValue}>
      {children}
      <JoinRoomModal isOpen={isJoinRoomModalOpen} onClose={closeJoinRoomModal} />
    </ModalContext.Provider>
  );
}