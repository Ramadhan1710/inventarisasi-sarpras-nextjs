'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getProfile } from '@/utils/supabase/auth';
import { TextInput, Select, Button } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import pengajuanService, { StatusPengajuan, JenisInventaris } from '@/services/pengajuan';
import Banner from './banner';
import { notifications } from '@mantine/notifications';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [ajukanPengajuan, setAjukanPengajuan] = useState(false);
  const [pengajuanBaru, setPengajuanBaru] = useState<any>({
    profile_id: '',
    jenis_inventaris: '',
    nama_inventaris: '',
    keperluan: '',
    deskripsi: '',
    status_pengajuan: StatusPengajuan.diproses,
  });
  const [errors, setErrors] = useState<any>({});
  const [opened, { close, open }] = useDisclosure(false);

  const router = useRouter();

  async function handleCreatePengajuan() {
    const newPengajuan = { ...pengajuanBaru };

    const validationErrors = validateForm(newPengajuan);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    console.log('Sending data:', newPengajuan);

    await pengajuanService.addPengajuan(newPengajuan);

    notifications.show({
      color: 'green',
      title: 'Pengajuan Berhasil',
      message: 'Dimohon menunggu proses pengajuan.',
    })

    setAjukanPengajuan(false);

    console.log("Pengajuan berhasil dibuat!");
    // Optionally, navigate to another page or update the state to reflect the new pengajuan
  }

  const validateForm = (pengajuan: any) => {
    const newErrors: any = {};

    if (!pengajuan.jenis_inventaris) newErrors.jenis_inventaris = 'Jenis Inventaris is required';
    if (!pengajuan.nama_inventaris) newErrors.nama_inventaris = 'Nama Inventaris is required';
    if (!pengajuan.keperluan) newErrors.keperluan = 'Keperluan is required';
    if (!pengajuan.deskripsi) newErrors.deskripsi = 'Deskripsi is required';

    return newErrors;
  };

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        const { profile, error } = await getProfile(userData.data.user?.id as string);
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        setUser(profile);
        setPengajuanBaru((prevState: any) => ({
          ...prevState,
          profile_id: profile.id,
        }));
      }
    };
    fetchUser();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPengajuanBaru({
      ...pengajuanBaru,
      [name]: value,
    });
  };

  return (
    <div>
      {!ajukanPengajuan ? (
        <Banner setAjukanPengajuan={setAjukanPengajuan} />
      ) : (
        <div>
          {ajukanPengajuan && (
            <div className="flex flex-col gap-4 mb-10">
              <div className='text-3xl font-bold h-20 border p-4 flex items-center rounded-sm'>
                <h1 className='text-3xl font-sans font-semibold'>Form Pengajuan Sarpras</h1>
              </div>
              <form onSubmit={(e) => { e.preventDefault(); handleCreatePengajuan(); }} className="flex flex-col gap-2">
                <Select
                  label="Jenis Inventaris"
                  name="jenis_inventaris"
                  placeholder='Pilih Jenis Inventaris'
                  value={pengajuanBaru.jenis_inventaris}
                  onChange={(value) => setPengajuanBaru({ ...pengajuanBaru, jenis_inventaris: value })}
                  data={Object.values(JenisInventaris).map((jenis) => ({ value: jenis, label: jenis }))}
                  error={errors.jenis_inventaris}
                />
                <TextInput
                  label="Nama Inventaris"
                  name="nama_inventaris"
                  placeholder='Nama Inventaris'
                  value={pengajuanBaru.nama_inventaris}
                  onChange={handleChange}
                  error={errors.nama_inventaris}
                />
                <TextInput
                  label="Keperluan"
                  name="keperluan"
                  placeholder='Keperluan'
                  value={pengajuanBaru.keperluan}
                  onChange={handleChange}
                  error={errors.keperluan}
                />
                <TextInput
                  label="Deskripsi"
                  name="deskripsi"
                  placeholder='Deskripsi'
                  value={pengajuanBaru.deskripsi}
                  onChange={handleChange}
                  error={errors.deskripsi}
                />
                <div className='flex flex-row gap-4 justify-end'>
                  <Button onClick={() => setAjukanPengajuan(false)} color='red'>Batal</Button>
                  <Button type="submit">Ajukan</Button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
