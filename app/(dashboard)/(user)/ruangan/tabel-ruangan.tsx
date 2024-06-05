import { useMemo, useState } from 'react';
import {
  MRT_EditActionButtons,
  MantineReactTable,
  type MRT_ColumnDef,
  type MRT_Row,
  type MRT_TableOptions,
  useMantineReactTable,
} from 'mantine-react-table';
import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Stack,
  Text,
  Title,
  Tooltip,
} from '@mantine/core';
import { ModalsProvider, modals } from '@mantine/modals';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import {
  QueryClient,
  QueryClientProvider,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import ruanganService, { ruangan } from '@/services/ruangan';

const TabelRuanganUser = () => {
  const columns = useMemo<MRT_ColumnDef<ruangan>[]>(
    () => [
      {
        accessorKey: 'nama',
        header: 'Nama Ruangan',
      },
      {
        accessorKey: 'kondisi_ruangan',
        header: 'Kondisi',
        editVariant: 'select',
        // Add color coding for kondisi
        Cell: ({ cell }) => {
          const kondisi = cell.getValue() as string;
          const backgroundColor =
            kondisi === 'baik'
              ? '#40C057'
              : kondisi === 'rusak'
                ? '#FA5252'
                : '#228BE6';

          return (
            <Flex align="center">
              <div
                style={{
                  backgroundColor,
                  color: 'white',
                  padding: '5px',
                  width: '150px',
                  textAlign: 'center',
                }}
                className="rounded-md font-semibold"
              >
                {kondisi}
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
    data: fetchedRuangan = [],
    isError: isLoadingRuanganError,
    isFetching: isFetchingRuangan,
    isLoading: isLoadingRuangan,
  } = useGetRuangan();

  const table = useMantineReactTable({
    columns,
    data: fetchedRuangan,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingRuanganError
      ? {
        color: 'red',
        children: 'Error loading data',
      }
      : undefined,
    state: {
      isLoading: isLoadingRuangan,
      showAlertBanner: isLoadingRuanganError,
      showProgressBars: isFetchingRuangan,
    },
  });

  return <MantineReactTable table={table} />;
};

function useGetRuangan() {
  return useQuery<ruangan[]>({
    queryKey: ['ruangan'],
    queryFn: async () => {
      const data = await ruanganService.getDaftarRuangan();
      console.log('Fetched data:', data);
      return data as ruangan[];
    },
    refetchOnWindowFocus: false,
  });
}

const queryClient = new QueryClient();

const TabelRuanganUserWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <TabelRuanganUser />
    </ModalsProvider>
  </QueryClientProvider>
);

export default TabelRuanganUserWithProviders;