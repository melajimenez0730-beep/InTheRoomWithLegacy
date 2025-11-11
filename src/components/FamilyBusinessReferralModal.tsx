import React, { useState } from "react";
import { Button } from "./ui/button";
import { X } from "lucide-react";

interface FamilyBusinessReferralModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FamilyBusinessReferralModal({ 
  isOpen, 
  onClose 
}: FamilyBusinessReferralModalProps) {
  const [formData, setFormData] = useState({
    contact_name: "",
    contact_email: "",
    form_name: "Black Family Business Referral"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData object for multipart/form-data submission
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });
      
      const response = await fetch("https://api.new.website/api/submit-form/", {
        method: "POST",
        body: formDataObj,
      });

      if (response.ok) {
        setSubmitStatus("success");
        // Close modal after successful submission
        setTimeout(() => {
          onClose();
          // Reset form data after modal is closed
          setFormData({
            contact_name: "",
            contact_email: "",
            form_name: "Black Family Business Referral"
          });
        }, 1500);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-[95%] max-w-md relative animate-fade-in-up">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="p-4 sm:p-6 md:p-8">
          <h2 className="text-2xl font-display font-bold text-primary mb-4">
            Know a Family Business Ready for Legacy?
          </h2>
          
          <p className="text-foreground/80 mb-6">
            Share the Black Family Business Network with a leader, heir, or family who is building legacy.
          </p>
          
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="contact_name" className="block text-sm font-medium text-foreground mb-1">
                Contact's Name
              </label>
              <input
                type="text"
                id="contact_name"
                name="contact_name"
                value={formData.contact_name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
              />
            </div>
            
            <div>
              <label htmlFor="contact_email" className="block text-sm font-medium text-foreground mb-1">
                Contact's Email Address
              </label>
              <input
                type="email"
                id="contact_email"
                name="contact_email"
                value={formData.contact_email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
              />
            </div>
            
            <input name="form_name" type="hidden" value={formData.form_name} />
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 text-base font-medium text-center mx-auto"
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>

            {submitStatus === "success" && (
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
                Thank you for sharing! Your referral has been received.
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                There was an error submitting your referral. Please try again.
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}