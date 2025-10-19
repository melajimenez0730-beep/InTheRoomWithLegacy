import React, { useState } from "react";
import { Button } from "../ui/button";
import { X, ArrowRight, FileText } from "lucide-react";

interface LeadCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  formName: string;
  pdfUrl?: string;
  pdfFilename?: string;
}

export default function LeadCaptureModal({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  formName,
  pdfUrl,
  pdfFilename
}: LeadCaptureModalProps) {
  const defaultFormData = { name: "", email: "", form_name: formName };
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  if (!isOpen) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        // No Content-Type header - browser will set it with boundary for multipart/form-data
        body: formDataObj,
      });

      if (response.ok) {
        setSubmitStatus("success");
        
        // Download PDF file if URL provided
        if (pdfUrl && pdfFilename) {
          const link = document.createElement('a');
          link.href = pdfUrl;
          link.download = pdfFilename;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full relative animate-fade-in-up overflow-hidden">
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors z-10"
          aria-label="Close modal"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="bg-primary/5 p-6 border-b border-primary/10">
          <h2 className="text-2xl font-display font-bold text-primary mb-2">
            {title}
          </h2>
          <p className="text-foreground/80">
            {description}
          </p>
        </div>

        {submitStatus === "success" ? (
          <div className="p-6 md:p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-primary mb-3">
              Thank you!
            </h3>
            <p className="text-foreground/80 mb-6">
              Your guide is on its way! It should be downloading automatically. If not, click the button below.
            </p>
            {pdfUrl && (
              <a 
                href={pdfUrl}
                download={pdfFilename}
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-5 py-2 border border-primary bg-primary text-white shadow hover:bg-primary/90"
              >
                <ArrowRight className="mr-2 h-4 w-4" /> 
                Download Guide
              </a>
            )}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 p-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
              />
            </div>

            <input name="form_name" type="hidden" value={formData.form_name} />
            
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 text-base font-medium"
            >
              {isSubmitting ? "Submitting..." : "Get Guide"}
            </Button>

            {submitStatus === "error" && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
                There was an error processing your request. Please try again.
              </div>
            )}
          </form>
        )}
      </div>
    </div>
  );
}