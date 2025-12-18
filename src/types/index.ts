/**
 * Type definitions for the Fuel Price Analytics Dashboard
 */

/**
 * Raw CSV row structure from the dataset.
 * Keys MUST match the header row in `public/data/fuel-prices.csv` exactly.
 */
export interface RawCSVRow {
  Country: string;
  Year: string;
  Month: string;
  'Calendar Day': string;
  'Products ': string; // note the trailing space in the header name
  'Metro Cities': string;
  'Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1': string;
}

/**
 * Processed fuel price record, transformed from the raw CSV data.
 */
export interface FuelPriceRecord {
  city: string;
  fuelType: 'Petrol' | 'Diesel';
  year: number;
  month: string;
  date: Date;
  rsp: number; // Retail Selling Price
}

/**
 * Aggregated data for chart display (monthly average prices).
 */
export interface ChartData {
  month: string;
  avgPrice: number;
}

/**
 * Available filter options extracted from dataset
 * Used to populate dropdown selections
 */
export interface FilterOptions {
  cities: string[];
  fuelTypes: ('Petrol' | 'Diesel')[];
  years: number[];
}