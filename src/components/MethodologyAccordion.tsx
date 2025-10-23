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