/**
 * Country flag utilities for global use across the application
 */

// Map country names to ISO codes
export const COUNTRY_MAP: { [key: string]: string } = {
  // European countries
  'france': 'FR',
  'suisse': 'CH',
  'switzerland': 'CH',
  'allemagne': 'DE',
  'germany': 'DE',
  'italie': 'IT',
  'italy': 'IT',
  'espagne': 'ES',
  'spain': 'ES',
  'royaume-uni': 'GB',
  'united kingdom': 'GB',
  'uk': 'GB',
  'etats-unis': 'US',
  'united states': 'US',
  'usa': 'US',
  'belgique': 'BE',
  'belgium': 'BE',
  'pays-bas': 'NL',
  'netherlands': 'NL',
  'autriche': 'AT',
  'austria': 'AT',
  'portugal': 'PT',
  'luxembourg': 'LU',
  'monaco': 'MC',
  'andorre': 'AD',
  'andorra': 'AD',
  
  // Asian countries
  'chine': 'CN',
  'china': 'CN',
  'japon': 'JP',
  'japan': 'JP',
  'taiwan': 'TW',
  'hong kong': 'HK',
  'macau': 'MO',
  'singapour': 'SG',
  'singapore': 'SG',
  'indonesia': 'ID',
  'malaysia': 'MY',
  'philippines': 'PH',
  
  // Add more countries as needed
  'canada': 'CA',
  'australie': 'AU',
  'australia': 'AU',
  'nouvelle-zelande': 'NZ',
  'new zealand': 'NZ',
  'bresil': 'BR',
  'brazil': 'BR',
  'argentine': 'AR',
  'argentina': 'AR',
  'mexique': 'MX',
  'mexico': 'MX',
  'russie': 'RU',
  'russia': 'RU',
  'inde': 'IN',
  'india': 'IN',
  'coree du sud': 'KR',
  'south korea': 'KR',
  'thailande': 'TH',
  'thailand': 'TH',
  'vietnam': 'VN',
  'turquie': 'TR',
  'turkey': 'TR',
  'egypte': 'EG',
  'egypt': 'EG',
  'afrique du sud': 'ZA',
  'south africa': 'ZA',
  'maroc': 'MA',
  'morocco': 'MA',
  'tunisie': 'TN',
  'tunisia': 'TN',
  'algerie': 'DZ',
  'algeria': 'DZ',
}

/**
 * Get ISO country code from country name
 * @param country - Country name in any supported language
 * @returns ISO country code or null if not found
 */
export const getCountryCode = (country: string): string | null => {
  if (!country) return null
  return COUNTRY_MAP[country.toLowerCase()] || null
}

/**
 * Get flag image URL for a country
 * @param country - Country name in any supported language
 * @returns Flag image URL or null if not found
 */
export const getCountryFlagUrl = (country: string): string | null => {
  const isoCode = getCountryCode(country)
  if (!isoCode) return null
  
  return `https://purecatamphetamine.github.io/country-flag-icons/3x2/${isoCode}.svg`
}

/**
 * Check if a country flag is available
 * @param country - Country name in any supported language
 * @returns True if flag is available, false otherwise
 */
export const hasCountryFlag = (country: string): boolean => {
  return getCountryCode(country) !== null
}
