import React, { useState } from "react";
import LeadCaptureModal from "./LeadCaptureModal";

export default function ParentingGuideModal() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button 
        onClick={openModal}
        className="content-card-actions inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-5 py-2 border border-primary bg-primary text-white shadow hover:bg-primary/90 w-full mt-2"
      >
        <svg className="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
        Read Guide
      </button>

      <LeadCaptureModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Get Your Free Guide"
        description="Provide your information to receive 'Parenting a Parent: A Guide for Adult Children' directly to your inbox."
        formName="Parenting a Parent Guide Download"
        pdfUrl="/media/parenting_a_parent_final_guide_updated_nw_d4b4a552.pdf"
        pdfFilename="Parenting_a_Parent_Guide.pdf"
      />
    </>
  );
}