import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

interface LeadCaptureFormProps {
  guideName: string;
  onSuccess?: () => void;
  pdfPath?: string;
}

export function LeadCaptureForm({ 
  guideName, 
  onSuccess,
  pdfPath = "/pdfs/parenting-a-parent-a-guide-for-adult-children_nw_fa0eeee7.pdf" 
}: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    form_name: `Legacy Guide: ${guideName}`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [downloadStarted, setDownloadStarted] = useState(false);

  // Trigger download function
  const initiateDownload = () => {
    const link = document.createElement('a');
    link.href = pdfPath;
    link.setAttribute('download', `${guideName.replace(/[^a-z0-9]/gi, '-').toLowerCase()}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setDownloadStarted(true);
  };

  // Auto-download when status changes to success - immediate download
  useEffect(() => {
    if (submitStatus === "success" && !downloadStarted) {
      // Download immediately without delay
      initiateDownload();
      
      // Scroll to top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [submitStatus, downloadStarted]);

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
        if (onSuccess) {
          onSuccess();
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

  if (submitStatus === "success") {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5" />
          </svg>
        </div>
        <h3 className="text-xl font-display font-bold mb-3 text-primary">Thank You!</h3>
        <p className="mb-5 text-foreground/80">Check your email for your guide. Your guide has been downloaded.</p>
        {/* Removed the Access Your Snapshot button to avoid secondary popup */}
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Hidden form_name field */}
      <input 
        type="hidden" 
        name="form_name" 
        value={formData.form_name} 
      />
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white text-base md:text-base shadow-sm"
          placeholder="Your name"
          autoCorrect="off"
          autoComplete="name" 
        />
      </div>
      
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
          Email Address
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white text-base md:text-base shadow-sm"
          placeholder="Your email address"
          inputMode="email"
          autoCapitalize="off"
          autoCorrect="off"
          autoComplete="email"
        />
      </div>

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          There was an error processing your request. Please try again.
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-3 mt-2 bg-primary hover:bg-primary/90 !text-white font-medium text-base rounded-lg shadow-sm"
      >
        <span className="text-white">{isSubmitting ? "Processing..." : "Get Your Guide"}</span>
      </Button>
    </form>
  );
}