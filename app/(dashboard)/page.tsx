'use client'

import React, { useState, useEffect } from 'react';
import { peminjaman_barang } from '@/services/peminjaman-barang';
import { useRouter } from 'next/navigation';
import { getCurrentUser, getProfile } from '@/utils/supabase/auth';
import { TextInput, Select, Button } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [barang, setBarang] = useState([]);
  const [peminjamanBarang, setPeminjamanBarang] = useState([] as peminjaman_barang[]);

  const [peminjamanBarangBaru, setPeminjamanBarangBaru] = useState<peminjaman_barang>({
    profile_id: '',
    barang_id: '',
    jumlah: '',
    kepentingan: '',
    tanggal_peminjaman: '',
    tanggal_pengembalian: '',
    status: ''
  });

  const router = useRouter();

  async function handleCreatePeminjamanBarang() {
    const newPeminjamanBarang = {
      ...peminjamanBarangBaru,
    };

    console.log('Sending data:', newPeminjamanBarang); // log data yang dikirim

    const response = await fetch('/api/peminjaman/barang', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newPeminjamanBarang),

    });

    const result = await response.text();
    console.log('Server response:', result);

    if (response.ok) {
      console.log("Peminjaman barang berhasil!");
      // router.push('/user/peminjaman/barang');
    } else {
      console.error("Gagal melakukan peminjaman barang.");
    }
  }

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
        setPeminjamanBarangBaru(prevState => ({
          ...prevState,
          profile_id: profile.id
        }));
      }
    }
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchBarang = async () => {
      const data = await fetch('/api/barang').then((res) => res.json());
      setBarang(data);
    }
    fetchBarang();
  }, []);

  useEffect(() => {
    const fetchPeminjamanBarang = async () => {
      const data = await fetch('/api/peminjaman/barang').then((res) => res.json());
      setPeminjamanBarang(data);
      console.log(data);
    }
    fetchPeminjamanBarang();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPeminjamanBarangBaru({
      ...peminjamanBarangBaru,
      [name]: value,
    });
  };

  return (
    <div>
      <h1>Form Pengajuan Peminjaman Barang</h1>
      <form onSubmit={(e) => { e.preventDefault(); handleCreatePeminjamanBarang(); }}>
        <Select
          label="Pilih Barang"
          name="barang_id"
          value={peminjamanBarangBaru.barang_id}
          onChange={(value) => setPeminjamanBarangBaru({ ...peminjamanBarangBaru, barang_id: value })}
          data={barang.map((item: any) => ({ value: item.id, label: item.nama }))}
        />
        <TextInput
          label="Jumlah"
          name="jumlah"
          value={peminjamanBarangBaru.jumlah}
          onChange={handleChange}
        />
        <TextInput
          label="Kepentingan"
          name="kepentingan"
          value={peminjamanBarangBaru.kepentingan}
          onChange={handleChange}
        />
        <DateTimePicker
          label="Tanggal Peminjaman"
          placeholder="Pilih Tanggal dan Waktu"
          value={peminjamanBarangBaru.tanggal_peminjaman ? new Date(peminjamanBarangBaru.tanggal_peminjaman) : null}
          onChange={(date) => setPeminjamanBarangBaru({ ...peminjamanBarangBaru, tanggal_peminjaman: date?.toISOString() || '' })}
        />
        <DateTimePicker
          label="Tanggal Pengembalian"
          placeholder="Pilih Tanggal dan Waktu"
          value={peminjamanBarangBaru.tanggal_pengembalian ? new Date(peminjamanBarangBaru.tanggal_pengembalian) : null}
          onChange={(date) => setPeminjamanBarangBaru({ ...peminjamanBarangBaru, tanggal_pengembalian: date?.toISOString() || '' })}
        />
        <TextInput
          label="Status"
          name="status"
          value={peminjamanBarangBaru.status}
          onChange={handleChange}
        />
        <Button type="submit">Ajukan Peminjaman</Button>
      </form>
    </div>
  );
}
