import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

export const useCurrency = () => {
  return useContext(CurrencyContext);
};

export const CurrencyProvider = ({ children }) => {
  // Available currencies with their symbols, names, and conversion rates (relative to INR)
  // Expanded list with more countries and currencies
  const currencies = {
    'INR': { symbol: '₹', name: 'Indian Rupee', country: 'India', rate: 1 },
    'USD': { symbol: '$', name: 'US Dollar', country: 'United States', rate: 0.012 },
    'EUR': { symbol: '€', name: 'Euro', country: 'European Union', rate: 0.011 },
    'GBP': { symbol: '£', name: 'British Pound', country: 'United Kingdom', rate: 0.0095 },
    'AUD': { symbol: 'A$', name: 'Australian Dollar', country: 'Australia', rate: 0.018 },
    'CAD': { symbol: 'C$', name: 'Canadian Dollar', country: 'Canada', rate: 0.016 },
    'SGD': { symbol: 'S$', name: 'Singapore Dollar', country: 'Singapore', rate: 0.016 },
    'JPY': { symbol: '¥', name: 'Japanese Yen', country: 'Japan', rate: 1.77 },
    'CNY': { symbol: '¥', name: 'Chinese Yuan', country: 'China', rate: 0.088 },
    'KRW': { symbol: '₩', name: 'South Korean Won', country: 'South Korea', rate: 16.7 },
    'HKD': { symbol: 'HK$', name: 'Hong Kong Dollar', country: 'Hong Kong', rate: 0.094 },
    'NZD': { symbol: 'NZ$', name: 'New Zealand Dollar', country: 'New Zealand', rate: 0.019 },
    'CHF': { symbol: 'CHF', name: 'Swiss Franc', country: 'Switzerland', rate: 0.011 },
    'SEK': { symbol: 'kr', name: 'Swedish Krona', country: 'Sweden', rate: 0.13 },
    'NOK': { symbol: 'kr', name: 'Norwegian Krone', country: 'Norway', rate: 0.13 },
    'MXN': { symbol: '$', name: 'Mexican Peso', country: 'Mexico', rate: 0.21 },
    'BRL': { symbol: 'R$', name: 'Brazilian Real', country: 'Brazil', rate: 0.067 },
    'ARS': { symbol: '$', name: 'Argentine Peso', country: 'Argentina', rate: 11.2 },
    'CLP': { symbol: '$', name: 'Chilean Peso', country: 'Chile', rate: 11.8 },
    'PEN': { symbol: 'S/', name: 'Peruvian Sol', country: 'Peru', rate: 0.045 },
    'COP': { symbol: '$', name: 'Colombian Peso', country: 'Colombia', rate: 47.5 },
    'UYU': { symbol: '$U', name: 'Uruguayan Peso', country: 'Uruguay', rate: 0.47 },
    'ZAR': { symbol: 'R', name: 'South African Rand', country: 'South Africa', rate: 0.23 },
    'AED': { symbol: 'د.إ', name: 'UAE Dirham', country: 'United Arab Emirates', rate: 0.044 },
    'SAR': { symbol: '﷼', name: 'Saudi Riyal', country: 'Saudi Arabia', rate: 0.045 },
    'QAR': { symbol: '﷼', name: 'Qatari Riyal', country: 'Qatar', rate: 0.044 },
    'KWD': { symbol: 'د.ك', name: 'Kuwaiti Dinar', country: 'Kuwait', rate: 0.0036 },
    'BHD': { symbol: '.د.ب', name: 'Bahraini Dinar', country: 'Bahrain', rate: 0.0045 },
    'OMR': { symbol: 'ر.ع.', name: 'Omani Rial', country: 'Oman', rate: 0.0046 },
    'JOD': { symbol: 'د.ا', name: 'Jordanian Dinar', country: 'Jordan', rate: 0.0085 },
    'EGP': { symbol: 'E£', name: 'Egyptian Pound', country: 'Egypt', rate: 0.37 },
    'TRY': { symbol: '₺', name: 'Turkish Lira', country: 'Turkey', rate: 0.40 },
    'RUB': { symbol: '₽', name: 'Russian Ruble', country: 'Russia', rate: 1.12 },
    'PLN': { symbol: 'zł', name: 'Polish Zloty', country: 'Poland', rate: 0.048 },
    'CZK': { symbol: 'Kč', name: 'Czech Koruna', country: 'Czech Republic', rate: 0.28 },
    'HUF': { symbol: 'Ft', name: 'Hungarian Forint', country: 'Hungary', rate: 4.4 },
    'ILS': { symbol: '₪', name: 'Israeli Shekel', country: 'Israel', rate: 0.045 },
    'DKK': { symbol: 'kr', name: 'Danish Krone', country: 'Denmark', rate: 0.083 },
    'THB': { symbol: '฿', name: 'Thai Baht', country: 'Thailand', rate: 0.43 },
    'IDR': { symbol: 'Rp', name: 'Indonesian Rupiah', country: 'Indonesia', rate: 194 },
    'MYR': { symbol: 'RM', name: 'Malaysian Ringgit', country: 'Malaysia', rate: 0.055 },
    'PHP': { symbol: '₱', name: 'Philippine Peso', country: 'Philippines', rate: 0.68 },
    'VND': { symbol: '₫', name: 'Vietnamese Dong', country: 'Vietnam', rate: 295 },
    'BDT': { symbol: '৳', name: 'Bangladeshi Taka', country: 'Bangladesh', rate: 1.32 },
    'PKR': { symbol: '₨', name: 'Pakistani Rupee', country: 'Pakistan', rate: 3.3 },
    'LKR': { symbol: '₨', name: 'Sri Lankan Rupee', country: 'Sri Lanka', rate: 3.6 },
    'NPR': { symbol: '₨', name: 'Nepalese Rupee', country: 'Nepal', rate: 1.6 },
    'MMK': { symbol: 'Ks', name: 'Myanmar Kyat', country: 'Myanmar', rate: 25.0 },
    'KES': { symbol: 'KSh', name: 'Kenyan Shilling', country: 'Kenya', rate: 1.6 },
    'NGN': { symbol: '₦', name: 'Nigerian Naira', country: 'Nigeria', rate: 18.0 },
    'GHS': { symbol: 'GH₵', name: 'Ghanaian Cedi', country: 'Ghana', rate: 0.14 },
    'TZS': { symbol: 'TSh', name: 'Tanzanian Shilling', country: 'Tanzania', rate: 30.0 },
    'UGX': { symbol: 'USh', name: 'Ugandan Shilling', country: 'Uganda', rate: 45.0 },
    'RWF': { symbol: 'FRw', name: 'Rwandan Franc', country: 'Rwanda', rate: 15.0 },
    'MAD': { symbol: 'د.م.', name: 'Moroccan Dirham', country: 'Morocco', rate: 0.12 },
    'TND': { symbol: 'د.ت', name: 'Tunisian Dinar', country: 'Tunisia', rate: 0.037 },
    'DZD': { symbol: 'د.ج', name: 'Algerian Dinar', country: 'Algeria', rate: 1.6 },
    'XOF': { symbol: 'CFA', name: 'West African CFA Franc', country: 'West Africa', rate: 7.2 },
    'CDF': { symbol: 'FC', name: 'Congolese Franc', country: 'Democratic Republic of the Congo', rate: 32.0 },
    'BWP': { symbol: 'P', name: 'Botswana Pula', country: 'Botswana', rate: 0.16 },
    'ZMW': { symbol: 'ZK', name: 'Zambian Kwacha', country: 'Zambia', rate: 0.33 },
    'AOA': { symbol: 'Kz', name: 'Angolan Kwanza', country: 'Angola', rate: 1.0 },
    'MZN': { symbol: 'MT', name: 'Mozambican Metical', country: 'Mozambique', rate: 0.77 },
    'ETB': { symbol: 'Br', name: 'Ethiopian Birr', country: 'Ethiopia', rate: 0.68 },
    'GMD': { symbol: 'D', name: 'Gambian Dalasi', country: 'Gambia', rate: 0.78 },
    'MWK': { symbol: 'MK', name: 'Malawian Kwacha', country: 'Malawi', rate: 13.0 },
    'BIF': { symbol: 'FBu', name: 'Burundian Franc', country: 'Burundi', rate: 34.0 },
    'SLL': { symbol: 'Le', name: 'Sierra Leonean Leone', country: 'Sierra Leone', rate: 300 },
    'DJF': { symbol: 'Fdj', name: 'Djiboutian Franc', country: 'Djibouti', rate: 2.1 },
    'SOS': { symbol: 'Sh', name: 'Somali Shilling', country: 'Somalia', rate: 6.7 },
    'XAF': { symbol: 'FCFA', name: 'Central African CFA Franc', country: 'Central Africa', rate: 7.2 },
    'KMF': { symbol: 'CF', name: 'Comorian Franc', country: 'Comoros', rate: 5.4 },
    'SCR': { symbol: '₨', name: 'Seychellois Rupee', country: 'Seychelles', rate: 0.16 },
    'MUR': { symbol: '₨', name: 'Mauritian Rupee', country: 'Mauritius', rate: 0.54 },
    'MGA': { symbol: 'Ar', name: 'Malagasy Ariary', country: 'Madagascar', rate: 54.0 },
    'CVE': { symbol: 'Esc', name: 'Cape Verdean Escudo', country: 'Cape Verde', rate: 1.2 },
    'STN': { symbol: 'Db', name: 'São Tomé and Príncipe Dobra', country: 'São Tomé and Príncipe', rate: 0.27 },
    'ERN': { symbol: 'Nfk', name: 'Eritrean Nakfa', country: 'Eritrea', rate: 0.18 },
    'SVC': { symbol: '₡', name: 'Salvadoran Colón', country: 'El Salvador', rate: 1.05 },
    'HNL': { symbol: 'L', name: 'Honduran Lempira', country: 'Honduras', rate: 0.29 },
    'NIO': { symbol: 'C$', name: 'Nicaraguan Córdoba', country: 'Nicaragua', rate: 0.44 },
    'CRC': { symbol: '₡', name: 'Costa Rican Colón', country: 'Costa Rica', rate: 6.2 },
    'PAB': { symbol: 'B/.', name: 'Panamanian Balboa', country: 'Panama', rate: 0.012 },
    'GTQ': { symbol: 'Q', name: 'Guatemalan Quetzal', country: 'Guatemala', rate: 0.092 },
    'CUP': { symbol: '$MN', name: 'Cuban Peso', country: 'Cuba', rate: 0.29 },
    'DOP': { symbol: 'RD$', name: 'Dominican Peso', country: 'Dominican Republic', rate: 0.67 },
    'JMD': { symbol: 'J$', name: 'Jamaican Dollar', country: 'Jamaica', rate: 1.8 },
    'TTD': { symbol: 'TT$', name: 'Trinidad and Tobago Dollar', country: 'Trinidad and Tobago', rate: 0.082 },
    'BBD': { symbol: 'Bds$', name: 'Barbadian Dollar', country: 'Barbados', rate: 0.024 },
    'BZD': { symbol: 'BZ$', name: 'Belize Dollar', country: 'Belize', rate: 0.024 },
    'BSD': { symbol: 'B$', name: 'Bahamian Dollar', country: 'Bahamas', rate: 0.012 },
    'FJD': { symbol: 'FJ$', name: 'Fijian Dollar', country: 'Fiji', rate: 0.027 },
    'PGK': { symbol: 'K', name: 'Papua New Guinean Kina', country: 'Papua New Guinea', rate: 0.044 },
    'WST': { symbol: 'WS$', name: 'Samoan Tala', country: 'Samoa', rate: 0.033 },
    'TOP': { symbol: 'T$', name: 'Tongan Paʻanga', country: 'Tonga', rate: 0.028 },
    'VUV': { symbol: 'VT', name: 'Vanuatu Vatu', country: 'Vanuatu', rate: 1.4 },
    'KHR': { symbol: '៛', name: 'Cambodian Riel', country: 'Cambodia', rate: 49.0 },
    'LAK': { symbol: '₭', name: 'Lao Kip', country: 'Laos', rate: 250 },
    'MNT': { symbol: '₮', name: 'Mongolian Tögrög', country: 'Mongolia', rate: 42.0 },
    'KZT': { symbol: '₸', name: 'Kazakhstani Tenge', country: 'Kazakhstan', rate: 5.5 },
    'UZS': { symbol: 'so\'m', name: 'Uzbekistani Som', country: 'Uzbekistan', rate: 150 },
    'TJS': { symbol: 'SM', name: 'Tajikistani Somoni', country: 'Tajikistan', rate: 0.13 },
    'AFN': { symbol: '؋', name: 'Afghan Afghani', country: 'Afghanistan', rate: 0.84 },
    'AMD': { symbol: '֏', name: 'Armenian Dram', country: 'Armenia', rate: 4.6 },
    'AZN': { symbol: '₼', name: 'Azerbaijani Manat', country: 'Azerbaijan', rate: 0.021 },
    'BYN': { symbol: 'Br', name: 'Belarusian Ruble', country: 'Belarus', rate: 0.031 },
    'BGN': { symbol: 'лв', name: 'Bulgarian Lev', country: 'Bulgaria', rate: 0.022 },
    'GEL': { symbol: '₾', name: 'Georgian Lari', country: 'Georgia', rate: 0.032 },
    'MDL': { symbol: 'L', name: 'Moldovan Leu', country: 'Moldova', rate: 0.22 },
    'RON': { symbol: 'lei', name: 'Romanian Leu', country: 'Romania', rate: 0.054 },
    'UAH': { symbol: '₴', name: 'Ukrainian Hryvnia', country: 'Ukraine', rate: 0.46 },
    'BAM': { symbol: 'KM', name: 'Bosnia and Herzegovina Convertible Mark', country: 'Bosnia and Herzegovina', rate: 0.022 },
    'MKD': { symbol: 'ден', name: 'Macedonian Denar', country: 'North Macedonia', rate: 0.67 },
    'RSD': { symbol: 'дин', name: 'Serbian Dinar', country: 'Serbia', rate: 1.3 },
    'HRK': { symbol: 'kn', name: 'Croatian Kuna', country: 'Croatia', rate: 0.085 },
    'ALL': { symbol: 'L', name: 'Albanian Lek', country: 'Albania', rate: 1.2 },
    'ISK': { symbol: 'kr', name: 'Icelandic Króna', country: 'Iceland', rate: 1.6 },
    'BND': { symbol: 'B$', name: 'Brunei Dollar', country: 'Brunei', rate: 0.016 },
    'FKP': { symbol: '£', name: 'Falkland Islands Pound', country: 'Falkland Islands', rate: 0.010 },
    'GIP': { symbol: '£', name: 'Gibraltar Pound', country: 'Gibraltar', rate: 0.010 },
    'GGP': { symbol: '£', name: 'Guernsey Pound', country: 'Guernsey', rate: 0.010 },
    'JEP': { symbol: '£', name: 'Jersey Pound', country: 'Jersey', rate: 0.010 },
    'IMP': { symbol: '£', name: 'Manx Pound', country: 'Isle of Man', rate: 0.010 },
    'SYP': { symbol: '£S', name: 'Syrian Pound', country: 'Syria', rate: 300 },
    'LBP': { symbol: 'L£', name: 'Lebanese Pound', country: 'Lebanon', rate: 1800 },
    'IQD': { symbol: 'ع.د', name: 'Iraqi Dinar', country: 'Iraq', rate: 15 },
    'IRR': { symbol: '﷼', name: 'Iranian Rial', country: 'Iran', rate: 500 },
    'YER': { symbol: '﷼', name: 'Yemeni Rial', country: 'Yemen', rate: 3 },
    'MRO': { symbol: 'UM', name: 'Mauritanian Ouguiya', country: 'Mauritania', rate: 0.43 },
    'MVR': { symbol: 'Rf', name: 'Maldivian Rufiyaa', country: 'Maldives', rate: 0.18 },
    'BTN': { symbol: 'Nu.', name: 'Bhutanese Ngultrum', country: 'Bhutan', rate: 1.0 },
    'NAD': { symbol: 'N$', name: 'Namibian Dollar', country: 'Namibia', rate: 0.23 },
    'SZL': { symbol: 'E', name: 'Swazi Lilangeni', country: 'Eswatini', rate: 0.23 },
    'LSL': { symbol: 'L', name: 'Lesotho Loti', country: 'Lesotho', rate: 0.23 },
    'LRD': { symbol: '$', name: 'Liberian Dollar', country: 'Liberia', rate: 2.2 },
    'GNF': { symbol: 'FG', name: 'Guinean Franc', country: 'Guinea', rate: 100 },
    'XPF': { symbol: '₣', name: 'CFP Franc', country: 'French Polynesia', rate: 1.3 },
    'XCD': { symbol: '$', name: 'East Caribbean Dollar', country: 'Eastern Caribbean', rate: 0.032 },
    'ANG': { symbol: 'ƒ', name: 'Netherlands Antillean Guilder', country: 'Curaçao', rate: 0.022 },
    'AWG': { symbol: 'ƒ', name: 'Aruban Florin', country: 'Aruba', rate: 0.022 },
    'KYD': { symbol: '$', name: 'Cayman Islands Dollar', country: 'Cayman Islands', rate: 0.010 },
    'BMD': { symbol: '$', name: 'Bermudian Dollar', country: 'Bermuda', rate: 0.012 },
    'SBD': { symbol: '$', name: 'Solomon Islands Dollar', country: 'Solomon Islands', rate: 0.10 },
    'TVD': { symbol: '$', name: 'Tuvaluan Dollar', country: 'Tuvalu', rate: 0.018 },
    'SH': { symbol: '£', name: 'Saint Helena Pound', country: 'Saint Helena', rate: 0.010 },
    'LYD': { symbol: 'ل.د', name: 'Libyan Dinar', country: 'Libya', rate: 0.058 },
    'SDG': { symbol: 'ج.س.', name: 'Sudanese Pound', country: 'Sudan', rate: 6.8 },
    'SSP': { symbol: '£', name: 'South Sudanese Pound', country: 'South Sudan', rate: 18 },
    'MRU': { symbol: 'UM', name: 'Mauritanian Ouguiya', country: 'Mauritania', rate: 0.43 }
  };

  const [selectedCurrency, setSelectedCurrency] = useState('INR');
  
  // Load saved currency from localStorage on initial render
  useEffect(() => {
    const savedCurrency = localStorage.getItem('selectedCurrency');
    if (savedCurrency && currencies[savedCurrency]) {
      setSelectedCurrency(savedCurrency);
    }
  }, []);

  // Save currency to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedCurrency', selectedCurrency);
  }, [selectedCurrency]);

  const convertPrice = (priceInINR) => {
    const rate = currencies[selectedCurrency].rate;
    return (priceInINR * rate).toFixed(2);
  };

  const getCurrencySymbol = () => {
    return currencies[selectedCurrency].symbol;
  };

  const getCurrencyName = () => {
    return currencies[selectedCurrency].name;
  };

  const getCurrencyCountry = () => {
    return currencies[selectedCurrency].country;
  };

  const value = {
    currencies,
    selectedCurrency,
    setSelectedCurrency,
    convertPrice,
    getCurrencySymbol,
    getCurrencyName,
    getCurrencyCountry
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};