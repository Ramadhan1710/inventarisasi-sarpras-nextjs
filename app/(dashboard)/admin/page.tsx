'use client'

import { Tabs, Title } from '@mantine/core';
import React from 'react';
import AdminCardNew from './admin-card-new';
import { Container, Grid, SimpleGrid, Skeleton, rem, Paper } from '@mantine/core';
import KondisiBarangChart from '@/app/(dashboard)/admin/grafik-kondisi-barang';
import BarangMasukPerTahun from '@/app/(dashboard)/admin/grafik-barang-masuk-pertahun';
import JumlahPengajuanPerminggu from '@/app/(dashboard)/admin/grafik-jumlah-pengajuan-perbulan';
import classes from './admin.module.css';
import KondisiRuanganChart from './grafik-kondisi-ruangan';

const PRIMARY_COL_HEIGHT = rem(500);

export default function AdminPage() {
  const SECONDARY_COL_HEIGHT = `calc(${PRIMARY_COL_HEIGHT} / 2 - var(--mantine-spacing-md) / 2)`;

  return (
    <div className='flex flex-col gap-6'>
      <AdminCardNew />
      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
        <div className={classes.piechart}>
          <span className={classes.title}>Grafik Barang Masuk Pertahun</span>
          <BarangMasukPerTahun />
        </div>
        <Grid gutter="md">
          <Grid.Col>
            <div className={classes.piechart}>
              <span className={classes.title}>Grafik Jumlah Pengajuan Sarpras Sebulan Terakhir</span>
              <JumlahPengajuanPerminggu />
            </div>
          </Grid.Col>
          <Grid.Col span={6}>
            <div className={classes.piechart}>
              <span className={classes.title}>Grafik Kondisi Barang</span>
              <div className='flex flex-row gap-4'>
                <KondisiBarangChart />
                <div className='flex flex-col gap-2 justify-center'>
                  <div className='flex gap-2 flex-row'>
                    <div className='w-2 rounded-full bg-blue-600'></div>
                    <span>Baik</span>
                  </div>
                  <div className='flex gap-2 flex-row'>
                    <div className='w-2 rounded-full bg-amber-400'></div>
                    <span>Hilang</span>
                  </div>
                  <div className='flex gap-2 flex-row'>
                    <div className='w-2 rounded-full bg-red-500'></div>
                    <span>Rusak</span>
                  </div>
                </div>
              </div>
            </div>
          </Grid.Col>
          <Grid.Col span={6}>
            <div className={classes.piechart}>
              <span className={classes.title}>Grafik Kondisi Ruangan</span>
              <div className='flex flex-row gap-4'>
                <KondisiRuanganChart />
                <div className='flex flex-col gap-2 justify-center'>
                  <div className='flex gap-2 flex-row'>
                    <div className='w-2 rounded-full bg-blue-600'></div>
                    <span>Baik</span>
                  </div>
                  <div className='flex gap-2 flex-row'>
                    <div className='w-2 rounded-full bg-red-500'></div>
                    <span>Rusak</span>
                  </div>
                </div>
              </div>
            </div>
          </Grid.Col>
        </Grid>
      </SimpleGrid>

      {/* <Grid>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Grid>
            <Grid.Col span={12}> 
              <h2 className='text-2xl font-bold'>Pengembalian Terbaru</h2>
            </Grid.Col>
            <Grid.Col span={12}>
              <div className="w-full rounded-md border-1 border overflow-x-auto">
                <Tabs defaultValue="first">
                  <Tabs.List grow justify="center">
                    <Tabs.Tab value="first">Pengembalian Barang</Tabs.Tab>
                    <Tabs.Tab value="second">Penyelesaian Ruangan</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="first">
                    <TablePengembalianBarang />
                  </Tabs.Panel>
                  <Tabs.Panel value="second">
                    <TablePenyelesaianRuangan />
                  </Tabs.Panel>
                </Tabs>
              </div>
            </Grid.Col>
          </Grid>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 6 }}>
          <Grid>
            <Grid.Col span={12}>
              <h2 className='text-2xl font-bold'>Peminjaman Terbaru</h2>
            </Grid.Col>
            <Grid.Col span={12}>
              <div className="w-full rounded-md border-1 border overflow-x-auto">
                <Tabs defaultValue="first">
                  <Tabs.List grow justify="center">
                    <Tabs.Tab value="first">Peminjaman Barang</Tabs.Tab>
                    <Tabs.Tab value="second">Peminjaman Ruangan</Tabs.Tab>
                  </Tabs.List>
                  <Tabs.Panel value="first">
                    <TabelPeminjamanBarang />
                  </Tabs.Panel>
                  <Tabs.Panel value="second">
                    <TabelPeminjamanRuangan />
                  </Tabs.Panel>
                </Tabs>
              </div>
            </Grid.Col>
          </Grid>
        </Grid.Col>
      </Grid> */}

    </div>
  );
}