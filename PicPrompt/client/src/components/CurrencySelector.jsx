import React from 'react';
import { useCurrency } from '../context/CurrencyContext';

const CurrencySelector = () => {
  const { currencies, selectedCurrency, setSelectedCurrency } = useCurrency();

  const handleChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  // Sort currencies alphabetically by country name
  const sortedCurrencies = Object.entries(currencies).sort((a, b) => {
    return a[1].country.localeCompare(b[1].country);
  });

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="currency-select" className="text-sm font-medium text-gray-700">
        Currency:
      </label>
      <select
        id="currency-select"
        value={selectedCurrency}
        onChange={handleChange}
        className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {sortedCurrencies.map(([code, currency]) => (
          <option key={code} value={code}>
            {currency.country} ({code}) - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CurrencySelector;