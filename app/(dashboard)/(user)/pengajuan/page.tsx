'use client';

import React from 'react';
import TabelPengajuanUser from './tabel-pengajuan';

export default function UserPengajuanPage() {
  return (
    <div>
      <div className='text-3xl font-bold mb-4 h-20 border p-4 flex items-center rounded-sm'>
        <span className='text-background-secondary'>Daftar Pengajuan</span>
      </div>
      <TabelPengajuanUser />
    </div>
  );
}