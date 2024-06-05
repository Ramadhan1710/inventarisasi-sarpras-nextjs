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
import ruanganService, { kondisiRuangan, ruangan } from '@/services/ruangan';

const TabelRuanganAdmin = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  const columns = useMemo<MRT_ColumnDef<ruangan>[]>(
    () => [
      {
        accessorKey: 'nama',
        header: 'Nama Ruangan',
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
        accessorKey: 'kondisi_ruangan',
        header: 'Kondisi',
        editVariant: 'select',
        mantineEditSelectProps: {
          data: Object.values(kondisiRuangan),
          required: true,
          error: validationErrors?.kondisi_ruangan,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              kondisi_ruangan: undefined,
            }),
        },
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
        mantineEditTextInputProps: {
          type: 'date',
          required: true,
          error: validationErrors?.tahun_masuk,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              tahun_masuk: undefined,
            }),
        },
      },
    ],
    [validationErrors],
  );

  const { mutateAsync: createRuangan } = useCreateRuangan();
  const {
    data: fetchedRuangan = [],
    isError: isLoadingRuanganError,
    isFetching: isFetchingRuangan,
    isLoading: isLoadingRuangan,
  } = useGetRuangan();
  const { mutateAsync: updateRuangan } = useUpdateRuangan();
  const { mutateAsync: deleteRuangan } = useDeleteRuangan();

  const handleCreateRuangan: MRT_TableOptions<ruangan>['onCreatingRowSave'] = async ({ values, exitCreatingMode }) => {
    const newValidationErrors = validateRuangan(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    try {
      await createRuangan(values);
      exitCreatingMode();
    } catch (error) {
      console.error("Error creating ruangan:", error);
    }
  };

  const handleSaveRuangan: MRT_TableOptions<ruangan>['onEditingRowSave'] = async ({ values, table }) => {
    try {
      const newValidationErrors = validateRuangan(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      const editingRow = table.getState().editingRow;
      const id = editingRow?.original.id;
      if (!id) {
        throw new Error('ID is required to update ruangan');
      }
      await updateRuangan({ ...values, id });
      table.setEditingRow(null);
    } catch (error) {
      console.error("Error saving ruangan:", error);
    }
  };

  const openDeleteConfirmModal = (row: MRT_Row<ruangan>) => {
    const ruanganId = row.original.id;
    console.log('Deleting ruanganId:', ruanganId);
    modals.openConfirmModal({
      title: 'Are you sure you want to delete this room?',
      children: (
        <Text>
          Are you sure you want to delete {row.original.nama}? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deleteRuangan(ruanganId),
    });
  };

  const table = useMantineReactTable({
    columns,
    data: fetchedRuangan,
    createDisplayMode: 'modal',
    editDisplayMode: 'modal',
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingRuanganError
      ? {
        color: 'red',
        children: 'Error loading data',
      }
      : undefined,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreateRuangan,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSaveRuangan,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Create New Room</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
    ),
    renderEditRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Edit Room</Title>
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
      <Button onClick={() => table.setCreatingRow(true)}>Create New Room</Button>
    ),
    state: {
      isLoading: isLoadingRuangan,
      showAlertBanner: isLoadingRuanganError,
      showProgressBars: isFetchingRuangan,
    },
  });

  return <MantineReactTable table={table} />;
};

function useCreateRuangan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ruangan: ruangan) => {
      console.log('Creating ruangan:', ruangan);
      await ruanganService.addRuangan(ruangan);
    },
    onMutate: async (newRuanganInfo: ruangan) => {
      await queryClient.cancelQueries({ queryKey: ['ruangan'] });

      const previousRuangan = queryClient.getQueryData<ruangan[]>(['ruangan']) || [];

      queryClient.setQueryData(
        ['ruangan'],
        (prevRuangan: ruangan[] = []) => [
          ...prevRuangan,
          {
            ...newRuanganInfo,
            id: (Math.random() + 1).toString(36).substring(7),
          },
        ],
      );

      return { previousRuangan };
    },
    onError: (err, newRuangan, context) => {
      console.error('Error creating ruangan:', err);
      if (context?.previousRuangan) {
        queryClient.setQueryData(['ruangan'], context.previousRuangan);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ruangan'] });
    },
  });
}

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

function useUpdateRuangan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ruangan: ruangan) => {
      if (!ruangan.id) {
        throw new Error('ID is required to update ruangan');
      }
      await ruanganService.updateRuangan(ruangan, ruangan.id);
    },
    onMutate: (newRuanganInfo: ruangan) => {
      queryClient.setQueryData(
        ['ruangan'],
        (prevRuangan: any) =>
          prevRuangan?.map((prevRuanganItem: ruangan) =>
            prevRuanganItem.id === newRuanganInfo.id
              ? newRuanganInfo
              : prevRuanganItem,
          ),
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ruangan'] });
    },
  });
}

function useDeleteRuangan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (ruanganId: string) => {
      await ruanganService.deleteRuangan(ruanganId);
    },
    onMutate: async (ruanganId: string) => {
      await queryClient.cancelQueries({ queryKey: ['ruangan'] });

      const previousRuangan = queryClient.getQueryData<ruangan[]>(['ruangan']);

      queryClient.setQueryData(
        ['ruangan'],
        (prevRuangan: ruangan[] | undefined) =>
          prevRuangan ? prevRuangan.filter((ruangan) => ruangan.id !== ruanganId) : []
      );

      return { previousRuangan };
    },
    onError: (err, variables, context) => {
      if (context?.previousRuangan) {
        queryClient.setQueryData(['ruangan'], context.previousRuangan);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['ruangan'] });
    },
  });
}

const queryClient = new QueryClient();

const TabelRuanganAdminWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <TabelRuanganAdmin />
    </ModalsProvider>
  </QueryClientProvider>
);

export default TabelRuanganAdminWithProviders;

function validateRuangan(ruangan: ruangan) {
  return {
    nama: !validateRequired(ruangan.nama) ? 'Nama Ruangan is Required' : '',
    kondisi_ruangan: !validateRequired(ruangan.kondisi_ruangan) ? 'Kondisi Ruangan is Required' : '',
    tahun_masuk: !validateRequired(ruangan.tahun_masuk) ? 'Tahun Masuk is Required' : '',
  };
}

const validateRequired = (value: string | number) => !!value;
