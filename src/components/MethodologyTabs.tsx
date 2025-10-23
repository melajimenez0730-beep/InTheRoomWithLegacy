import React from 'react';
import { BookOpen, Quote, Star, BookMarked } from 'lucide-react';

interface MethodologyCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  description: string;
  relatedDimensions?: string[];
}

export default function MethodologyTabs() {
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

  // No filtering functionality - purely informational display

  return (
    <div className="bg-white rounded-xl p-6 my-10 shadow-sm hidden md:block">
      {/* Non-interactive definition boxes with equal height */}
      <div className="grid grid-cols-2 gap-6">
        {categories.map(category => (
          <div 
            key={category.id} 
            className="p-5 border border-primary/10 rounded-lg bg-white/90 shadow-sm flex flex-col h-full"
          >
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 mt-0.5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {category.icon}
              </div>
              <h4 className="font-medium text-primary/90 text-lg">{category.name}</h4>
            </div>
            <div className="pl-11 flex-grow">
              <p className="text-sm text-foreground/80">{category.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}