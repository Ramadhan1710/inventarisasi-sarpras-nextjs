import { useMemo, useState } from 'react';
import {
  MantineReactTable,
  type MRT_ColumnDef,
  useMantineReactTable,
} from 'mantine-react-table';
import {
  Flex,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import {
  QueryClient,
  QueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import barangService, { Barang, KondisiBarang } from '@/services/barang';

const TabelBarangAdmin = () => {
  const columns = useMemo<MRT_ColumnDef<Barang>[]>(
    () => [
      {
        accessorKey: 'nama',
        header: 'Nama Barang',
      },
      {
        accessorKey: 'kode_barang',
        header: 'Kode Barang',
      },
      {
        accessorKey: 'jumlah',
        header: 'Jumlah Barang',
        size: 80,
      },
      {
        accessorKey: 'lokasi',
        header: 'Lokasi',
      },
      {
        accessorKey: 'kondisi_barang',
        header: 'Kondisi Barang',
        Cell: ({ cell }) => {
          return (
            <Flex align="center">
              <div style={{
                backgroundColor:
                  cell.getValue() === 'baik'
                    ? '#40C057'
                    : cell.getValue() === 'rusak' ? '#FA5252' : cell.getValue() === 'tidak layak pakai' ? '#868E96' : '#228BE6',
                color: 'white',
                padding: '5px',
                width: '150px',
                textAlign: 'center',

              }} className='rounded-md font-semibold'>
                {cell.getValue() as string}
              </div>
            </Flex>
          );
        },

      },
      {
        accessorKey: 'tahun_masuk',
        header: 'Tahun Masuk',
      },
    ],
    [],
  );

  const {
    data: fetchedBarang = [],
    isError: isLoadingBarangError,
    isFetching: isFetchingBarang,
    isLoading: isLoadingBarang,
  } = useGetBarang();

  const table = useMantineReactTable({
    columns,
    data: fetchedBarang,
    getRowId: (row) => row.id,
    state: {
      isLoading: isLoadingBarang,
      showAlertBanner: isLoadingBarangError,
      showProgressBars: isFetchingBarang,
    },
  });

  return <MantineReactTable table={table} />;
};

function useGetBarang() {
  return useQuery<Barang[]>({
    queryKey: ['barang'],
    queryFn: async () => {
      const data = await barangService.getDaftarBarang();
      console.log('Fetched data:', data); // Log the fetched data
      return data as Barang[];
    },
    refetchOnWindowFocus: false,
  });
}

const queryClient = new QueryClient();

const TabelBarangAdminWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <TabelBarangAdmin />
    </ModalsProvider>
  </QueryClientProvider>
);

export default TabelBarangAdminWithProviders;
