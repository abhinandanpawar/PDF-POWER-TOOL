import React from 'react';

interface StepsProps {
  steps: string[];
  currentStep: number;
  onStepClick: (step: number) => void;
}

export const Steps: React.FC<StepsProps> = ({ steps, currentStep, onStepClick }) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`flex items-center ${index <= currentStep ? 'cursor-pointer' : ''}`}
          onClick={() => {
            if (index <= currentStep) {
              onStepClick(index);
            }
          }}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center
                        ${index <= currentStep ? 'bg-primary text-white' : 'bg-secondary text-text-secondary'}`}
          >
            {index + 1}
          </div>
          <div className={`ml-2 ${index <= currentStep ? 'text-text-primary' : 'text-text-secondary'}`}>
            {step}
          </div>
          {index < steps.length - 1 && (
            <div className="ml-4 w-16 h-px bg-border" />
          )}
        </div>
      ))}
    </div>
  );
};
