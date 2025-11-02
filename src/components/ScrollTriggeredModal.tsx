import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { LeadCaptureForm } from "./LeadCaptureForm";

interface ScrollTriggeredModalProps {
  guideName: string;
  pdfPath?: string;
  targetSectionId?: string;
  scrollThreshold?: number; // Percentage of page scrolled (0-100)
  onClose?: () => void;
}

export function ScrollTriggeredModal({
  guideName,
  pdfPath = "/pdfs/parenting-a-parent-a-guide-for-adult-children_nw_fa0eeee7.pdf",
  targetSectionId = "conversation", // Default to conversation section
  scrollThreshold = 60, // Default to 60% scroll depth if no section ID provided
  onClose
}: ScrollTriggeredModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
    
    try {
      // Store in localStorage that this modal has been shown and closed
      const modalKey = `scrollModal_${guideName.replace(/\s+/g, '_')}`;
      localStorage.setItem(modalKey, "true");
      localStorage.setItem(`${modalKey}_date`, new Date().toISOString());
    } catch (e) {
      // Silent fail if localStorage is not available
      console.error("LocalStorage error:", e);
    }
  };

  // Check if user has already interacted with the modal in this session or in the past
  useEffect(() => {
    try {
      // Use a more specific key that includes the guide name to avoid conflicts
      const modalKey = `scrollModal_${guideName.replace(/\s+/g, '_')}`;
      const hasBeenShown = localStorage.getItem(modalKey);
      const lastShownDate = localStorage.getItem(`${modalKey}_date`);
      
      // If shown before, check if it was more than 30 days ago
      if (hasBeenShown === "true" && lastShownDate) {
        const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
        const lastShown = new Date(lastShownDate).getTime();
        const now = new Date().getTime();
        
        // If less than 30 days, don't show again
        if (now - lastShown < thirtyDaysInMs) {
          return;
        }
      }
    } catch (e) {
      // If localStorage access fails (e.g., in incognito mode), continue normally
      console.error("LocalStorage error:", e);
    }
    
    const handleScroll = () => {
      if (hasTriggered) return;
      
      // If a specific section is targeted, check if it's in view
      if (targetSectionId) {
        const section = document.getElementById(targetSectionId);
        if (section) {
          const rect = section.getBoundingClientRect();
          // Check if the target section is in the viewport
          if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            setIsModalOpen(true);
            setHasTriggered(true);
          }
        }
      } else {
        // Otherwise, use scroll percentage
        const scrollY = window.scrollY;
        const docHeight = document.body.clientHeight;
        const windowHeight = window.innerHeight;
        const scrollPercentage = (scrollY / (docHeight - windowHeight)) * 100;
        
        if (scrollPercentage >= scrollThreshold) {
          setIsModalOpen(true);
          setHasTriggered(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [targetSectionId, scrollThreshold, hasTriggered]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Form submit success handler
  const handleFormSuccess = () => {
    // Auto-close after success and download
    setTimeout(() => closeModal(), 6000);
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4 animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-white rounded-xl shadow-xl max-w-md w-full relative animate-fade-in-up border border-primary/20"
      >
        {/* Close button */}
        <button 
          onClick={closeModal}
          className="absolute top-4 right-4 text-primary/60 hover:text-primary transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6 md:p-8">
          <div className="bg-primary/5 -m-6 md:-m-8 mb-6 p-6 md:p-8 border-b border-primary/10">
            <h2 className="text-2xl font-display font-bold text-primary mb-2">
              Download the Guide for free
            </h2>
            
            <p className="text-foreground/80">
              Enter your details below to receive your free copy of "{guideName}".
            </p>
          </div>
          
          <LeadCaptureForm 
            guideName={guideName}
            pdfPath={pdfPath}
            onSuccess={handleFormSuccess}
          />
        </div>
      </div>
    </div>
  );
}