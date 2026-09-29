import React from 'react';
import {
  Compass,
  User,
  Sliders,
  BarChart2,
  ShieldAlert,
  BookOpen,
  Image as ImageIcon,
  Users,
  FileCode2,
} from 'lucide-react';

export interface StepInfo {
  id: number;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const STEPS: StepInfo[] = [
  { id: 1, label: '1. Architecture', subtitle: 'Orientation & Archetype', icon: Compass },
  { id: 2, label: '2. Appearance', subtitle: 'Physical & Sensory Traits', icon: User },
  { id: 3, label: '3. Frameworks', subtitle: 'Dual Control & 5-Layer Depth', icon: Sliders },
  { id: 4, label: '4. 15 Dimensions', subtitle: 'Sexuality Profile Matrix', icon: BarChart2 },
  { id: 5, label: '5. Behavioral Rules', subtitle: 'Contradictions & Switches', icon: ShieldAlert },
  { id: 6, label: '6. Backstory DB', subtitle: 'Dynamic Chapter Memory', icon: BookOpen },
  { id: 7, label: '7. Mood Board', subtitle: 'Visual & Sensory Canvas', icon: ImageIcon },
  { id: 8, label: '8. Relationships', subtitle: 'Interactive Partner Tracker', icon: Users },
  { id: 9, label: '9. System Prompt', subtitle: 'Roleplay Output Generator', icon: FileCode2 },
];

interface StepNavigationProps {
  currentStep: number;
  onSelectStep: (stepId: number) => void;
}

export const StepNavigation: React.FC<StepNavigationProps> = ({
  currentStep,
  onSelectStep,
}) => {
  return (
    <nav className="bg-slate-900/90 border-b border-slate-800 px-4 py-2 sticky top-[65px] z-20 backdrop-blur-md shadow-md overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center justify-between min-w-[850px] gap-1">
        {STEPS.map((step) => {
          const Icon = step.icon;
          const isActive = currentStep === step.id;
          return (
            <button
              key={step.id}
              onClick={() => onSelectStep(step.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl transition-all cursor-pointer text-left flex-1 min-w-[120px] ${
                isActive
                  ? 'bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/40 text-rose-200 shadow-md shadow-rose-950/30'
                  : 'hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <div
                className={`p-1.5 rounded-lg ${
                  isActive
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-slate-800 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
              <div className="truncate">
                <p className="text-xs font-bold leading-none truncate">{step.label}</p>
                <p className="text-[10px] text-slate-500 truncate mt-0.5">{step.subtitle}</p>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
