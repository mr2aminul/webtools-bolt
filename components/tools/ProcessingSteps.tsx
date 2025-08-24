'use client';

import { Check } from 'lucide-react';

interface ProcessingStepsProps {
  currentStep: number;
  steps: string[];
}

export function ProcessingSteps({ currentStep, steps }: ProcessingStepsProps) {
  return (
    <div className="flex items-center justify-center space-x-4 mb-8">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div className="flex items-center space-x-2">
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300
                ${index < currentStep 
                  ? 'bg-green-500 text-white' 
                  : index === currentStep 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }
              `}
            >
              {index < currentStep ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            <span 
              className={`
                text-sm font-medium transition-colors duration-300
                ${index <= currentStep ? 'text-gray-900' : 'text-gray-500'}
              `}
            >
              {step}
            </span>
          </div>
          
          {index < steps.length - 1 && (
            <div 
              className={`
                w-12 h-0.5 mx-4 transition-colors duration-300
                ${index < currentStep ? 'bg-green-500' : 'bg-gray-200'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );
}