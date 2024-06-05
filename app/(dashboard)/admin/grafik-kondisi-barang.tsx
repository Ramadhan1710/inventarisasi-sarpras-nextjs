"use client"

import { createClient } from "@/utils/supabase/client";
import { PieChart } from "@mantine/charts";
import { useState, useEffect } from 'react';

const supabase = createClient();

async function fetchBarangData() {
  try {
    const { data: kondisi_barang_view, error } = await supabase
      .from('kondisi_barang_view')
      .select('*')
    return kondisi_barang_view as any;
  } catch (error) {
    console.error('Error fetching barang data:', error);
    return [];
  }
}

export default function  KondisiBarangChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const fetchedData = await fetchBarangData();
      setData(fetchedData);
      console.log(fetchedData);
    }
    loadData();
  }, []);

  const datas = data.map((item: any) => ({
    name: item.kondisi_barang,
    value: item.total_barang,
    color: item.kondisi_barang === 'baik' ? 'blue' : item.kondisi_barang === 'rusak' ? 'red' : 'yellow'
  }));

  console.log("ini datas", datas);
  return (
    <PieChart
      data={datas}
      withTooltip
      size={170}
      tooltipDataSource="segment"
      withLabelsLine labelsPosition="inside" labelsType="value" withLabels
    />
  );
}
