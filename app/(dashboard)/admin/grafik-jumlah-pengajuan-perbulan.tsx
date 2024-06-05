"use client"

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from 'react';
import { AreaChart, BarChart } from '@mantine/charts';

const supabase = createClient();

// Fungsi untuk mengambil jumlah pengajuan per minggu dari database Supabase
async function fetchJumlahPengajuanPerminggu() {
  try {
    const { data: pengajuan_per_minggu, error } = await supabase
      .from('pengajuan_per_minggu_with_month')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return pengajuan_per_minggu as any;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}

// Komponen utama untuk menampilkan jumlah pengajuan per minggu
export default function JumlahPengajuanPerminggu() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const fetchedData = await fetchJumlahPengajuanPerminggu();
      setData(fetchedData);
      console.log(fetchedData);
    }
    loadData();
  }, []);

  // Mapping data yang diambil agar sesuai dengan format yang diharapkan oleh BarChart
  const datas = data.map((item : any) => ({
    start_of_week: item.formatted_start_of_week.trim(),
    pengajuan: item.jumlah_pengajuan,
  }));

  console.log(datas);

  return (
    <AreaChart
      h={250}
      data={datas}
      dataKey="start_of_week"
      series={[{ name: 'pengajuan', color: 'indigo.6', label: 'Jumlah Pengajuan' }]}
      curveType="linear"
      connectNulls
    />
  );
}
