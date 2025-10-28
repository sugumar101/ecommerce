'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toggleFilterValue, isFilterActive, clearAllFilters, type FilterParams } from '@/lib/utils/query';
import {
  mockGenders,
  mockColors,
  mockSizes,
  priceRanges,
} from '@/lib/data/mockProducts';

interface FilterContentProps {
  currentSearch: string;
  expandedSections: Record<string, boolean>;
  handleFilterToggle: (key: keyof FilterParams, value: string) => void;
  handleClearAll: () => void;
  toggleSection: (section: string) => void;
}

function FilterContent({
  currentSearch,
  expandedSections,
  handleFilterToggle,
  handleClearAll,
  toggleSection,
}: FilterContentProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-dark-900">Filters</h2>
        <button
          onClick={handleClearAll}
          className="text-sm text-dark-700 hover:text-dark-900 underline"
        >
          Clear All
        </button>
      </div>

      {/* Gender Filter */}
      <div className="border-b border-light-300 pb-4">
        <button
          onClick={() => toggleSection('gender')}
          className="flex w-full items-center justify-between text-left"
        >
          <h3 className="font-medium text-dark-900">Gender</h3>
          <svg
            className={`h-5 w-5 transition-transform ${
              expandedSections.gender ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {expandedSections.gender && (
          <div className="mt-3 space-y-2">
            {mockGenders.map((gender) => (
              <label
                key={gender.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-light-200 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={isFilterActive(currentSearch, 'gender', gender.slug)}
                  onChange={() => handleFilterToggle('gender', gender.slug)}
                  className="h-4 w-4 rounded border-dark-700 text-dark-900 focus:ring-dark-900"
                />
                <span className="text-sm text-dark-900">{gender.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Size Filter */}
      <div className="border-b border-light-300 pb-4">
        <button
          onClick={() => toggleSection('size')}
          className="flex w-full items-center justify-between text-left"
        >
          <h3 className="font-medium text-dark-900">Size</h3>
          <svg
            className={`h-5 w-5 transition-transform ${
              expandedSections.size ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {expandedSections.size && (
          <div className="mt-3 grid grid-cols-3 gap-2">
            {mockSizes.map((size) => (
              <label
                key={size.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-light-200 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={isFilterActive(currentSearch, 'size', size.slug)}
                  onChange={() => handleFilterToggle('size', size.slug)}
                  className="h-4 w-4 rounded border-dark-700 text-dark-900 focus:ring-dark-900"
                />
                <span className="text-sm text-dark-900">{size.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Color Filter */}
      <div className="border-b border-light-300 pb-4">
        <button
          onClick={() => toggleSection('color')}
          className="flex w-full items-center justify-between text-left"
        >
          <h3 className="font-medium text-dark-900">Color</h3>
          <svg
            className={`h-5 w-5 transition-transform ${
              expandedSections.color ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {expandedSections.color && (
          <div className="mt-3 space-y-2">
            {mockColors.map((color) => (
              <label
                key={color.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-light-200 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={isFilterActive(currentSearch, 'color', color.slug)}
                  onChange={() => handleFilterToggle('color', color.slug)}
                  className="h-4 w-4 rounded border-dark-700 text-dark-900 focus:ring-dark-900"
                />
                <div className="flex items-center gap-2">
                  <div
                    className="h-4 w-4 rounded-full border border-dark-700"
                    style={{ backgroundColor: color.hexCode }}
                  />
                  <span className="text-sm text-dark-900">{color.name}</span>
                </div>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Price Range Filter */}
      <div className="pb-4">
        <button
          onClick={() => toggleSection('priceRange')}
          className="flex w-full items-center justify-between text-left"
        >
          <h3 className="font-medium text-dark-900">Price Range</h3>
          <svg
            className={`h-5 w-5 transition-transform ${
              expandedSections.priceRange ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        {expandedSections.priceRange && (
          <div className="mt-3 space-y-2">
            {priceRanges.map((range) => (
              <label
                key={range.id}
                className="flex items-center gap-2 cursor-pointer hover:bg-light-200 p-2 rounded"
              >
                <input
                  type="checkbox"
                  checked={isFilterActive(currentSearch, 'priceRange', range.id)}
                  onChange={() => handleFilterToggle('priceRange', range.id)}
                  className="h-4 w-4 rounded border-dark-700 text-dark-900 focus:ring-dark-900"
                />
                <span className="text-sm text-dark-900">{range.label}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function Filters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    gender: true,
    size: false,
    color: false,
    priceRange: false,
  });

  const currentSearch = searchParams.toString();

  const handleFilterToggle = (key: keyof FilterParams, value: string) => {
    const newSearch = toggleFilterValue(currentSearch, key, value);
    router.push(`/products?${newSearch}`, { scroll: false });
  };

  const handleClearAll = () => {
    const newSearch = clearAllFilters(currentSearch);
    router.push(`/products?${newSearch}`, { scroll: false });
  };

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-dark-900 px-6 py-3 text-light-100 shadow-lg hover:bg-dark-700 transition-colors"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
          />
        </svg>
        Filters
      </button>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-dark-900 bg-opacity-50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-80 transform bg-light-100 p-6 shadow-xl transition-transform duration-300 ease-in-out lg:hidden ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-dark-900">Filters</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-full p-2 hover:bg-light-200"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 100px)' }}>
          <FilterContent
            currentSearch={currentSearch}
            expandedSections={expandedSections}
            handleFilterToggle={handleFilterToggle}
            handleClearAll={handleClearAll}
            toggleSection={toggleSection}
          />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:block rounded-lg bg-light-100 p-6 shadow-sm">
        <FilterContent
          currentSearch={currentSearch}
          expandedSections={expandedSections}
          handleFilterToggle={handleFilterToggle}
          handleClearAll={handleClearAll}
          toggleSection={toggleSection}
        />
      </div>
    </>
  );
}
