import React, { useState, useEffect } from 'react';
import { BookOpen, Quote, Star, BookMarked } from 'lucide-react';

interface MethodologyCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
}

export default function MethodologyTabs() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories: MethodologyCategory[] = [
    {
      id: 'conversation',
      name: 'Conversation',
      icon: <BookOpen className="text-primary h-4 w-4" />
    },
    {
      id: 'storytelling',
      name: 'Storytelling',
      icon: <Quote className="text-primary h-4 w-4" />
    },
    {
      id: 'assessment',
      name: 'Assessment',
      icon: <Star className="text-primary h-4 w-4" />
    },
    {
      id: 'advisory',
      name: 'Advisory',
      icon: <BookMarked className="text-primary h-4 w-4" />
    }
  ];

  const handleCategoryClick = (categoryId: string) => {
    const newCategory = activeCategory === categoryId ? null : categoryId;
    setActiveCategory(newCategory);
    
    // Call the global function from window
    if (typeof window !== 'undefined' && window.filterMethodologyDimensions) {
      window.filterMethodologyDimensions(newCategory);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 my-10 shadow-sm hidden md:block">
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-6 py-2">
        {categories.map((category, index) => (
          <React.Fragment key={category.id}>
            <div 
              id={`category-${category.id}`}
              className={`category-item group px-4 py-2 cursor-pointer rounded-lg transition-all flex items-center gap-2 hover:bg-primary/5 ${activeCategory === category.id ? 'bg-primary/10' : ''}`}
              onClick={() => handleCategoryClick(category.id)}
            >
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {category.icon}
              </div>
              <span className="font-medium text-primary/90">{category.name}</span>
            </div>
            
            {index < categories.length - 1 && (
              <span className="text-primary/30">•</span>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}