'use client'

// /components/Sidebar.tsx
import React, { useEffect, useState } from 'react';
import { FaHome, FaUser, FaBox, FaClipboardList } from 'react-icons/fa';
import { MdMeetingRoom, MdOutlineAssignment, MdOutlineAssignmentReturn } from 'react-icons/md';
import SidebarLink from './SidebarLink';
import { getCurrentUser, getProfile } from '@/utils/supabase/auth';

const Sidebar: React.FC = () => {
  // User admin dan user biasa
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      if (userData) {
        const { profile, error } = await getProfile(userData.data.user?.id as string);
        profile?.is_admin ? setIsAdmin(true) : setIsAdmin(false);
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
      }
    };
    fetchUser();
  }, []); 

  return (
    <div className="flex flex-col gap-2">
      {isAdmin ? (
        <>
          <SidebarLink href="/" icon={FaHome} label="Dashboard" />
          <SidebarLink href="/admin/user" icon={FaUser} label="Daftar User" />
          <SidebarLink href="/admin/barang" icon={FaBox} label="Daftar Barang" />
          <SidebarLink href="/admin/ruang" icon={MdMeetingRoom} label="Daftar Ruangan" />
          <SidebarLink href="/admin/peminjaman/barang" icon={FaClipboardList} label="Peminjaman Barang" />
          <SidebarLink href="/admin/peminjaman/ruangan" icon={MdOutlineAssignment} label="Peminjaman Ruangan" />
          <SidebarLink href="/admin/pengembalian/barang" icon={MdOutlineAssignmentReturn} label="Pengembalian Barang" />
          <SidebarLink href="/admin/pengembalian/ruangan" icon={MdOutlineAssignmentReturn} label="Pengembalian Ruangan" />
        </>
      ) : (
        <>
          <SidebarLink href="/" icon={FaHome} label="Halaman Beranda" />
          <SidebarLink href="/user/barang" icon={FaBox} label="Barang" />
          <SidebarLink href="/user/ruangan" icon={MdMeetingRoom} label="Ruangan" />
          <SidebarLink href="/user/peminjaman/barang" icon={FaClipboardList} label="Peminjaman Barang" />
          <SidebarLink href="/user/peminjaman/ruangan" icon={MdOutlineAssignment} label="Peminjaman Ruangan" />
          <SidebarLink href="/user/pengembalian/barang" icon={MdOutlineAssignmentReturn} label="Pengembalian Barang" />
          <SidebarLink href="/user/pengembalian/ruangan" icon={MdOutlineAssignmentReturn} label="Pengembalian Ruangan" />
        </>
      )}
    </div>
  );
};

export default Sidebar;
