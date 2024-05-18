'use client'

import { Grid, rem } from '@mantine/core';
import React from 'react';
import AdminCard from './admin-card';
import { IconUser, IconPackage, IconBuilding } from '@tabler/icons-react';
import TabelPeminjamanBarang from './tabel-peminjaman-barang';
import TabelPeminjamanRuang from './tabel-peminjaman-ruang';

export default function AdminPage() {
  return (
    <div className='flex flex-col gap-6'>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <AdminCard
            title='User'
            subtitle='Jumlah 10'
            icon={<IconUser style={{ width: rem(50), height: rem(50) }} />}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <AdminCard
            title='Barang'
            subtitle='Jumlah 10'
            icon={<IconPackage style={{ width: rem(50), height: rem(50) }} />}
          />
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
          <AdminCard
            title='Ruang'
            subtitle='Jumlah 10'
            icon={<IconBuilding style={{ width: rem(50), height: rem(50) }} />}
          />
        </Grid.Col>
      </Grid>


      <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Grid>
            <Grid.Col span={12}>
              <h2 className='text-2xl font-bold'>Peminjaman Terbaru</h2>
            </Grid.Col>
            <Grid.Col span={12}>
              <div className="w-full rounded-md border-blue-400 border-2 overflow-x-auto">
                <TabelPeminjamanBarang />
              </div>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Grid>
            <Grid.Col span={12}>
              <h2 className='text-2xl font-bold'>Pengembalian Terbaru</h2>
            </Grid.Col>
            <Grid.Col span={12}>
              <div className="w-full h-96 border-blue-400 border-2 rounded-md overflow-x-auto">
                <TabelPeminjamanRuang />
              </div>
            </Grid.Col>
          </Grid>
        </Grid.Col>

      </Grid>

    </div>
  );
}