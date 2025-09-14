import React, { useState } from "react";
import { Button } from "./ui/button";

export default function StoryReferralForm() {
  const defaultFormData = {
    referral_business_name: "",
    referral_contact_name: "",
    referral_email: "",
    referral_note: "",
    your_name: "",
    your_email: "",
    form_name: "Black Family Business Referral"
  };
  
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
        body: formDataObj,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData(defaultFormData);
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
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="referral_business_name" className="block text-sm font-medium text-foreground mb-1">
            Business Name
          </label>
          <input
            type="text"
            id="referral_business_name"
            name="referral_business_name"
            value={formData.referral_business_name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          />
        </div>
        
        <div>
          <label htmlFor="referral_contact_name" className="block text-sm font-medium text-foreground mb-1">
            Contact Person
          </label>
          <input
            type="text"
            id="referral_contact_name"
            name="referral_contact_name"
            value={formData.referral_contact_name}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="referral_email" className="block text-sm font-medium text-foreground mb-1">
          Contact Email
        </label>
        <input
          type="email"
          id="referral_email"
          name="referral_email"
          value={formData.referral_email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
        />
      </div>
      
      <div>
        <label htmlFor="referral_note" className="block text-sm font-medium text-foreground mb-1">
          Additional Notes (Optional)
        </label>
        <textarea
          id="referral_note"
          name="referral_note"
          value={formData.referral_note}
          onChange={handleInputChange}
          rows={3}
          className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
        ></textarea>
      </div>
      
      <div>
        <label htmlFor="your_name" className="block text-sm font-medium text-foreground mb-1">
          Your Name
        </label>
        <input
          type="text"
          id="your_name"
          name="your_name"
          value={formData.your_name}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
        />
      </div>
      
      <div>
        <label htmlFor="your_email" className="block text-sm font-medium text-foreground mb-1">
          Your Email
        </label>
        <input
          type="email"
          id="your_email"
          name="your_email"
          value={formData.your_email}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
        />
      </div>
      
      <input name="form_name" type="hidden" value={formData.form_name} />
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3 text-base font-medium"
      >
        {isSubmitting ? "Submitting..." : "Submit Referral"}
      </Button>

      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
          Thank you for your referral! We'll reach out to the business you shared.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          There was an error submitting your referral. Please try again.
        </div>
      )}
    </form>
  );
}