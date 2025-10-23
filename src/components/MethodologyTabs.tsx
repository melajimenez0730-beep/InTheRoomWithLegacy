import React, { useState, useEffect } from 'react';
import { BookOpen, Quote, Star, BookMarked } from 'lucide-react';

interface MethodologyCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  relatedDimensions?: string[];
}

export default function MethodologyTabs() {
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories: MethodologyCategory[] = [
    {
      id: 'conversation',
      name: 'Storytelling & Documentation',
      icon: <BookOpen className="text-primary h-4 w-4" />,
      description: 'We help families and individuals preserve what matters most: the stories, values, and milestones that define who they are. Through guided prompts, digital tools, and curated archives, we make remembering a shared act of love.',
      relatedDimensions: ['Family Legacy', 'Storytelling & Culture', 'Transitions & Healing']
    },
    {
      id: 'storytelling',
      name: 'Learning & Tools',
      icon: <Quote className="text-primary h-4 w-4" />,
      description: "We build the practical frameworks that turn reflection into action, from our Legacy Assessment Tool to workshops and educational guides. These resources make planning, preparation, and conversation accessible for every generation.",
      relatedDimensions: ['Family Legacy', 'Storytelling & Culture']
    },
    {
      id: 'assessment',
      name: 'Advisory & Community',
      icon: <Star className="text-primary h-4 w-4" />,
      description: "Legacy isn't built alone. We connect families, professionals, and experts through advisory programs, partnerships, and networks that sustain impact and accountability over time.",
      relatedDimensions: ['Next-Gen Stewardship', 'Economic Empowerment', 'Transitions & Healing']
    },
    {
      id: 'advisory',
      name: 'Experiences & Programs',
      icon: <BookMarked className="text-primary h-4 w-4" />,
      description: "We create transformative spaces: gatherings, retreats, and intergenerational sessions that bring the spirit of legacy to life. These experiences nurture connection, clarity, and commitment across generations.",
      relatedDimensions: ['Next-Gen Stewardship', 'Economic Empowerment', 'Transitions & Healing']
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
    <div className="bg-white rounded-xl p-6 my-10 shadow-sm hidden md:block">
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-6 py-2 mb-6">
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
      
      {/* Permanently visible description cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map(category => (
          <div 
            key={category.id} 
            className={`p-4 border border-primary/10 rounded-lg bg-white/90 transition-all ${activeCategory === category.id ? 'ring-2 ring-primary/20' : ''}`}
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 mt-0.5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {category.icon}
              </div>
              <h4 className="font-medium text-primary/90 text-lg">{category.name}</h4>
            </div>
            <div className="pl-11">
              <p className="text-sm text-foreground/80">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}