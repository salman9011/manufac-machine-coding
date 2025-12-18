import React from 'react';
import { Select } from '@mantine/core';
import { FilterOptions } from '../types';

/**
 * Props for FilterControls component
 */
interface FilterControlsProps {
  options: FilterOptions;
  selectedCity: string;
  selectedFuelType: 'Petrol' | 'Diesel';
  selectedYear: number;
  onCityChange: (value: string | null) => void;
  onFuelTypeChange: (value: string | null) => void;
  onYearChange: (value: string | null) => void;
}

/**
 * FilterControls Component
 * 
 * Renders three dropdown filters for:
 * 1. Metro City selection
 * 2. Fuel Type selection (Petrol/Diesel)
 * 3. Calendar Year selection
 * 
 * These filters control what data is displayed in the chart
 */
export const FilterControls: React.FC<FilterControlsProps> = ({
  options,
  selectedCity,
  selectedFuelType,
  selectedYear,
  onCityChange,
  onFuelTypeChange,
  onYearChange,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        gap: '1.5rem',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '1rem',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
      }}
    >
      {/* City Dropdown */}
      <div style={{ flex: 1, minWidth: '250px', maxWidth: '350px' }}>
        <Select
          label="Metro City"
          placeholder="Select city"
          value={selectedCity}
          onChange={onCityChange}
          data={options.cities}
          searchable
          clearable={false}
          withCheckIcon={false}
          comboboxProps={{ 
            transitionProps: { transition: 'fade', duration: 200 },
            shadow: 'md'
          }}
          styles={{
            label: { 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
              color: '#495057'
            },
            input: {
              fontSize: '1rem',
              padding: '0.75rem 1rem',
              borderColor: '#ced4da',
              borderWidth: '2px',
              '&:focus': {
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
              }
            }
          }}
        />
      </div>

      {/* Fuel Type Dropdown */}
      <div style={{ flex: 1, minWidth: '250px', maxWidth: '350px' }}>
        <Select
          label="Fuel Type"
          placeholder="Select fuel type"
          value={selectedFuelType}
          onChange={onFuelTypeChange}
          data={options.fuelTypes}
          searchable
          clearable={false}
          withCheckIcon={false}
          comboboxProps={{ 
            transitionProps: { transition: 'fade', duration: 200 },
            shadow: 'md'
          }}
          styles={{
            label: { 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
              color: '#495057'
            },
            input: {
              fontSize: '1rem',
              padding: '0.75rem 1rem',
              borderColor: '#ced4da',
              borderWidth: '2px',
              '&:focus': {
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
              }
            }
          }}
        />
      </div>

      {/* Year Dropdown */}
      <div style={{ flex: 1, minWidth: '250px', maxWidth: '350px' }}>
        <Select
          label="Calendar Year"
          placeholder="Select year"
          value={selectedYear.toString()}
          onChange={onYearChange}
          data={options.years.map((year) => year.toString())}
          searchable
          clearable={false}
          withCheckIcon={false}
          comboboxProps={{ 
            transitionProps: { transition: 'fade', duration: 200 },
            shadow: 'md'
          }}
          styles={{
            label: { 
              fontWeight: 600, 
              marginBottom: '0.5rem',
              fontSize: '0.95rem',
              color: '#495057'
            },
            input: {
              fontSize: '1rem',
              padding: '0.75rem 1rem',
              borderColor: '#ced4da',
              borderWidth: '2px',
              '&:focus': {
                borderColor: '#667eea',
                boxShadow: '0 0 0 3px rgba(102, 126, 234, 0.1)',
              }
            }
          }}
        />
      </div>
    </div>
  );
};
