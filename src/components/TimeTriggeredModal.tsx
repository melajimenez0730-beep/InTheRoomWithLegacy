import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
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
      // Use sessionStorage for temporary dismissals (only for the current browsing session)
      // This will be reset when the user closes the browser
      const currentPath = window.location.pathname;
      const sessionKey = `timeModal_session_${currentPath}_${guideName.replace(/\\s+/g, '_')}`;
      sessionStorage.setItem(sessionKey, "true");
    } catch (e) {
      // Silent fail if sessionStorage is not available
      console.error("SessionStorage error:", e);
    }
  };

  // Check if we should show the modal
  useEffect(() => {
    try {
      // Check if we are on the homepage - ONLY allow the modal on the homepage
      const currentPath = window.location.pathname;
      const isHomepage = currentPath === "/" || currentPath === "";
      
      if (!isHomepage) {
        console.log(`[TimeModal] Not on homepage (${currentPath}), preventing modal display`);
        return; // Don't show on any page except the homepage
      }
      
      // First check if the guide has been downloaded successfully (permanent flag)
      const permanentModalKey = `timeModal_downloaded_${guideName.replace(/\\s+/g, '_')}`;
      const hasDownloaded = localStorage.getItem(permanentModalKey) === "true";
      
      if (hasDownloaded) {
        console.log(`[TimeModal] Guide already downloaded, not showing modal`);
        return; // Never show again if the guide has been downloaded
      }
      
      // Then check if the modal was dismissed in the current session on this page
      const sessionKey = `timeModal_session_${currentPath}_${guideName.replace(/\\s+/g, '_')}`;
      const dismissedInSession = sessionStorage.getItem(sessionKey) === "true";
      
      if (dismissedInSession) {
        console.log(`[TimeModal] Modal was dismissed in the current session on this page, not showing again`);
        return; // Don't show on this page in the current session if already dismissed
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
      // If storage access fails (e.g., in incognito mode), continue normally
      console.error("Storage error:", e);
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

  // Handle typeform link click
  const handleTypeformClick = () => {
    // Store in localStorage that the user has clicked the link (permanent flag)
    try {
      const permanentModalKey = `timeModal_downloaded_${guideName.replace(/\\s+/g, '_')}`;
      localStorage.setItem(permanentModalKey, "true");
      console.log(`[TimeModal] Link clicked, setting permanent flag to never show modal again`);
    } catch (e) {
      console.error("LocalStorage error:", e);
    }
    
    // Close the modal
    closeModal();
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
            Take Your Legacy Snapshot
          </h2>
          
          <p>
            Discover your Legacy Dimensions with our complimentary assessment tool. Gain insights into your family's unique legacy approach in just minutes.
          </p>
        </div>
        
        <div className="modal-box-body">
          <div className="flex flex-col items-center">
            <p className="mb-4 text-center">
              This assessment helps you understand your current legacy approach and provides personalized recommendations for growth.
            </p>
            <a 
              href="https://form.typeform.com/to/SM7cDSbt"
              onClick={handleTypeformClick}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-bold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-12 rounded-md px-10 py-3 bg-[#052d3f] text-white hover:bg-[#052d3f]/90 w-full sm:w-auto text-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Start Snapshot Now
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}