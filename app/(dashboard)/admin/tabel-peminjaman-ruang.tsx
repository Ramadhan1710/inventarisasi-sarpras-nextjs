import '@mantine/core/styles.css';
import '@mantine/dates/styles.css'; //if using mantine date picker features
import 'mantine-react-table/styles.css'; //make sure MRT styles were imported in your app root (once)
import clsx from 'clsx';
import { useMemo } from 'react';
import {
  type MRT_ColumnDef,
  MRT_Table,
  useMantineReactTable,
} from 'mantine-react-table';
import { useMantineColorScheme } from '@mantine/core';

export const TabelPeminjamanRuang = () => {
  const { colorScheme } = useMantineColorScheme();

  type Person = {
    name: {
      firstName: string;
      lastName: string;
    };
    address: string;
    city: string;
    state: string;
  };

  //nested data is ok, see accessorKeys in ColumnDef below
  const data: Person[] = [
    {
      name: {
        firstName: 'Zachary',
        lastName: 'Davis',
      },
      address: '261 Battle Ford',
      city: 'Columbus',
      state: 'Ohio',
    },
    {
      name: {
        firstName: 'Robert',
        lastName: 'Smith',
      },
      address: '566 Brakus Inlet',
      city: 'Westerville',
      state: 'West Virginia',
    },
    {
      name: {
        firstName: 'Kevin',
        lastName: 'Yan',
      },
      address: '7777 Kuhic Knoll',
      city: 'South Linda',
      state: 'West Virginia',
    },
    {
      name: {
        firstName: 'John',
        lastName: 'Upton',
      },
      address: '722 Emie Stream',
      city: 'Huntington',
      state: 'Washington',
    },
    {
      name: {
        firstName: 'Nathan',
        lastName: 'Harris',
      },
      address: '1 Kuhic Knoll',
      city: 'Ohiowa',
      state: 'Nebraska',
    },
  ];

  const columns = useMemo<MRT_ColumnDef<Person>[]>(
    () => [
      {
        accessorKey: 'name.firstName', //access nested data with dot notation
        header: 'First Name',
        size: 100,
      },
      {
        accessorKey: 'name.lastName',
        header: 'Last Name',
        size: 100,
      },
      {
        accessorKey: 'address', //normal accessorKey
        header: 'Address',
      },
      {
        accessorKey: 'city',
        header: 'City',
        size: 100,
      },
      {
        accessorKey: 'state',
        header: 'State',
        size: 100,
      },
    ],
    [],
  );
  //should be memoized or stable



  const table = useMantineReactTable({
    columns,
    data,
    enableColumnActions: false,
    enableColumnFilters: false,
    enablePagination: false,
    enableSorting: false,
    mantineTableProps: {
      highlightOnHover: false,
      striped: 'odd',
      withColumnBorders: true,
      withRowBorders: true,
      withTableBorder: true,
    },
    enableBottomToolbar: false,
    
  });

  //using MRT_Table instead of MantineReactTable if we do not want any of the toolbar features
  return <MRT_Table table={table} />;
};

export default TabelPeminjamanRuang;