# Fuel Price Analytics Dashboard

A TypeScript-based data visualization application for analyzing Retail Selling Prices (RSP) of Petrol and Diesel across metro cities in India.

## 🚀 Live Demo

[Deployment URL](https://manufac-machine-coding-git-main-salman9011s-projects.vercel.app/)
xx
## 📊 Features

- Interactive dropdowns to filter by:
  - Metro City (Mumbai, Delhi, Kolkata, Chennai)
  - Fuel Type (Petrol, Diesel)
  - Calendar Year
- Dynamic bar chart visualization showing monthly average RSP
- Responsive design with modern UI
- Efficient data processing with O(n) time complexity

## 🛠️ Tech Stack

- **TypeScript** - Type-safe development
- **React** - UI framework
- **Vite** - Build tool
- **Mantine** - UI component library
- **Apache ECharts** - Chart visualization
- **Yarn** - Package manager

## 📦 Installation
```bash
# Clone the repository
git clone https://github.com/salman9011/manufac-machine-coding.git

# Navigate to project directory
cd manufac-assignment

# Install dependencies
yarn install
```

## 🏃 Running the Application
```bash
# Start development server
yarn dev
```

The application will automatically open in your browser at `http://localhost:5173`

## 🏗️ Build for Production
```bash
# Create production build
yarn build

# Preview production build
yarn preview
```

## 📁 Project Structure
```
src/
├── components/          # React components
│   ├── FilterControls.tsx
│   └── FuelPriceChart.tsx
├── data/               # Dataset
│   └── fuel-prices.ts
├── types/              # TypeScript interfaces
│   └── index.ts
├── utils/              # Helper functions
│   └── dataProcessing.ts
├── App.tsx             # Main component
├── App.css
└── main.tsx            # Entry point
```

## 🧮 Data Processing

The application implements efficient algorithms for data processing:

- **Filter Extraction**: O(n) - Single pass through dataset
- **Monthly Average Calculation**: O(n) - Filtered data aggregation
- **Memoization**: Used for expensive computations

## 📸 Screenshot

![Dashboard Screenshot](./screenshot.png)

## 📝 Implementation Notes

- All missing cell values are treated as 0
- Data is processed using efficient time-complexity algorithms
- Code follows clean architecture with proper modularization
- TypeScript ensures type safety throughout the application
- No external helper libraries like Bootstrap, jQuery, or Lodash used

## 🚀 Deployment

The application is deployed on [Vercel](https://manufac-machine-coding-git-main-salman9011s-projects.vercel.app/).

## 👥 Author

Salman Maqbool

## 📄 License

This project was created as part of the Manufac Analytics Frontend Assignment.
