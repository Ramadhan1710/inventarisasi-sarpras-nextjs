'use client';

import React from 'react';
import TabelRuanganAdmin from './tabel-ruangan';

export default function AdminRuanganPage() {
  return (
    <div>
      <div className='text-3xl font-bold mb-4 h-20 border p-4 flex items-center rounded-sm'>
        <span className='text-background-secondary'>Daftar Ruangan</span>
      </div>
      <TabelRuanganAdmin />
    </div>
  );
}