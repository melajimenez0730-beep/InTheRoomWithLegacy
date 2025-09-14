import React, { useState } from "react";
import { Button } from "./ui/button";

export default function StorySubmissionForm() {
  const defaultFormData = {
    name: "",
    email: "",
    story_title: "",
    story_summary: "",
    story_content: "",
    permission: false,
    form_name: "Family Story Submission"
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

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData object for multipart/form-data submission
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, String(value));
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
    <div className="bg-white rounded-lg shadow-md p-6 md:p-8 border border-primary/10">
      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
              Your Name
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
        </div>
        
        <div>
          <label htmlFor="story_title" className="block text-sm font-medium text-foreground mb-1">
            Story Title
          </label>
          <input
            type="text"
            id="story_title"
            name="story_title"
            value={formData.story_title}
            onChange={handleInputChange}
            required
            placeholder="E.g., 'How My Grandmother Built Our Family Business'"
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          />
        </div>
        
        <div>
          <label htmlFor="story_summary" className="block text-sm font-medium text-foreground mb-1">
            Brief Summary
          </label>
          <textarea
            id="story_summary"
            name="story_summary"
            value={formData.story_summary}
            onChange={handleInputChange}
            rows={3}
            required
            placeholder="A short description of your story (2-3 sentences)"
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="story_content" className="block text-sm font-medium text-foreground mb-1">
            Your Family Story
          </label>
          <textarea
            id="story_content"
            name="story_content"
            value={formData.story_content}
            onChange={handleInputChange}
            rows={8}
            required
            placeholder="Share the details of your family's legacy story. What happened? Who was involved? What lessons were learned? How has this story shaped your family's identity or values?"
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          ></textarea>
        </div>
        
        <div>
          <label htmlFor="permission" className="flex items-start gap-2">
            <input
              type="checkbox"
              id="permission"
              name="permission"
              checked={formData.permission}
              onChange={handleCheckboxChange}
              required
              className="mt-1"
            />
            <span className="text-sm text-foreground/80">
              I give permission for In the Room with Legacy to share my story on their website, social media, and other promotional materials. I understand that my story may be edited for clarity and length.
            </span>
          </label>
        </div>
        
        <input name="form_name" type="hidden" value={formData.form_name} />
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3 text-base font-medium"
        >
          {isSubmitting ? "Submitting..." : "Submit Your Story"}
        </Button>

        {submitStatus === "success" && (
          <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-md">
            Thank you for sharing your story! We'll review it shortly.
          </div>
        )}

        {submitStatus === "error" && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-md">
            There was an error submitting your story. Please try again.
          </div>
        )}
      </form>
    </div>
  );
}