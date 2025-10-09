import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/Navbar';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'AI-Powered CRM',
  description:
    'Intelligent lead management with machine learning-powered scoring',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body className={inter.className}>
        <div className='min-h-screen bg-gray-50'>
          <Navbar />
          <main className='py-8 px-4 sm:px-6 lg:px-8'>{children}</main>
        </div>
      </body>
    </html>
  );
}
