import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface JoinRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function JoinRoomModal({ isOpen, onClose }: JoinRoomModalProps) {
  const [mounted, setMounted] = useState(false);

  // Handle mounting to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-white rounded-xl shadow-xl p-6 md:p-8 border border-primary/10 transform transition-all">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-foreground/60 hover:text-foreground transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Modal content */}
        <div className="text-center mb-6">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary mb-4">
            Start building your family legacy today.
          </h2>
          <p className="text-foreground/80 mb-6">
            Become part of our community dedicated to preserving what matters most across generations. Connect with like-minded families committed to building lasting legacies.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a 
            href="/support/donation" 
            className={cn(
              buttonVariants({
                size: "lg",
                class: "w-full justify-center bg-primary text-white hover:bg-primary/90"
              })
            )}
            onClick={() => {
              // Close modal after a brief delay to allow navigation to begin
              setTimeout(onClose, 100);
            }}
          >
            Donate
          </a>
          <a 
            href="/support/merch" 
            className={cn(
              buttonVariants({
                variant: "outline",
                size: "lg",
                class: "w-full justify-center border-primary text-primary hover:bg-primary/10"
              })
            )}
            onClick={() => {
              // Close modal after a brief delay to allow navigation to begin
              setTimeout(onClose, 100);
            }}
          >
            Shop Merch
          </a>
        </div>
      </div>
    </div>
  );
}