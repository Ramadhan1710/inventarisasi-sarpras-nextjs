"use client"

import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from 'react';
import { BarChart } from '@mantine/charts';

const supabase = createClient();

// function fetchBarangMasukPerTahun
async function fetchBarangMasukPerTahun() {
  try {

    const { data: barang_per_tahun_view, error } = await supabase
      .from('barang_per_tahun_view')
      .select('*')
    return barang_per_tahun_view as any;
  } catch (error) {
    console.error('Error fetching data:', error);
    return [];
  }
}


export default function BarangMasukPerTahun() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const fetchedData = await fetchBarangMasukPerTahun();
      setData(fetchedData);
      console.log(fetchedData);
    }
    loadData();
  }, []);

  const datas = data.map((item: any) => ({
    tahun: item.tahun_masuk,
    barang: item.total_barang,
  }));

  console.log("ini datas", datas);

  return (
    <BarChart
      h={500}
      data={datas}
      dataKey="tahun"
      series={[{ name: 'barang', color: 'blue' }]}
    />
  );
}