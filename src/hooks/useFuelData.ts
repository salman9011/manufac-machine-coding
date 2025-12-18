import { useState, useEffect } from 'react';
import Papa from 'papaparse';
import { FuelPriceRecord, RawCSVRow } from '../types';

/**
 * Custom React hook to load and parse CSV fuel price data
 *
 * This hook:
 * 1. Loads CSV file from public/data/fuel-prices.csv
 * 2. Parses CSV using PapaParse library
 * 3. Transforms raw CSV rows into structured FuelPriceRecord objects
 * 4. Handles loading and error states
 *
 * Time Complexity: O(n) where n is number of CSV rows
 * Space Complexity: O(n) to store all records
 *
 * @returns Object containing data array, loading state, and error state
 */
export const useFuelData = () => {
  const [data, setData] = useState<FuelPriceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Parse CSV data and transform to FuelPriceRecord format
     * Runs once on component mount
     */
    Papa.parse<RawCSVRow>('/public/data/fuel-prices.csv', {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('✅ CSV loaded successfully', results);
        console.log('📊 Total rows:', results.data.length);
        console.log('🔍 First 3 rows:', results.data.slice(0, 3));

        try {
          // Transform each CSV row to FuelPriceRecord - O(n)
          const processedData: FuelPriceRecord[] = results.data
            // Filter out rows that are clearly malformed
            .filter(
              (row) =>
                row['Calendar Day'] &&
                row['Metro Cities'] &&
                row['Products ']
            )
            .map((row) => {
              // Parse date from the "Calendar Day" column (e.g. 2025-06-20)
              const date = new Date(row['Calendar Day']);

              // Validate date
              if (isNaN(date.getTime())) {
                console.warn(`Invalid date: ${row['Calendar Day']}`);
                return null;
              }

              // Extract month name and year from date
              const month = date.toLocaleString('en-US', { month: 'long' });
              const year = date.getFullYear();

              // Parse RSP (Retail Selling Price) from the long column name
              const rspRaw =
                row[
                  'Retail Selling Price (Rsp) Of Petrol And Diesel (UOM:INR/L(IndianRupeesperLitre)), Scaling Factor:1'
                ];
              const rspValue = rspRaw?.toString().trim();
              const rsp =
                rspValue && !isNaN(parseFloat(rspValue))
                  ? parseFloat(rspValue)
                  : 0;

              return {
                city: row['Metro Cities'].trim(),
                fuelType: row['Products '].trim() as 'Petrol' | 'Diesel',
                year,
                month,
                date,
                rsp,
              };
            })
            // Remove any rows that failed validation above
            .filter((record): record is FuelPriceRecord => record !== null);

          console.log(`✅ Loaded ${processedData.length} fuel price records`);
          setData(processedData);
          setLoading(false);
        } catch (err) {
          console.error('❌ Error processing CSV data:', err);
          setError('Failed to process CSV data');
          setLoading(false);
        }
      },
      error: (err) => {
        console.error('❌ Error loading CSV:', err);
        setError(`Failed to load CSV file: ${err.message}`);
        setLoading(false);
      },
    });
  }, []);

  return { data, loading, error };
};