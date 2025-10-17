import React, { useState } from 'react';
import { ChevronDown, ChevronUp, BookOpen, Quote, Star, BookMarked } from 'lucide-react';

interface MethodologyItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  relatedDimensions: string[];
}

export default function MethodologyAccordion() {
  const [activeItem, setActiveItem] = useState<string | null>(null);

  const methodologies: MethodologyItem[] = [
    {
      id: 'conversation',
      name: 'Conversation',
      icon: <BookOpen className="text-primary h-4 w-4" />,
      description: 'Guided dialogues and frameworks that help families connect, align, and navigate challenging topics with clarity and care.',
      relatedDimensions: ['Family Legacy', 'Storytelling & Culture', 'Transitions & Healing']
    },
    {
      id: 'storytelling',
      name: 'Storytelling',
      icon: <Quote className="text-primary h-4 w-4" />,
      description: "Capturing, preserving, and sharing the narratives that shape your family's identity and culture across generations.",
      relatedDimensions: ['Family Legacy', 'Storytelling & Culture']
    },
    {
      id: 'assessment',
      name: 'Assessment',
      icon: <Star className="text-primary h-4 w-4" />,
      description: "Tools to evaluate your family's current legacy state, uncover strengths, and identify areas for focused development.",
      relatedDimensions: ['Next-Gen Stewardship', 'Economic Empowerment', 'Transitions & Healing']
    },
    {
      id: 'advisory',
      name: 'Advisory',
      icon: <BookMarked className="text-primary h-4 w-4" />,
      description: "Personalized guidance for families navigating succession, wealth transfer, and long-term legacy planning.",
      relatedDimensions: ['Next-Gen Stewardship', 'Economic Empowerment', 'Transitions & Healing']
    }
  ];

  const toggleItem = (id: string) => {
    const newActive = activeItem === id ? null : id;
    setActiveItem(newActive);
    
    // Call the global filter function
    if (typeof window !== 'undefined' && window.filterMethodologyDimensions) {
      window.filterMethodologyDimensions(newActive);
    }
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm md:hidden my-6">
      {methodologies.map(item => (
        <div key={item.id} className="mb-2 last:mb-0 border border-primary/10 rounded-lg overflow-hidden">
          <button 
            onClick={() => toggleItem(item.id)}
            className={`w-full flex items-center justify-between p-4 text-left transition-colors ${activeItem === item.id ? 'bg-primary/10' : 'hover:bg-primary/5'}`}
            aria-expanded={activeItem === item.id}
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <span className="font-medium text-primary/90">{item.name}</span>
            </div>
            {activeItem === item.id ? 
              <ChevronUp className="h-5 w-5 text-primary/70" /> : 
              <ChevronDown className="h-5 w-5 text-primary/70" />
            }
          </button>
          
          {activeItem === item.id && (
            <div className="px-4 pb-4 pt-0">
              <div className="pl-11">
                <p className="text-sm text-foreground/80">{item.description}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}