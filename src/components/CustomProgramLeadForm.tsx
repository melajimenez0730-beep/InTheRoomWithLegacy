import React, { useState } from "react";
import { Button } from "./ui/button";
import { CheckCircle } from "lucide-react";

interface CustomProgramLeadFormProps {
  onSuccess?: () => void;
}

export function CustomProgramLeadForm({ onSuccess }: CustomProgramLeadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    form_name: "Custom Program Inquiry"
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
          setTimeout(() => {
            onSuccess();
          }, 3000); // Give user time to see success message before closing
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
        <div className="flex justify-center mb-4">
          <div className="rounded-full bg-green-100 p-3">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-primary">Thank You!</h3>
        <p className="text-foreground/80">
          We've received your inquiry about a custom program. Our team will contact you shortly to discuss your unique needs.
        </p>
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
        <label htmlFor="custom-name" className="block text-sm font-medium text-foreground mb-1">
          Name
        </label>
        <input
          type="text"
          id="custom-name"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white"
          placeholder="Your name"
        />
      </div>
      
      <div>
        <label htmlFor="custom-email" className="block text-sm font-medium text-foreground mb-1">
          Email Address
        </label>
        <input
          type="email"
          id="custom-email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-primary/20 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-white"
          placeholder="Your email address"
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
        className="w-full py-2 bg-primary hover:bg-primary/90 text-white font-medium"
      >
        {isSubmitting ? "Processing..." : "Submit Inquiry"}
      </Button>
    </form>
  );
}