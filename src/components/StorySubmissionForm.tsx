import React, { useState } from "react";
import { Button } from "./ui/button";
import { AlertCircle, Check, Upload } from "lucide-react";

export default function StorySubmissionForm() {
  const defaultFormData = {
    name: "",
    email: "",
    location: "",
    story_title: "",
    legacy_pillar: "",
    story_content: "",
    media: null as File | null,
    permission: false,
    form_name: "Family Story Submission"
  };
  
  const [formData, setFormData] = useState(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFileError(null);
    setFileName(null);
    
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const MAX_SIZE = 10 * 1024 * 1024; // 10MB max size
      
      if (file.size > MAX_SIZE) {
        setFileError("File size exceeds 10MB limit. Please upload a smaller file.");
        e.target.value = '';
        return;
      }
      
      // Check if it's a video and validate duration (client-side estimation)
      if (file.type.startsWith('video/')) {
        const video = document.createElement('video');
        video.preload = 'metadata';
        
        video.onloadedmetadata = () => {
          window.URL.revokeObjectURL(video.src);
          
          if (video.duration > 120) { // 2 minutes = 120 seconds
            setFileError("Video duration exceeds 2 minute limit. Please upload a shorter video.");
            setFormData(prev => ({ ...prev, media: null }));
            e.target.value = '';
          } else {
            setFormData(prev => ({ ...prev, media: file }));
            setFileName(file.name);
          }
        };
        
        video.src = URL.createObjectURL(file);
      } else {
        setFormData(prev => ({ ...prev, media: file }));
        setFileName(file.name);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form before submission
    if (fileError) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Create FormData object for multipart/form-data submission
      const formDataObj = new FormData();
      
      // Add all text fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key !== 'media') { // Skip media field here
          formDataObj.append(key, String(value));
        }
      });
      
      // Add the file if present
      if (formData.media instanceof File) {
        formDataObj.append('media', formData.media);
      }
      
      const response = await fetch("https://api.new.website/api/submit-form/", {
        method: "POST",
        // No Content-Type header - browser will set it with boundary for multipart/form-data
        body: formDataObj,
      });

      if (response.ok) {
        setSubmitStatus("success");
        setFormData(defaultFormData);
        setFileName(null);
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
              Name / Family Name
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
          <label htmlFor="location" className="block text-sm font-medium text-foreground mb-1">
            City, State, Country
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            placeholder="E.g., 'Austin, Texas, USA'"
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          />
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
          <label htmlFor="legacy_pillar" className="block text-sm font-medium text-foreground mb-1">
            Legacy Pillar
          </label>
          <select
            id="legacy_pillar"
            name="legacy_pillar"
            value={formData.legacy_pillar}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          >
            <option value="" disabled>Select a Legacy Pillar</option>
            <option value="Family Legacy">Family Legacy</option>
            <option value="Next-Gen Stewardship">Next-Gen Stewardship</option>
            <option value="Storytelling & Culture">Storytelling & Culture</option>
            <option value="Economic Empowerment">Economic Empowerment</option>
            <option value="Transitions & Healing">Transitions & Healing</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="story_content" className="block text-sm font-medium text-foreground mb-1">
            Short Story
            <span className="ml-2 text-xs text-foreground/60">(500–800 words)</span>
          </label>
          <textarea
            id="story_content"
            name="story_content"
            value={formData.story_content}
            onChange={handleInputChange}
            rows={10}
            required
            placeholder="Share your family's legacy story. What happened? Who was involved? What lessons were learned? How has this story shaped your family's identity or values?"
            className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 bg-card"
          ></textarea>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="media" className="block text-sm font-medium text-foreground mb-1">
            Upload Photo or Video
            <span className="ml-2 text-xs text-foreground/60">(max 2 min for video)</span>
          </label>
          <div className="relative border-2 border-dashed border-border rounded-md p-6 flex flex-col items-center justify-center bg-card/50 hover:bg-card/70 transition-colors cursor-pointer">
            <input
              type="file"
              id="media"
              name="media"
              onChange={handleFileChange}
              accept="image/*,video/*"
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            />
            <Upload className="h-10 w-10 text-primary/60 mb-2" />
            <p className="text-sm text-center text-foreground/70">
              {fileName ? (
                <span className="font-medium text-primary">Selected: {fileName}</span>
              ) : (
                <>
                  Drag and drop or click to upload a photo or video<br />
                  <span className="text-xs">Supported formats: JPG, PNG, MP4, MOV (max 10MB)</span>
                </>
              )}
            </p>
            {fileError && (
              <div className="mt-3 flex items-center gap-2 text-destructive text-sm">
                <AlertCircle className="h-4 w-4" />
                <span>{fileError}</span>
              </div>
            )}
          </div>
        </div>
        
        <div>
          <label htmlFor="permission" className="flex items-start gap-3">
            <div className="relative flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-border bg-card ring-offset-background">
              <input
                type="checkbox"
                id="permission"
                name="permission"
                checked={formData.permission}
                onChange={handleCheckboxChange}
                required
                className="peer h-6 w-6 opacity-0 absolute"
              />
              {formData.permission && (
                <Check className="h-4 w-4 text-primary" />
              )}
            </div>
            <span className="text-sm text-foreground/80">
              I give permission for In the Room with Legacy to share my story on their website, social media, and other promotional materials. I understand that my story may be edited for clarity and length.
            </span>
          </label>
        </div>
        
        <input name="form_name" type="hidden" value={formData.form_name} />
        
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 text-base font-medium bg-primary hover:bg-primary/90"
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