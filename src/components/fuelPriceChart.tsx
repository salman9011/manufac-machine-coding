import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { ChartData } from '../types';

/**
 * Props for FuelPriceChart component
 */
interface FuelPriceChartProps {
  data: ChartData[];
  city: string;
  fuelType: string;
  year: number;
}

/**
 * FuelPriceChart Component
 * 
 * Renders an interactive bar chart using Apache ECharts
 * Displays monthly average Retail Selling Price (RSP) for selected filters
 * 
 * Features:
 * - Responsive design (adjusts to window resize)
 * - Interactive tooltips showing exact values
 * - Color-coded bars (red for Petrol, teal for Diesel)
 * - Value labels on top of bars
 * - Professional styling with axis labels
 */
export const FuelPriceChart: React.FC<FuelPriceChartProps> = ({
  data,
  city,
  fuelType,
  year,
}) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstanceRef = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart instance if it doesn't exist
    if (!chartInstanceRef.current) {
      chartInstanceRef.current = echarts.init(chartRef.current);
    }

    // Prepare data for the chart
    const months = data.map((item) => item.month);
    const prices = data.map((item) => item.avgPrice);

    // Configure chart options
    const option: echarts.EChartsOption = {
      // Chart title
      title: {
        text: `${fuelType} RSP in ${city} (${year})`,
        left: 'center',
        top: 20,
        textStyle: {
          fontSize: 20,
          fontWeight: 'bold',
          color: '#333',
        },
      },

      // Tooltip configuration (appears on hover)
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: (params: any) => {
          const param = params[0];
          return `<strong>${param.name}</strong><br/>Avg RSP: ₹${param.value.toFixed(2)}`;
        },
        backgroundColor: 'rgba(50, 50, 50, 0.9)',
        borderColor: '#777',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
        },
      },

      // X-axis configuration (Months)
      xAxis: {
        type: 'category',
        data: months,
        axisLabel: {
          rotate: 45,
          fontSize: 12,
          interval: 0, // Show all labels
        },
        name: 'Month',
        nameLocation: 'middle',
        nameGap: 60,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
      },

      // Y-axis configuration (Price in Rupees)
      yAxis: {
        type: 'value',
        name: 'Average RSP (₹)',
        nameLocation: 'middle',
        nameGap: 60,
        nameTextStyle: {
          fontSize: 14,
          fontWeight: 'bold',
        },
        axisLabel: {
          formatter: '₹{value}',
        },
      },

      // Series configuration (Bar chart data)
      series: [
        {
          name: 'Average RSP',
          type: 'bar',
          data: prices,
          itemStyle: {
            color: fuelType === 'Petrol' ? '#ff6b6b' : '#4ecdc4',
            borderRadius: [4, 4, 0, 0], // Rounded top corners
          },
          barWidth: '60%',
          label: {
            show: true,
            position: 'top',
            formatter: '₹{c}',
            fontSize: 11,
            fontWeight: 'bold',
          },
          emphasis: {
            itemStyle: {
              color: fuelType === 'Petrol' ? '#ff5252' : '#3dbfb8',
            },
          },
        },
      ],

      // Grid configuration (chart margins)
      grid: {
        left: '80px',
        right: '40px',
        bottom: '80px',
        top: '80px',
      },
    };

    // Apply configuration to chart
    chartInstanceRef.current.setOption(option, true);

    // Handle window resize to make chart responsive
    const handleResize = () => {
      chartInstanceRef.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    // Cleanup event listener on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [data, city, fuelType, year]);

  // Dispose chart instance on component unmount
  useEffect(() => {
    return () => {
      chartInstanceRef.current?.dispose();
      chartInstanceRef.current = null;
    };
  }, []);

  return (
    <div
      ref={chartRef}
      style={{
        width: '100%',
        height: '550px',
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        padding: '1rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    />
  );
};