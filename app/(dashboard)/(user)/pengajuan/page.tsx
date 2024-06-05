'use client';

import React from 'react';
import TabelPengajuanUser from './tabel-pengajuan';

export default function UserPengajuanPage() {
  return (
    <div>
      <div className='text-3xl font-bold h-20 border p-4 flex items-center rounded-sm mb-4'>
        <h1 className='text-3xl font-sans font-semibold'>Daftar Pengajuan</h1>
      </div>
      <TabelPengajuanUser />
    </div>
  );
}