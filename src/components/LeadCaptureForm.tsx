import React, { useState } from "react";
import { Button } from "./ui/button";

interface LeadCaptureFormProps {
  guideName: string;
  onSuccess?: () => void;
}

export function LeadCaptureForm({ guideName, onSuccess }: LeadCaptureFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    form_name: `Guide Download: ${guideName}`
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

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
      <div className="text-center py-4">
        <h3 className="text-xl font-semibold mb-2">Thank You!</h3>
        <p className="mb-4">Your guide is on its way to your inbox.</p>
        <p className="text-sm text-muted-foreground">Check your email for a download link. If you don't see it, please check your spam folder.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Hidden form_name field */}
      <input 
        type="hidden" 
        name="form_name" 
        value={formData.form_name} 
      />
      
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
          Email Address
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

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          There was an error processing your request. Please try again.
        </div>
      )}

      <Button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full py-2"
      >
        {isSubmitting ? "Processing..." : "Download Guide"}
      </Button>
    </form>
  );
}