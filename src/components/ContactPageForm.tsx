import React, { useState } from "react";
import { Button } from "./ui/button";

export default function ContactPageForm() {
  const defaultFormData = {
    name: "", 
    email: "", 
    inquiry_type: "General", 
    message: "", 
    form_name: "Contact Page Form"
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Full Name
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
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          />
        </div>
      </div>

      <div>
        <label htmlFor="inquiry_type" className="block text-sm font-medium text-foreground mb-2">
          Type of Inquiry
        </label>
        <select
          id="inquiry_type"
          name="inquiry_type"
          value={formData.inquiry_type}
          onChange={handleInputChange}
          required
          className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
        >
          <option value="General">General</option>
          <option value="Partnership">Partnership</option>
          <option value="Media/Speaking">Media/Speaking</option>
          <option value="Investor/Donor">Investor/Donor</option>
          <option value="Other">Other</option>
        </select>
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={5}
          className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
        />
      </div>

      <input name="form_name" type="hidden" value={formData.form_name} />
      
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-6 text-base font-medium"
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </Button>

      {submitStatus === "success" && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
          Thank you for your message! We'll be in touch soon.
        </div>
      )}

      {submitStatus === "error" && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
          There was an error sending your message. Please try again or email us directly.
        </div>
      )}
    </form>
  );
}