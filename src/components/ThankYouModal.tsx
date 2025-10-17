import React from "react";
import { Button } from "./ui/button";
import { X, ArrowRight } from "lucide-react";

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ThankYouModal({ isOpen, onClose }: ThankYouModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative animate-fade-in-up">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-4">
            Thank You for Joining the Room!
          </h2>
          
          <p className="text-lg text-foreground/80 mb-8">
            While we prepare your first insights, would you like to explore ways to support our mission and expand your family's legacy journey?
          </p>
          
          <div className="space-y-3 mb-6">
            {/* Donation CTA */}
            <a 
              href="/support/donation" 
              className="w-full py-3 px-4 flex items-center justify-center bg-primary hover:bg-primary/90 text-white rounded-md font-medium transition-colors"
            >
              Support Our Mission <ArrowRight className="ml-2 h-5 w-5" />
            </a>
            
            {/* Shop/Resources CTA */}
            <a 
              href="/resources" 
              className="w-full py-3 px-4 flex items-center justify-center bg-secondary hover:bg-secondary/90 text-white rounded-md font-medium transition-colors"
            >
              Explore Tools & Shop <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </div>
          
          {/* No thanks button */}
          <div className="text-center">
            <button 
              onClick={onClose}
              className="text-foreground/60 hover:text-foreground/80 font-medium text-sm transition-colors"
            >
              No, thank you
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}