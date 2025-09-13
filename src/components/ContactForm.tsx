import React, { useState } from "react";
import { Button } from "./ui/button";

export default function ContactForm() {
  const defaultFormData = {name: "", email: "", message: "", form_name: "Join the Room Form"};
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch("https://api.new.website/api/submit-form/", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: JSON.stringify(formData),
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
    <div className="bg-white rounded-xl shadow-lg border border-primary/10 overflow-hidden" id="join-the-room">
      <div className="bg-primary/5 p-6 border-b border-primary/10">
        <h3 className="font-display text-2xl font-bold text-primary mb-2">Join the Room</h3>
        <p className="text-foreground/80">
          Be the first to receive new tools, resources and event invitations to help preserve your family's legacy.
        </p>
      </div>
      
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

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-1">
            What aspect of legacy are you most interested in? (Optional)
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          />
        </div>

        <input name="form_name" type="hidden" value={formData.form_name} />
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-6 text-base font-medium"
        >
          {isSubmitting ? "Joining..." : "Join the Room"}
        </Button>

        {submitStatus === "success" && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
            Thank you for joining! We've sent a confirmation to your email.
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            There was an error processing your request. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}