'use client';

import { useState } from 'react';
import LeadForm from '@/components/LeadForm';
import LeadList from '@/components/LeadList';
import LeadManagementButtons from '@/components/LeadManagementButtons';

export default function LeadsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLeadAdded = () => {
    // Trigger refresh by changing key
    setRefreshKey((prev) => prev + 1);
  };

  const handleRefresh = () => {
    // Trigger refresh by changing key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className='max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-4xl font-bold text-gray-900'>Lead Management</h1>
        <LeadManagementButtons onRefresh={handleRefresh} />
      </div>

      <div className='grid lg:grid-cols-3 gap-8'>
        <div className='lg:col-span-1'>
          <LeadForm onSuccess={handleLeadAdded} />
        </div>

        <div className='lg:col-span-2'>
          <LeadList key={refreshKey} />
        </div>
      </div>
    </div>
  );
}
