import React, { useState } from 'react';
import { buttonVariants } from "./ui/button";
import { FamilyBusinessReferralModal } from './FamilyBusinessReferralModal';

interface ReferBusinessButtonProps {
  className?: string;
}

export default function ReferBusinessButton({ className = "" }: ReferBusinessButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <button 
        onClick={openModal}
        className={buttonVariants({
          variant: "outline",
          size: "lg",
          class: `border-primary text-primary hover:bg-primary/10 font-medium w-full justify-center text-center text-[15px] sm:text-sm max-w-full ${className}`
        })}
      >
        Share with Another Family Business
      </button>
      
      <FamilyBusinessReferralModal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
      />
    </>
  );
}