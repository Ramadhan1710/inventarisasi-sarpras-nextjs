'use client';

import React from 'react';
import TabelBarangAdmin from './tabel-barang';

export default function AdminBarangPage() {
  return (
    <div>
      <div className='text-3xl font-bold mb-4 h-20 border p-4 flex items-center rounded-sm'>
        <span className='text-background-secondary'>Daftar Barang</span>
      </div>
      <TabelBarangAdmin />
    </div>
  );
}