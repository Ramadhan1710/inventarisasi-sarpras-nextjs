import { useMemo, useState } from 'react';
import { MantineReactTable, useMantineReactTable, type MRT_ColumnDef } from 'mantine-react-table';
import { Title } from '@mantine/core';
import { useQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import profileService, { Profile } from '@/services/user';

const TabelUserAdmin = () => {
  const {
    data: fetchedProfile = [],
    isError: isLoadingProfileError,
    isFetching: isFetchingProfile,
    isLoading: isLoadingProfile,
  } = useGetProfile();

  const columns = useMemo<MRT_ColumnDef<Profile>[]>(
    () => [
      {
        accessorKey: 'nama_lengkap',
        header: 'Nama User',
      },
      {
        accessorKey: 'user_email',
        header: 'Email',
        size: 80,
      },
      {
        accessorKey: 'is_admin',
        header: 'Role',
        Cell: ({ cell }) => cell.getValue() ? 'Admin' : 'User', // Menampilkan nilai sebagai 'Admin' jika true, dan 'User' jika false
      }
    ],
    [],
  );

  const table = useMantineReactTable({
    columns,
    data: fetchedProfile,
    state: {
      isLoading: isLoadingProfile,
      showAlertBanner: isLoadingProfileError,
      showProgressBars: isFetchingProfile,
    },
  });

  return (
    <>
      <MantineReactTable table={table} />
    </>
  );
};

function useGetProfile() {
  return useQuery<Profile[]>({
    queryKey: ['profile'],
    queryFn: async () => {
      const data = await profileService.getListProfile();
      console.log('Fetched data:', data); // Log the fetched data
      return data as Profile[];
    },
    refetchOnWindowFocus: false,
  });
}

const queryClient = new QueryClient();

const TabelUserAdminWithProviders = () => (
  <QueryClientProvider client={queryClient}>
    <TabelUserAdmin />
  </QueryClientProvider>
);

export default TabelUserAdminWithProviders;
