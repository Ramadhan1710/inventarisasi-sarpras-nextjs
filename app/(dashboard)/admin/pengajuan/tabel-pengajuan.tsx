import { useMemo, useState } from 'react';
import {
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
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import pengajuanService, { StatusPengajuan, Pengajuan } from '@/services/pengajuan';
import profileService from '@/services/user';

function useGetProfiles() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: async () =>{
      const data = await profileService.getListProfile();
      console.log("ini list profile", data);
      return data;
    }
  });
}

const TabelPengajuanAdmin = () => {
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  const { data: profiles = [] } = useGetProfiles();
  const { mutateAsync: updatePengajuan } = useUpdatePengajuan();
  const { mutateAsync: deletePengajuan } = useDeletePengajuan();
  const {
    data: fetchedPengajuan = [],
    isError: isLoadingPengajuanError,
    isFetching: isFetchingPengajuan,
    isLoading: isLoadingPengajuan,
  } = useGetPengajuan();

  const columns = useMemo<MRT_ColumnDef<Pengajuan>[]>(
    () => [
      {
        accessorKey: 'profile_id',
        header: 'Profile Name',
        enableEditing: false,
        Cell: ({ cell }) => {
          const profile = profiles.find(p => p.id === cell.getValue<string>());
          return profile ? profile.nama_lengkap : 'Unknown';
        },
        size: 150,
      },
      {
        accessorKey: 'jenis_inventaris',
        header: 'Jenis Inventaris',
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: 'nama_inventaris',
        header: 'Nama Inventaris',
        enableEditing: false,
        size: 150,
      },
      {
        accessorKey: 'keperluan',
        header: 'Keperluan',
        enableEditing: false,
        size: 200,
      },
      {
        accessorKey: 'deskripsi',
        header: 'Deskripsi',
        enableEditing: false,
        size: 250,
      },
      {
        accessorKey: 'status_pengajuan',
        header: 'Status Pengajuan',
        editVariant: 'select',
        mantineEditSelectProps: {
          data: Object.values(StatusPengajuan),
          required: true,
          error: validationErrors?.status_pengajuan,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              status_pengajuan: undefined,
            }),
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Tanggal Pengajuan',
        enableEditing: false,
        size: 200,
      },
    ],
    [profiles, validationErrors],
  );

  const handleSavePengajuan: MRT_TableOptions<Pengajuan>['onEditingRowSave'] = async ({ values, table }) => {
    try {
      const newValidationErrors = validatePengajuan(values);
      if (Object.values(newValidationErrors).some((error) => error)) {
        setValidationErrors(newValidationErrors);
        return;
      }
      setValidationErrors({});
      const editingRow = table.getState().editingRow;
      const id = editingRow?.original.id;
      if(!id){
        throw new Error('ID is required to update Pengajuan');
      }
      await updatePengajuan({...values, id});
      table.setEditingRow(null);
    } catch (error) {
      console.error("Error saving pengajuan:", error);
    }
  };

  const openDeleteConfirmModal = (row: MRT_Row<Pengajuan>) => {
    const pengajuanId = row.original.id;
    modals.openConfirmModal({
      title: 'Are you sure you want to delete this application?',
      children: (
        <Text>
          Are you sure you want to delete the application for {row.original.nama_inventaris}? This action cannot be undone.
        </Text>
      ),
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => deletePengajuan(pengajuanId),
    });
  };

  const handleExportRows = (rows: MRT_Row<Pengajuan>[]) => {
    const doc = new jsPDF();

    // Add the title
    const title = 'Daftar Pengajuan Inventaris';
    doc.setFontSize(18);
    doc.text(title, 14, 22); // Positioning the title

    // Add some spacing before the table
    const startY = 30;

    const tableHeaders = columns.map((c) => c.header);
    const tableData = rows.map((row) =>
      columns.map((column) => row.original[column.accessorKey as keyof Pengajuan])
    );

    autoTable(doc, {
      head: [tableHeaders],
      body: tableData,
      startY, // Start the table below the title
    });

    doc.save('pengajuan-data.pdf');
  };

  const table = useMantineReactTable({
    columns,
    data: fetchedPengajuan,
    editDisplayMode: 'row',
    enableEditing: true,
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingPengajuanError
      ? {
        color: 'red',
        children: 'Error loading data',
      }
      : undefined,
    onEditingRowCancel: () => setValidationErrors({}),
    onEditingRowSave: handleSavePengajuan,
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
      <Box
        style={{
          display: 'flex',
          gap: '16px',
          padding: '8px',
          flexWrap: 'wrap',
        }}
      >
        <Button
          disabled={table.getPrePaginationRowModel().rows.length === 0}
          //export all rows, including from the next page, (still respects filtering and sorting)
          onClick={() =>
            handleExportRows(table.getPrePaginationRowModel().rows)
          }
          variant="filled"
          color="red"
        >
          Unduh PDF
        </Button>
      </Box>

    ),
    state: {
      isLoading: isLoadingPengajuan,
      showAlertBanner: isLoadingPengajuanError,
      showProgressBars: isFetchingPengajuan,
    },
  });

  return <MantineReactTable table={table} />;
};

function useGetPengajuan() {
  return useQuery<Pengajuan[]>({
    queryKey: ['pengajuan'],
    queryFn: async () => {
      const data = await pengajuanService.getDaftarPengajuan();
      return data as Pengajuan[];
    },
    refetchOnWindowFocus: false,
  });
}

function useUpdatePengajuan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pengajuan: Pengajuan) => {
      await pengajuanService.updatePengajuan(pengajuan, pengajuan.id);
    },
    onMutate: async (updatedPengajuan: Pengajuan) => {
      await queryClient.cancelQueries({ queryKey: ['pengajuan'] });
      const previousPengajuan = queryClient.getQueryData<Pengajuan[]>(['pengajuan']) || [];
      queryClient.setQueryData(
        ['pengajuan'],
        previousPengajuan.map((pengajuan) =>
          pengajuan.id === updatedPengajuan.id ? updatedPengajuan : pengajuan,
        ),
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pengajuan'] });
    },
  });
}

function useDeletePengajuan() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pengajuanId: string) => {
      await pengajuanService.deletePengajuan({ id: pengajuanId });
    },
    onMutate: async (pengajuanId: string) => {
      await queryClient.cancelQueries({ queryKey: ['pengajuan'] });
      const previousPengajuan = queryClient.getQueryData<Pengajuan[]>(['pengajuan']) || [];
      queryClient.setQueryData(
        ['pengajuan'],
        previousPengajuan.filter((pengajuan) => pengajuan.id !== pengajuanId),
      );
      return { previousPengajuan };
    },
    onError: (err, pengajuanId, context) => {
      console.error("Error deleting pengajuan:", err);
      if (context?.previousPengajuan) {
        queryClient.setQueryData(['pengajuan'], context.previousPengajuan);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['pengajuan'] });
    },
  });
}

const queryClient = new QueryClient();

const ExampleWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <TabelPengajuanAdmin />
    </ModalsProvider>
  </QueryClientProvider>
);

export default ExampleWithProviders;

const validatePengajuan = (pengajuan: Pengajuan) => {
  return {
    status_pengajuan: !pengajuan.status_pengajuan ? 'Status is required' : '',
  };
};
