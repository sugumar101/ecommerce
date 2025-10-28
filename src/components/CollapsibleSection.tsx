'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

export default function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionId = `section-${title.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="border-b border-light-300">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 text-left focus:outline-none focus:ring-2 focus:ring-dark-900 focus:ring-offset-2 rounded"
        aria-expanded={isOpen}
        aria-controls={sectionId}
      >
        <h3 className="text-base font-medium text-dark-900">{title}</h3>
        <ChevronDown
          className={`h-5 w-5 text-dark-700 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div id={sectionId} className="pb-4 text-sm text-dark-700 leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}
