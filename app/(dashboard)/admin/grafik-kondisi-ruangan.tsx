"use client"

import { createClient } from "@/utils/supabase/client";
import { PieChart } from "@mantine/charts";
import { useState, useEffect } from 'react';

const supabase = createClient();

async function fetchRuanganData() {
  try {

    const { data: kondisi_ruangan_view, error } = await supabase
      .from('kondisi_ruangan_view')
      .select('*')

    return kondisi_ruangan_view as any;
  } catch (error) {
    console.error('Error fetching ruangan data:', error);
    return [];
  }
}

export default function KondisiRuanganChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    async function loadData() {
      const fetchedData = await fetchRuanganData();
      setData(fetchedData);
      console.log(fetchedData);
    }
    loadData();
  }, []);

  const datas = data.map((item: any) => ({
    name: item.kondisi_ruangan,
    value: item.total_ruangan,
    color: item.kondisi_ruangan === 'baik' ? 'blue' : item.kondisi_ruangan === 'rusak' ? 'red' : 'yellow'
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
