import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { LeadCaptureForm } from "./LeadCaptureForm";
import "../styles/modal-overrides.css";
import "../styles/modal-design.css";

interface TimeTriggeredModalProps {
  guideName: string;
  pdfPath?: string;
  delaySeconds?: number; // Time in seconds before showing the modal
  onClose?: () => void;
}

export function TimeTriggeredModal({
  guideName,
  pdfPath = "/pdfs/parenting-a-parent-a-guide-for-adult-children_nw_fa0eeee7.pdf",
  delaySeconds = 10, // Default to 10 seconds
  onClose
}: TimeTriggeredModalProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  // Close the modal
  const closeModal = () => {
    setIsModalOpen(false);
    if (onClose) onClose();
    
    try {
      // Store in localStorage that this modal has been shown and closed
      const modalKey = `timeModal_${guideName.replace(/\\s+/g, '_')}`;
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
      const modalKey = `timeModal_${guideName.replace(/\\s+/g, '_')}`;
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
      
      // If we made it here, show the modal after the specified delay
      const timer = setTimeout(() => {
        if (!hasTriggered) {
          console.log(`[TimeModal] Triggering modal after ${delaySeconds} seconds`);
          setIsModalOpen(true);
          setHasTriggered(true);
        }
      }, delaySeconds * 1000);
      
      // Clear the timeout on unmount
      return () => clearTimeout(timer);
      
    } catch (e) {
      // If localStorage access fails (e.g., in incognito mode), continue normally
      console.error("LocalStorage error:", e);
    }
  }, [delaySeconds, guideName, hasTriggered]);

  // Close modal when clicking/touching outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeModal();
      }
    };

    if (isModalOpen) {
      // Add both mouse and touch events for better cross-device compatibility
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isModalOpen]);

  // Form submit success handler
  const handleFormSuccess = () => {
    // Auto-close after success and download
    setTimeout(() => closeModal(), 6000);
  };

  // Handle body overflow and preserve scroll position when modal is open
  useEffect(() => {
    if (isModalOpen) {
      // Store current scroll position before locking the body
      const scrollY = window.scrollY;
      
      // Add scroll position as data attribute to the body
      document.body.dataset.scrollY = scrollY.toString();
      
      // Apply fixed position with correct top offset to prevent visual jump
      document.body.style.top = `-${scrollY}px`;
      
      // Apply modal-open class for other styling
      document.body.classList.add('modal-open');
      
      console.log('[TimeModal] Saved scroll position:', scrollY);
    } else {
      // Get the stored scroll position
      const scrollY = parseInt(document.body.dataset.scrollY || '0');
      
      // Remove the modal-open class
      document.body.classList.remove('modal-open');
      
      // Clear the fixed positioning
      document.body.style.top = '';
      
      // Restore the scroll position
      window.scrollTo(0, scrollY);
      
      console.log('[TimeModal] Restored scroll position:', scrollY);
    }
    
    return () => {
      // Cleanup in case component unmounts while modal is open
      if (document.body.classList.contains('modal-open')) {
        const scrollY = parseInt(document.body.dataset.scrollY || '0');
        document.body.classList.remove('modal-open');
        document.body.style.top = '';
        window.scrollTo(0, scrollY);
      }
    };
  }, [isModalOpen]);

  if (!isModalOpen) return null;

  return (
    <div className="modal-box-container mobile-modal-container animate-fade-in">
      <div 
        ref={modalRef}
        className="modal-box-content mobile-modal-content animate-fade-in-up"
      >
        {/* Close button */}
        <button 
          onClick={closeModal}
          className="modal-box-close"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="modal-box-header">
          <h2 className="font-display">
            Download the Guide for free
          </h2>
          
          <p>
            Enter your details below to receive your free copy of "{guideName}".
          </p>
        </div>
        
        <div className="modal-box-body">
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