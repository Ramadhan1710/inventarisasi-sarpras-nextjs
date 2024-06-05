import React, { useEffect, useMemo, useState } from 'react';
import { MRT_TableOptions, MantineReactTable, MRT_EditActionButtons, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { ModalsProvider } from '@mantine/modals';
import { ActionIcon, Box, Button, Flex, Stack, Text, Title, Tooltip } from '@mantine/core';
import { QueryClient, QueryClientProvider, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import pengajuanService, { StatusPengajuan, Pengajuan, JenisInventaris } from '@/services/pengajuan';
import { getProfile, getCurrentUser } from '@/utils/supabase/auth';

const TabelPengajuanUser = () => {
  const [profileId, setProfileId] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userData = await getCurrentUser();
      if (userData?.data.user?.id) {
        const { profile, error } = await getProfile(userData.data.user?.id);
        if (profile) {
          setProfileId(profile.id);
        }
        if (error) {
          console.log(error);
        }
      }
    }
    fetchUserProfile();
  }, []);

  const { mutateAsync: createPengajuan } = useCreatePengajuan(profileId);
  const {
    data: fetchedPengajuan = [],
    isError: isLoadingPengajuanError,
    isFetching: isFetchingPengajuan,
    isLoading: isLoadingPengajuan,
  } = useGetPengajuan(profileId);

  const handleCreatePengajuan: MRT_TableOptions<Pengajuan>['onCreatingRowSave'] = async ({ values, exitCreatingMode }) => {
    const newValidationErrors = validatePengajuan(values);
    if (Object.values(newValidationErrors).some((error) => error)) {
      setValidationErrors(newValidationErrors);
      return;
    }
    setValidationErrors({});
    const status_pengajuan = StatusPengajuan.diproses;
    try {
      await createPengajuan({...values, status_pengajuan});
      exitCreatingMode();
    } catch (error) {
      console.error("Error creating barang:", error); // Tambahkan logging di sini
    }
  };

  const columns = useMemo<MRT_ColumnDef<Pengajuan>[]>(
    () => [
      {
        accessorKey: 'jenis_inventaris',
        header: 'Jenis Inventaris',
        editVariant: 'select',
        mantineEditSelectProps: {
          data: Object.values(JenisInventaris),
          required: true,
          error: validationErrors?.jenis_inventaris,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              jenis_inventaris: undefined,
            }),
        },
      },
      {
        accessorKey: 'nama_inventaris',
        header: 'Nama Inventaris',
        mantineEditTextInputProps: {
          required: true,
          error: validationErrors?.nama_inventaris,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              nama_inventaris: undefined,
            }),
        },
      },
      {
        accessorKey: 'keperluan',
        header: 'Keperluan',
        mantineEditTextInputProps: {
          required: true,
          error: validationErrors?.keperluan,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              keperluan: undefined,
            }),
        },
      },
      {
        accessorKey: 'deskripsi',
        header: 'Deskripsi',
        mantineEditTextInputProps: {
          required: true,
          error: validationErrors?.deskripsi,
          onFocus: () =>
            setValidationErrors({
              ...validationErrors,
              deskripsi: undefined,
            }),
        },
      },
      {
        accessorKey: 'status_pengajuan',
        header: 'Status',
        enableEditing: false,
        visibleInShowHideMenu: false,
      },
    ],
    [validationErrors],
  );

  const table = useMantineReactTable({
    columns,
    data: fetchedPengajuan,
    createDisplayMode: 'modal',
    getRowId: (row) => row.id,
    mantineToolbarAlertBannerProps: isLoadingPengajuanError ? {
      color: 'red',
      children: 'Error loading data',
    } : undefined,
    onCreatingRowCancel: () => setValidationErrors({}),
    onCreatingRowSave: handleCreatePengajuan,
    renderCreateRowModalContent: ({ table, row, internalEditComponents }) => (
      <Stack>
        <Title order={3}>Create New Item</Title>
        {internalEditComponents}
        <Flex justify="flex-end" mt="xl">
          <MRT_EditActionButtons variant="text" table={table} row={row} />
        </Flex>
      </Stack>
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
        <Button onClick={() => table.setCreatingRow(true)}>
          Ajukan Pengajuan
        </Button>
      </Box>
    ),
    state: {
      isLoading: isLoadingPengajuan,
      showAlertBanner: isLoadingPengajuanError,
      showProgressBars: isFetchingPengajuan,
    }
  });

  return <MantineReactTable table={table} />;
};

function useGetPengajuan(profileId: any) {
  return useQuery<Pengajuan[]>({
    queryKey: ['pengajuan', profileId],
    queryFn: async () => {
      const data = await pengajuanService.getDaftarPengajuanByProfileId(profileId);
      console.log('Fetched data:', data);
      return data as Pengajuan[];
    },
    enabled: !!profileId,
    refetchOnWindowFocus: false,
  });
}

function useCreatePengajuan(profileId: any) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (pengajuan: Pengajuan) => {
      console.log('Creating pengajuan:', pengajuan);
      await pengajuanService.addPengajuanWithProfileId(pengajuan, profileId);
    },
    onMutate: async (newPengajuanInfo: Pengajuan) => {
      await queryClient.cancelQueries({ queryKey: ['pengajuan', profileId] });

      const previousPengajuan = queryClient.getQueryData<Pengajuan[]>(['pengajuan', profileId]) || [];

      queryClient.setQueryData(
        ['pengajuan', profileId],
        (prevPengajuan: Pengajuan[] = []) => [
          ...prevPengajuan,
          {
            ...newPengajuanInfo,
            status_pengajuan: StatusPengajuan.diproses,
            profile_id: profileId,
          },
        ]
      );

      return { previousPengajuan };
    },
    onError: (err: any, newPengajuanInfo: Pengajuan, context: any) => {
      console.error('Error creating pengajuan:', err);
      if (context?.previousPengajuan) {
        queryClient.setQueryData(['pengajuan', profileId], context.previousPengajuan);
      }
    },
    onSuccess: () => {
      console.log('Pengajuan created successfully');
      queryClient.invalidateQueries({ queryKey: ['pengajuan', profileId] });
    },
  });
}

const queryClient = new QueryClient();

const TabelPengajuanUserWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <ModalsProvider>
      <TabelPengajuanUser />
    </ModalsProvider>
  </QueryClientProvider>
);

export default TabelPengajuanUserWithProviders;

function validatePengajuan(pengajuan: Pengajuan) {
  return {
    jenis_inventaris: !validateRequired(pengajuan.jenis_inventaris) ? 'Jenis Inventaris tidak boleh kosong' : '',
    nama_inventaris: !validateRequired(pengajuan.nama_inventaris) ? 'Nama Inventaris tidak boleh kosong' : '',
    keperluan: !validateRequired(pengajuan.keperluan) ? 'Keperluan tidak boleh kosong' : '',
    deskripsi: !validateRequired(pengajuan.deskripsi) ? 'Deskripsi tidak boleh kosong' : '',
  };
}

const validateRequired = (value: string | number) => !!value;
