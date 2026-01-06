import { Metadata } from 'next';
import Hero from './ui-components/Hero';
import Navbar from './ui-components/NavbarPage';
import Features from './ui-components/Feature';
import HowItWorks from './ui-components/HowWork';
import CTAAndFooter from './ui-components/CTAFotter';

export const metadata: Metadata = {
  title: 'ApiLens - Free JSON API Visualizer & Inspector Tool',
  description: 'Beautiful online JSON viewer and API testing tool. Visualize APIs with interactive tree view, table view, and graph visualization. Free alternative to Postman.',
  alternates: {
    canonical: 'https://apilens.kaustubhp.in',
  },
};

export default function Home() {
  // JSON-LD Structured Data
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'ApiLens',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description: 'Free online JSON API visualizer and inspector tool with tree view, table view, and graph visualization.',
    url: 'https://apilens.kaustubhp.in',
    logo: 'https://apilens.kaustubhp.in/logo/api-lens.png',
    screenshot: 'https://apilens.kaustubhp.in/logo/api-lens.png',
    author: {
      '@type': 'Person',
      name: 'Kaustubh Patil',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: '1',
    },
    featureList: [
      'JSON Tree View',
      'Table View for Arrays',
      'Interactive Graph Visualization',
      'API Request Testing',
      'Custom JSON Input',
      'Export and Download',
      'Search Functionality',
      'Syntax Highlighting',
    ],
  };

  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <CTAAndFooter />
    </>
  );
}