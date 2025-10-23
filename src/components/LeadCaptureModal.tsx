import React, { useState } from "react";
import { Button } from "./ui/button";
import { LeadCaptureForm } from "./LeadCaptureForm";
import { Download, X } from "lucide-react";

interface LeadCaptureModalProps {
  guideName: string;
  buttonText?: string;
  buttonClassName?: string;
  pdfPath?: string;
}

export function LeadCaptureModal({
  guideName,
  buttonText = "Download the Guide for free",
  buttonClassName = "",
  pdfPath = "/pdfs/parenting-a-parent-a-guide-for-adult-children_nw_fa0eeee7.pdf"
}: LeadCaptureModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      {/* Trigger Button */}
      <Button 
        onClick={openModal}
        className={`flex items-center gap-2 ${buttonClassName}`}
        variant="secondary"
      >
        <Download className="h-4 w-4" />
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
                Download Your Free Guide
              </h2>
              
              <p className="text-foreground/80 mb-6">
                Enter your details below to receive your free copy of "{guideName}".
              </p>
              
              <LeadCaptureForm 
                guideName={guideName}
                pdfPath={pdfPath}
                onSuccess={() => {
                  // We keep the modal open to show the success message
                  setTimeout(() => closeModal(), 6000); // Auto-close after success and download
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}