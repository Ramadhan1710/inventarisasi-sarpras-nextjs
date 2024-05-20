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
import barangService, { Barang, KondisiBarang, StatusBarang } from '@/services/barang';

const TabelBarangAdmin = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  const columns = useMemo<MRT_ColumnDef<Barang>[]>(
    () => [
      {
        accessorKey: 'nama',
        header: 'Nama Barang',
        mantineEditTextInputProps: {
          required: true,
          error: validationErrors?.nama,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              nama: undefined,
            }),
        },
      },
      {
        accessorKey: 'stok',
        header: 'Stok',
        size: 80,
        mantineEditTextInputProps: {
          type: 'number',
          required: true,
          error: validationErrors?.stok,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              stok: undefined,
            }),
        },
      },
      {
        accessorKey: 'lokasi',
        header: 'Lokasi',
        mantineEditTextInputProps: {
          required: true,
          error: validationErrors?.lokasi,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              lokasi: undefined,
            }),
        },
      },
      {
        accessorKey: 'deskripsi',
        header: 'Deskripsi',
        mantineEditTextInputProps: {
          error: validationErrors?.deskripsi,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              deskripsi: undefined,
            }),
        },
      },
      {
        accessorKey: 'kondisi',
        header: 'Kondisi',
        editVariant: 'select',
        mantineEditSelectProps: {
          data: Object.values(KondisiBarang),
          required: true,
          error: validationErrors?.kondisi,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              kondisi: undefined,
            }),
        },
        //buat warna untuk kondisi
        Cell: ({ cell }) => {
          return (
            <Flex align="center">
              <div style={{
                backgroundColor:
                  cell.getValue() === 'baik'
                    ? '#40C057'
                    : cell.getValue() === 'perlu perbaikan'
                      ? '#FD7E14'
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
        accessorKey: 'status',
        header: 'Status',
        editVariant: 'select',
        mantineEditSelectProps: {
          data: Object.values(StatusBarang),
          required: true,
          error: validationErrors?.status,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              status: undefined,
            }),
        }
      },
    ],
    [validationErrors],
  );


  const { mutateAsync: createBarang } = useCreateBarang();
  const {
    data: fetchedBarang = [],
    isError: isLoadingBarangError,
    isFetching: isFetchingBarang,
    isLoading: isLoadingBarang,
  } = useGetBarang();
  const { mutateAsync: updateBarang } = useUpdateBarang();
  const { mutateAsync: deleteBarang } = useDeleteBarang();

  const handleCreateBarang: MRT_TableOptions<Barang>['onCreatingRowSave'] = async ({ values, exitCreatingMode }) => {
    const newValidationErrors = validateBarang(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    try {
      await createBarang(values);
      exitCreatingMode();
    } catch (error) {
      console.error("Error creating barang:", error); // Tambahkan logging di sini
    }
  };


  const handleSaveBarang: MRT_TableOptions<Barang>['onEditingRowSave'] = async ({ values, table }) => {
    try {
      const newValidationErrors = validateBarang(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      const editingRow = table.getState().editingRow;
      const id = editingRow?.original.id; // Pastikan mendapatkan id dari row yang sedang diedit
      if (!id) {
        throw new Error('ID is required to update barang');
      }
      await updateBarang({ ...values, id }); // Pastikan id ditambahkan di sini
      table.setEditingRow(null);
    } catch (error) {
      console.error("Error saving barang:", error);
    }
  };

  const openDeleteConfirmModal = (row: MRT_Row<Barang>) => {
    const barangId = row.original.id;
    console.log('Deleting barangId:', barangId); // Add this line to log the barangId
    modals.openConfirmModal({
      title: 'Are you sure you want to delete this item?',
      children: (
        <Text>
          Are you sure you want to delete {row.original.nama}? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteBarang(barangId),
    });
  };

  const table = useMantineReactTable({
    columns,
    data: fetchedBarang,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingBarangError
      ? {
        color: 'red',
        children: 'Error loading data',
      }
      : undefined,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateBarang,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveBarang,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Create New Item</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit Item</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderRowActions: ({ row, table }) => (
      <Flex gap="md">
        <Tooltip label="Edit">
          <ActionIcon color="#228BE6" onClick={() => table.setEditingRow(row)}>
            <IconEdit />
          </ActionIcon>
        </Tooltip>
        <Tooltip label="Delete">
          <ActionIcon color="red" onClick={() => openDeleteConfirmModal(row)}>
            <IconTrash />
          </ActionIcon>
        </Tooltip>
      </Flex>
    ),
    renderTopToolbarCustomActions: ({ table }) => (
      <Button onClick={() => table.setCreatingRow(true)}>Create New Item</Button>
    ),
    state: {
      isLoading: isLoadingBarang,
      showAlertBanner: isLoadingBarangError,
      showProgressBars: isFetchingBarang,
    },
  });


  return <MantineReactTable table={table} />;
};

function useCreateBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (barang: Barang) => {
      console.log('Creating barang:', barang); // Tambahkan logging di sini
      await barangService.addBarang(barang);
    },
    onMutate: async (newBarangInfo: Barang) => {
      await queryClient.cancelQueries({ queryKey: ['barang'] });

      const previousBarang = queryClient.getQueryData<Barang[]>(['barang']) || [];

      queryClient.setQueryData(
        ['barang'],
        (prevBarang: Barang[] = []) => [
          ...prevBarang,
          {
            ...newBarangInfo,
            id: (Math.random() + 1).toString(36).substring(7),
          },
        ],
      );

      return { previousBarang };
    },
    onError: (err, newBarang, context) => {
      console.error('Error creating barang:', err); // Tambahkan logging di sini
      if (context?.previousBarang) {
        queryClient.setQueryData(['barang'], context.previousBarang);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barang'] });
    },
  });
}

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


function useUpdateBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (barang: Barang) => {
      if (!barang.id) {
        throw new Error('ID is required to update barang');
      }
      await barangService.updateBarang(barang, barang.id);
    },
    onMutate: (newBarangInfo: Barang) => {
      queryClient.setQueryData(
        ['barang'],
        (prevBarang: any) =>
          prevBarang?.map((prevBarangItem: Barang) =>
            prevBarangItem.id === newBarangInfo.id
              ? newBarangInfo
              : prevBarangItem,
          ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['barang'] });
    },
  });
}



function useDeleteBarang() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (barangId: string) => {
      await barangService.deleteBarang(barangId);
    },
    onMutate: async (barangId: string) => {
      await queryClient.cancelQueries({ queryKey: ['barang'] });

      const previousBarang = queryClient.getQueryData<Barang[]>(['barang']);

      queryClient.setQueryData(
        ['barang'],
        (prevBarang: Barang[] | undefined) =>
          prevBarang ? prevBarang.filter((barang) => barang.id !== barangId) : []
      );

      return { previousBarang };
    },
    onError: (err, variables, context) => {
      if (context?.previousBarang) {
        queryClient.setQueryData(['barang'], context.previousBarang);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['barang'] });
    },
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

function validateBarang(barang: Barang) {
  return {
    nama: !validateRequired(barang.nama) ? 'Nama Barang is Required' : '',
    stok: !validateRequired(barang.stok) ? 'Stok is Required' : '',
    lokasi: !validateRequired(barang.lokasi) ? 'Lokasi is Required' : '',
    kondisi: !validateRequired(barang.kondisi) ? 'Kondisi is Required' : '',
    status: !validateRequired(barang.status) ? 'Status is Required' : '',
  };
}

const validateRequired = (value: string | number) => !!value;
