import React, { useState } from "react";
import { Button } from "./ui/button";
import { CustomProgramLeadForm } from "./CustomProgramLeadForm";
import { X } from "lucide-react";

interface CustomProgramModalProps {
  buttonText?: string;
  buttonClassName?: string;
}

export function CustomProgramModal({
  buttonText = "Design Your Program",
  buttonClassName = ""
}: CustomProgramModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <Button 
        onClick={openModal}
        className={`${buttonClassName}`}
      >
        {buttonText}
      </Button>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative animate-fade-in-up">
            {/* Close button */}
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="p-6 md:p-8">
              <h2 className="text-2xl font-display font-bold text-primary mb-4">
                Design Your Custom Program
              </h2>
              
              <p className="text-foreground/80 mb-6">
                Start your journey toward a tailored legacy experience designed specifically for your family's unique needs and aspirations.
              </p>
              
              <CustomProgramLeadForm 
                onSuccess={() => {
                  // Auto-close after success message is shown
                  setTimeout(() => closeModal(), 3000);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}