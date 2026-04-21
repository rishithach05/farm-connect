import './globals.css';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export const metadata = {
  title: 'Farm Connect — Fresh Produce Direct From Farmers',
  description: 'India\'s most trusted farm-to-table marketplace. Buy fresh organic vegetables, fruits, dairy, and grains directly from verified local farmers. No middlemen, fair prices.',
  keywords: 'farm fresh, organic produce, farmers market, vegetables, fruits, dairy, direct from farm, India',
  authors: [{ name: 'Farm Connect Team' }],
  openGraph: {
    title: 'Farm Connect — Fresh Produce Direct From Farmers',
    description: 'Buy fresh vegetables, fruits, and dairy directly from local farmers.',
    type: 'website',
    locale: 'en_IN',
  },
  robots: 'index, follow',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      </head>
      <body>
        <Navbar />
        <main style={{ minHeight: '80vh' }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}

