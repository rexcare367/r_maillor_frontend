# Country Flag System

This document describes the global country flag system implemented for the Meillor application.

## Overview

The country flag system provides a centralized way to display country flags throughout the application using the `country-flag-icons` package.

## Files Structure

```
lib/utils/countryFlags.ts     # Utility functions and country mapping
components/CountryFlag.tsx     # Reusable CountryFlag component
components/ui/index.ts         # Export the component globally
```

## Usage

### 1. Using the CountryFlag Component

```tsx
import { CountryFlag } from "@/components/ui"

// Basic usage
<CountryFlag country="France" />

// With custom size
<CountryFlag country="Switzerland" size="lg" />

// With custom styling
<CountryFlag 
  country="Germany" 
  size="md" 
  className="border border-gray-300" 
/>

// With custom fallback
<CountryFlag 
  country="Unknown Country" 
  fallback={<span>🌍</span>} 
/>
```

### 2. Using Utility Functions

```tsx
import { getCountryCode, getCountryFlagUrl, hasCountryFlag } from "@/lib/utils/countryFlags"

// Get ISO code
const code = getCountryCode("France") // Returns "FR"

// Get flag URL
const url = getCountryFlagUrl("Switzerland") // Returns "https://purecatamphetamine.github.io/country-flag-icons/3x2/CH.svg"

// Check if flag exists
const exists = hasCountryFlag("Germany") // Returns true
```

## Component Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `country` | `string` | - | Country name in any supported language |
| `className` | `string` | `""` | Additional CSS classes |
| `alt` | `string` | Auto-generated | Alt text for the image |
| `title` | `string` | Auto-generated | Title attribute |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | Size preset |
| `showFallback` | `boolean` | `true` | Show fallback for unknown countries |
| `fallback` | `React.ReactNode` | `🏳️` | Custom fallback content |

## Size Presets

| Size | Dimensions | Use Case |
|------|------------|----------|
| `xs` | 12x8px | Small badges, inline text |
| `sm` | 16x12px | Default size, most use cases |
| `md` | 24x16px | Medium displays |
| `lg` | 32x24px | Cards, prominent displays |
| `xl` | 40x24px | Large displays, headers |

## Supported Countries

The system supports both French and English country names:

### European Countries
- France, Suisse/Switzerland, Allemagne/Germany
- Italie/Italy, Espagne/Spain, Royaume-Uni/United Kingdom
- Belgique/Belgium, Pays-Bas/Netherlands, Autriche/Austria
- Portugal, Luxembourg, Monaco, Andorre/Andorra

### Asian Countries
- Chine/China, Japon/Japan, Taiwan, Hong Kong, Macau
- Singapour/Singapore, Indonesia, Malaysia, Philippines

### Other Regions
- Canada, Australie/Australia, Nouvelle-Zélande/New Zealand
- Brésil/Brazil, Argentine/Argentina, Mexique/Mexico
- Russie/Russia, Inde/India, Corée du Sud/South Korea
- And many more...

## Adding New Countries

To add support for new countries, update the `COUNTRY_MAP` in `lib/utils/countryFlags.ts`:

```typescript
export const COUNTRY_MAP: { [key: string]: string } = {
  // ... existing countries
  'new-country': 'NC',
  'nouveau-pays': 'NC', // French name
}
```

## Examples in Different Contexts

### In a Card Component
```tsx
<Card>
  <div className="flex items-center gap-2">
    <CountryFlag country={coin.origin_country} size="lg" />
    <span>{coin.origin_country}</span>
  </div>
</Card>
```

### In a Table
```tsx
<td className="flex items-center gap-2">
  <CountryFlag country={item.country} size="sm" />
  <span>{item.country}</span>
</td>
```

### In a Badge
```tsx
<Badge className="flex items-center gap-1">
  <CountryFlag country={country} size="xs" />
  <span>{country}</span>
</Badge>
```

## Performance Notes

- Flag images are loaded from CDN (country-flag-icons)
- Images are cached by the browser
- Fallback emoji is used for unknown countries
- No additional bundle size impact (images loaded on demand)

## Accessibility

- All flag images include proper `alt` and `title` attributes
- Fallback content is provided for screen readers
- Images have appropriate sizing for different contexts
