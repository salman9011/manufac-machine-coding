import { useState, useMemo, useEffect } from 'react';
import { MantineProvider, Container, Title, Paper, Loader, Text, Alert } from '@mantine/core';
import { useFuelData } from './hooks/useFuelData';
import {
  extractFilterOptions,
  calculateMonthlyAverage,
  getDefaultFilters,
} from './utils/dataProcessing';
import './App.css';
import { FilterControls } from './components/filterControls';
import { FuelPriceChart } from './components/fuelPriceChart';

/**
 * Main Application Component
 * 
 * This is the root component that:
 * 1. Loads CSV data using useFuelData hook
 * 2. Manages filter state (city, fuel type, year)
 * 3. Calculates monthly averages based on filters
 * 4. Renders filter controls and chart
 * 
 * State Management:
 * - Uses React hooks for state management
 * - useMemo for expensive computations (filtering, calculations)
 * - Automatic re-rendering when filters change
 * 
 * Performance Optimizations:
 * - Memoized filter options extraction
 * - Memoized chart data calculations
 * - Only re-calculates when dependencies change
 */
function App() {
  // ========================================================================
  // DATA LOADING
  // ========================================================================
  
  /**
   * Load fuel price data from CSV file using custom hook
   * The hook handles:
   * - Fetching CSV from public/data/fuel-prices.csv
   * - Parsing CSV into structured data
   * - Error handling and loading states
   */
  const { data, loading, error } = useFuelData();
  console.log('🔍 Data:', data);

  // ========================================================================
  // FILTER OPTIONS EXTRACTION
  // ========================================================================
  
  /**
   * Extract unique values for filter dropdowns from loaded data
   * Memoized to prevent recalculation on every render
   * Only recalculates when data changes
   * 
   * Time Complexity: O(n) where n is number of records
   */
  const filterOptions = useMemo(
    () =>
      data.length > 0
        ? extractFilterOptions(data)
        : { cities: [], fuelTypes: [], years: [] },
    [data]
  );

  /**
   * Get default filter values to initialize dropdowns
   * Uses first available values from extracted options
   * Memoized to prevent recalculation
   */
  const defaults = useMemo(
    () =>
      filterOptions.cities.length > 0
        ? getDefaultFilters(filterOptions)
        : null,
    [filterOptions]
  );

  // ========================================================================
  // STATE MANAGEMENT
  // ========================================================================
  
  /**
   * State for selected city filter
   * Controls which city's data is displayed in the chart
   */
  const [selectedCity, setSelectedCity] = useState<string>('');

  /**
   * State for selected fuel type filter
   * Controls whether Petrol or Diesel data is displayed
   */
  const [selectedFuelType, setSelectedFuelType] = useState<'Petrol' | 'Diesel'>('Petrol');

  /**
   * State for selected year filter
   * Controls which year's data is displayed in the chart
   */
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());

  // ========================================================================
  // EFFECT: INITIALIZE FILTERS
  // ========================================================================
  
  /**
   * Initialize filter states when default values become available
   * Runs once when data is loaded and defaults are calculated
   */
  useEffect(() => {
    if (defaults && !selectedCity) {
      setSelectedCity(defaults.city);
      setSelectedFuelType(defaults.fuelType);
      setSelectedYear(defaults.year);
    }
  }, [defaults, selectedCity]);

  // ========================================================================
  // CHART DATA CALCULATION
  // ========================================================================
  
  /**
   * Calculate monthly average prices for selected filters
   * Memoized to prevent recalculation unless filters or data change
   * 
   * Time Complexity: O(n + m) where:
   * - n = total records in dataset
   * - m = filtered records matching criteria
   * 
   * Only recalculates when:
   * - Data changes
   * - Selected city changes
   * - Selected fuel type changes
   * - Selected year changes
   */
  const chartData = useMemo(
    () =>
      data.length > 0 && selectedCity
        ? calculateMonthlyAverage(data, selectedCity, selectedFuelType, selectedYear)
        : [],
    [data, selectedCity, selectedFuelType, selectedYear]
  );

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================
  
  /**
   * Handle city filter change
   * Updates selectedCity state when user selects a different city
   * @param value - Selected city name or null
   */
  const handleCityChange = (value: string | null) => {
    if (value) {
      setSelectedCity(value);
    }
  };

  /**
   * Handle fuel type filter change
   * Updates selectedFuelType state when user selects Petrol or Diesel
   * Validates that value is either 'Petrol' or 'Diesel'
   * @param value - Selected fuel type or null
   */
  const handleFuelTypeChange = (value: string | null) => {
    if (value === 'Petrol' || value === 'Diesel') {
      setSelectedFuelType(value);
    }
  };

  /**
   * Handle year filter change
   * Updates selectedYear state when user selects a different year
   * Parses string value to integer
   * @param value - Selected year as string or null
   */
  const handleYearChange = (value: string | null) => {
    if (value) {
      setSelectedYear(parseInt(value, 10));
    }
  };

  // ========================================================================
  // RENDER: LOADING STATE
  // ========================================================================
  
  /**
   * Show loading spinner while CSV data is being loaded and parsed
   * Displays centered loader with informative message
   */
  if (loading) {
    return (
      <MantineProvider>
        <div className="app-background">
          <Container size="xl" py="xl">
            <div
              style={{
                textAlign: 'center',
                padding: '4rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '60vh',
              }}
            >
              <Loader size="xl" color="blue" type="dots" />
              <Text mt="xl" size="xl" fw={600} c="white">
                Loading fuel price data...
              </Text>
              <Text mt="sm" size="md" c="gray.3">
                Please wait while we load and process the dataset
              </Text>
            </div>
          </Container>
        </div>
      </MantineProvider>
    );
  }

  // ========================================================================
  // RENDER: ERROR STATE
  // ========================================================================
  
  /**
   * Show error alert if CSV loading or parsing fails
   * Provides helpful message about file location
   */
  if (error) {
    return (
      <MantineProvider>
        <div className="app-background">
          <Container size="xl" py="xl">
            <div style={{ maxWidth: '600px', margin: '0 auto' }}>
              <Alert
                title="⚠️ Error Loading Data"
                color="red"
                variant="filled"
                styles={{
                  root: {
                    padding: '2rem',
                  },
                  title: {
                    fontSize: '1.5rem',
                    marginBottom: '1rem',
                  },
                }}
              >
                <Text size="md" mb="md">
                  {error}
                </Text>
                <Text size="sm" mt="md" style={{ opacity: 0.9 }}>
                  <strong>Please check:</strong>
                </Text>
                <ul style={{ marginTop: '0.5rem', paddingLeft: '1.5rem' }}>
                  <li>
                    <Text size="sm">
                      CSV file is located at: <code>public/data/fuel-prices.csv</code>
                    </Text>
                  </li>
                  <li>
                    <Text size="sm">
                      CSV file has the correct format with required columns
                    </Text>
                  </li>
                  <li>
                    <Text size="sm">
                      File path is correct (case-sensitive on some systems)
                    </Text>
                  </li>
                </ul>
              </Alert>
            </div>
          </Container>
        </div>
      </MantineProvider>
    );
  }

  // ========================================================================
  // RENDER: MAIN APPLICATION UI
  // ========================================================================
  
  return (
    <MantineProvider>
      <div className="app-background">
        <Container size="xl" py="xl">
          <Paper
            shadow="md"
            p="xl"
            radius="md"
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.98)',
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* ============================================================ */}
            {/* HEADER SECTION */}
            {/* ============================================================ */}
            
            <div style={{ marginBottom: '2rem' }}>
              {/* Main Title with Gradient Effect */}
              <Title
                order={1}
                mb="md"
                style={{
                  textAlign: 'center',
                  fontSize: '2.5rem',
                  fontWeight: 800,
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.5px',
                }}
              >
                Fuel Price Analytics Dashboard
              </Title>

              {/* Subtitle with Data Source Attribution */}
              <Text
                size="sm"
                c="dimmed"
                style={{
                  textAlign: 'center',
                  fontSize: '0.95rem',
                }}
              >
                Data Source: National Data and Analytics Platform, NITI Aayog
              </Text>

              {/* Data Stats Summary */}
              <Text
                size="xs"
                c="dimmed"
                mt="xs"
                style={{
                  textAlign: 'center',
                  fontSize: '0.85rem',
                }}
              >
                📊 {data.length.toLocaleString()} records loaded | 
                🏙️ {filterOptions.cities.length} cities | 
                📅 {filterOptions.years.length} years
              </Text>
            </div>

            {/* ============================================================ */}
            {/* FILTER CONTROLS SECTION */}
            {/* ============================================================ */}
            
            <FilterControls
              options={filterOptions}   
              selectedCity={selectedCity}
              selectedFuelType={selectedFuelType}
              selectedYear={selectedYear}
              onCityChange={handleCityChange}
              onFuelTypeChange={handleFuelTypeChange}
              onYearChange={handleYearChange}
            />

            {/* ============================================================ */}
            {/* CHART SECTION */}
            {/* ============================================================ */}
            
            {/* Display chart if data is available, otherwise show empty state */}
            {chartData.length > 0 ? (
              <div style={{ marginTop: '1rem' }}>
                <FuelPriceChart
                  data={chartData}
                  city={selectedCity}
                  fuelType={selectedFuelType}
                  year={selectedYear}
                />
              </div>
            ) : (
              // Empty state when no data matches the selected filters
              <Paper
                p="xl"
                mt="xl"
                style={{
                  textAlign: 'center',
                  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
                  border: '2px dashed #8b95a5',
                  minHeight: '400px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                radius="md"
              >
                <Text
                  size="xl"
                  fw={600}
                  c="dimmed"
                  mb="md"
                  style={{
                    fontSize: '1.5rem',
                  }}
                >
                  📊 No Data Available
                </Text>
                <Text size="md" c="dimmed" mb="xs">
                  No records found for the selected filters:
                </Text>
                <Text size="sm" c="dimmed" fw={500}>
                  {selectedCity} • {selectedFuelType} • {selectedYear}
                </Text>
                <Text size="sm" c="dimmed" mt="md" style={{ maxWidth: '400px' }}>
                  Try selecting a different combination of city, fuel type, or year
                  to view the data.
                </Text>
              </Paper>
            )}

            {/* ============================================================ */}
            {/* FOOTER SECTION */}
            {/* ============================================================ */}
            
            <div
              style={{
                marginTop: '2rem',
                paddingTop: '1.5rem',
                borderTop: '1px solid #e9ecef',
                textAlign: 'center',
              }}
            >
              <Text size="xs" c="dimmed" mt="xs">
                © {new Date().getFullYear()} Fuel Price Analytics Dashboard
              </Text>
            </div>
          </Paper>
        </Container>
      </div>
    </MantineProvider>
  );
}

export default App;