'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className='border-b bg-card shadow-sm'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16'>
          <div className='flex items-center'>
            <div className='flex-shrink-0 flex items-center'>
              <Link
                href='/'
                className='text-2xl font-bold'
              >
                AI CRM
              </Link>
            </div>
            <div className='hidden sm:ml-6 sm:flex sm:items-center sm:space-x-2'>
              <Button
                variant={isActive('/') ? 'default' : 'ghost'}
                asChild
              >
                <Link href='/'>Home</Link>
              </Button>
              <Button
                variant={isActive('/leads') ? 'default' : 'ghost'}
                asChild
              >
                <Link href='/leads'>Leads</Link>
              </Button>
              <Button
                variant={isActive('/dashboard') ? 'default' : 'ghost'}
                asChild
              >
                <Link href='/dashboard'>Dashboard</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
