import React, { useState } from "react";
import { Button } from "./ui/button";

export default function UpdatesSignupForm() {
  const defaultFormData = {
    signup_name: "",
    signup_email: "",
    business_owner: "",
    interests: "",
    form_name: "Black Family Business Network Updates"
  };
  
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
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
        // No Content-Type header - browser will set it with boundary for multipart/form-data
        headers: {
          // Add the Referer header to identify this site
          "Referer": window.location.origin
        },
        body: formDataObj,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData(defaultFormData);
      } else {
        setSubmitStatus("error");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="signup_name" className="block text-sm font-medium text-foreground mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="signup_name"
            name="signup_name"
            value={formData.signup_name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          />
        </div>
        
        <div>
          <label htmlFor="signup_email" className="block text-sm font-medium text-foreground mb-1">
            Email Address
          </label>
          <input
            type="email"
            id="signup_email"
            name="signup_email"
            value={formData.signup_email}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="business_owner" className="block text-sm font-medium text-foreground mb-1">
          Are you a Black family business owner or representative?
        </label>
        <select
          id="business_owner"
          name="business_owner"
          value={formData.business_owner}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
        >
          <option value="">Please select...</option>
          <option value="yes">Yes, I own or represent a Black family business</option>
          <option value="future">Not yet, but I plan to start one</option>
          <option value="no">No, but I'm interested in supporting Black family businesses</option>
        </select>
      </div>
      
      <div>
        <label htmlFor="interests" className="block text-sm font-medium text-foreground mb-1">
          What aspects of the Network are you most interested in? (Optional)
        </label>
        <textarea
          id="interests"
          name="interests"
          value={formData.interests}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
        ></textarea>
      </div>
      
      <input name="form_name" type="hidden" value={formData.form_name} />
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 text-base font-medium text-center mx-auto"
      >
        {isSubmitting ? "Signing up..." : "Sign Up for Updates"}
      </Button>

      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
          Thank you for signing up! You'll be the first to know about our updates.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          There was an error processing your request. Please try again.
        </div>
      )}
    </form>
  );
}