import { FuelPriceRecord, FilterOptions, ChartData } from '../types';

/**
 * Utility functions for processing fuel price data
 * All functions are optimized for time efficiency
 */

/**
 * Month order for correct chronological display in charts
 * Used to ensure months are displayed January to December
 */
const MONTH_ORDER = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/**
 * Extract unique filter options from the dataset
 * 
 * Algorithm:
 * - Uses Set data structure for O(1) insertion and automatic deduplication
 * - Single pass through all records
 * - Converts Sets to sorted arrays
 * 
 * Time Complexity: O(n) where n is the number of records
 * Space Complexity: O(k) where k is the number of unique values
 * 
 * @param data - Array of fuel price records
 * @returns FilterOptions containing unique cities, fuel types, and years
 */
export const extractFilterOptions = (data: FuelPriceRecord[]): FilterOptions => {
  const cities = new Set<string>();
  const fuelTypes = new Set<'Petrol' | 'Diesel'>();
  const years = new Set<number>();

  // Single pass through data to extract all unique values - O(n)
  data.forEach((record) => {
    cities.add(record.city);
    fuelTypes.add(record.fuelType);
    years.add(record.year);
  });

  return {
    cities: Array.from(cities).sort(), // Sort alphabetically
    fuelTypes: Array.from(fuelTypes).sort(), // Sort alphabetically
    years: Array.from(years).sort((a, b) => b - a), // Sort descending (most recent first)
  };
};

/**
 * Calculate monthly average RSP for selected filters
 * 
 * Algorithm:
 * 1. Filter data by city, fuel type, and year - O(n)
 * 2. Group records by month using Map - O(m) where m is filtered records
 * 3. Calculate average for each month - O(12) constant time
 * 4. Sort results by month order - O(12) constant time
 * 
 * Total Time Complexity: O(n + m) where n is total records, m is filtered records
 * Space Complexity: O(12) for maximum 12 months
 * 
 * @param data - Complete dataset of fuel price records
 * @param city - Selected city to filter by
 * @param fuelType - Selected fuel type (Petrol or Diesel)
 * @param year - Selected year to filter by
 * @returns Array of ChartData with monthly averages, sorted chronologically
 */
export const calculateMonthlyAverage = (
  data: FuelPriceRecord[],
  city: string,
  fuelType: 'Petrol' | 'Diesel',
  year: number
): ChartData[] => {
  // Step 1: Filter data for selected criteria - O(n)
  const filteredData = data.filter(
    (record) =>
      record.city === city &&
      record.fuelType === fuelType &&
      record.year === year
  );

  // If no data matches the filters, return empty array
  if (filteredData.length === 0) {
    return [];
  }

  // Step 2: Group by month and accumulate totals - O(m)
  // Using Map for O(1) lookups and updates
  const monthlyData = new Map<string, { total: number; count: number }>();

  filteredData.forEach((record) => {
    const existing = monthlyData.get(record.month) || { total: 0, count: 0 };
    monthlyData.set(record.month, {
      total: existing.total + record.rsp,
      count: existing.count + 1,
    });
  });

  // Step 3: Calculate averages and prepare chart data - O(12)
  const chartData: ChartData[] = [];

  // Iterate through months in chronological order
  MONTH_ORDER.forEach((month) => {
    const monthData = monthlyData.get(month);
    
    // Only include months that have data
    if (monthData) {
      const avgPrice = monthData.total / monthData.count;
      chartData.push({
        month,
        avgPrice: Number(avgPrice.toFixed(2)), // Round to 2 decimal places
      });
    }
  });

  return chartData;
};

/**
 * Get default filter values from available options
 * Used to initialize the filter dropdowns with sensible defaults
 * 
 * @param options - Available filter options extracted from data
 * @returns Object with default city, fuel type, and year
 */
export const getDefaultFilters = (options: FilterOptions) => ({
  city: options.cities[0] || '',
  fuelType: (options.fuelTypes[0] || 'Petrol') as 'Petrol' | 'Diesel',
  year: options.years[0] || new Date().getFullYear(),
});  