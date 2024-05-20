import { useForm } from '@mantine/form';
import { Modal, TextInput, NumberInput, Select, Button } from '@mantine/core';
import { Barang } from '@/services/barang';

interface FormBarangProps {
  opened: boolean;
  onClose: () => void;
  onSubmit: (barang: Partial<Barang>) => void;
  initialValues?: Partial<Barang>;
}

export function FormBarang({ opened, onClose, onSubmit, initialValues }: FormBarangProps) {
  const form = useForm({
    initialValues: initialValues || {
      nama: '',
      stok: 0,
      lokasi: '',
      deskripsi: '',
      kondisi: '',
      status: '',
    },
  });

  return (
    <Modal opened={opened} onClose={onClose} title="Barang Form">
      <form
        onSubmit={form.onSubmit((values) => {
          onSubmit(values);
          form.reset();
        })}
      >
        <TextInput
          label="Nama Barang"
          {...form.getInputProps('nama')}
        />
        <NumberInput
          label="Stok"
          {...form.getInputProps('stok')}
        />
        <TextInput
          label="Lokasi"
          {...form.getInputProps('lokasi')}
        />
        <TextInput
          label="Deskripsi"
          {...form.getInputProps('deskripsi')}
        />
        <Select
          label="Kondisi"
          data={['Baik', 'Rusak']}
          {...form.getInputProps('kondisi')}
        />
        <Select
          label="Status"
          data={['Aktif', 'Non-aktif']}
          {...form.getInputProps('status')}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Modal>
  );
}
