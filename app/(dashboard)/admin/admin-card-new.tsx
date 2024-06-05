import { Group, Paper, SimpleGrid, Text } from '@mantine/core';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconBox,
  IconBuilding,
  IconWand,
  IconArrowBack,
  IconClipboardList,
} from '@tabler/icons-react';
import classes from './admin-card.module.css';
import React, { useState, useEffect } from 'react';
import barangService from '@/services/barang';
import ruanganService from '@/services/ruangan';
import { createClient } from '@/utils/supabase/client';

const supabase = createClient();

const icons = {
  barang: IconBox,
  ruang: IconBuilding,
  pengajuan: IconClipboardList,
};

export default function AdminCardNew() {
  const [jumlahBarang, setJumlahBarang] = useState(0);
  const [jumlahRuang, setJumlahRuang] = useState(0);
  const [barangLastWeek, setBarangLastWeek] = useState(0);
  const [ruangLastWeek, setRuangLastWeek] = useState(0);
  const [jumlahPengajuan, setJumlahPengajuan] = useState(0); // State untuk menyimpan jumlah pengajuan

  // Fetch jumlah pengajuan
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data, error } = await supabase.from('total_pengajuan').select('total_pengajuan'); // Ambil data dari supabase
        if (error) {
          throw error;
        }
        setJumlahPengajuan(data[0].total_pengajuan); // Set jumlah pengajuan dari data yang didapat
      } catch (error) {
        console.error('Error fetching jumlah pengajuan:', error);
      }
    };
    fetchData();

    // fetch jumlah barang

    const fetchBarang = async () => {
      try {
        const { data, error } = await supabase.from('total_quantity_barang')
          .select('*')
        if (error) {
          throw error;
        }
        setJumlahBarang(data[0].total_quantity_barang);
      } catch (error) {
        console.error('Error fetching barang:', error);
      }
    }
    fetchBarang();

    const fetchRuang = async () => {
      try {
        const data = await ruanganService.getDaftarRuangan();
        const jumlah = data!.length;
        setJumlahRuang(jumlah);
      } catch (error) {
        console.error('Error fetching ruang:', error);
      }
    };
    fetchRuang();

    const fetchBarangLastWeek = async () => {
      try {
        const data = await barangService.getBarangAddedLastWeek();
        const jumlah = data ? (data[0]?.jumlah_barang_added_last_week || 0) : 0;
        setBarangLastWeek(jumlah);
      } catch (error) {
        console.error('Error fetching barang added last week:', error);
      }
    };
    fetchBarangLastWeek();

    const fetchRuangLastWeek = async () => {
      try {
        const data = await ruanganService.getRuanganAddedLastWeek();
        const jumlah = data ? (data[0]?.jumlah_ruang_added_last_week || 0) : 0;
        setRuangLastWeek(jumlah);
      } catch (error) {
        console.error('Error fetching ruangan added last week:', error);
      }
    };
    fetchRuangLastWeek();
  }, []);

  const data = [
    { title: 'Barang', icon: 'barang', value: jumlahBarang },
    { title: 'Ruang', icon: 'ruang', value: jumlahRuang },
    { title: 'Pengajuan', icon: 'pengajuan', value: jumlahPengajuan }, // Gunakan state jumlahPengajuan
  ] as const;

  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];

    return (
      <Paper p="md" radius="md" key={stat.title} className={classes.card}>
        <Group justify="space-between">
          <Text size="xs" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" gap="xs" mt={50}>
          <Text className={classes.value}>{stat.value}</Text>
        </Group>
      </Paper>
    );
  });

  return (
    <div className={classes.root}>
      <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }}>{stats}</SimpleGrid>
    </div>
  );
}
