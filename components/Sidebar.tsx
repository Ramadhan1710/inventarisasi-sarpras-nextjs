'use client'

// /components/Sidebar.tsx
import React, { useEffect, useState } from 'react';
import { FaHome } from 'react-icons/fa';
import { FiBox } from "react-icons/fi";
import { LuClipboardList } from "react-icons/lu";
import { AiOutlineProduct } from "react-icons/ai";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { RxDashboard } from "react-icons/rx";
import SidebarLink from './SidebarLink';
import {
  IconArrowUpRight,
  IconArrowDownRight,
  IconBox,
  IconBuilding,
  IconWand,
  IconArrowBack,
  IconClipboardList,
  IconHome,
  IconDashboard,
} from '@tabler/icons-react';
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
          <SidebarLink href="/" icon={IconDashboard} label="Dashboard" />
          <SidebarLink href="/admin/barang" icon={IconBox} label="Daftar Barang" />
          <SidebarLink href="/admin/ruangan" icon={IconBuilding} label="Daftar Ruangan" />
          <SidebarLink href="/admin/pengajuan" icon={IconClipboardList} label="Daftar Pengajuan" />
        </>
      ) : (
        <>
          <SidebarLink href="/" icon={IconHome} label="Beranda" />
          <SidebarLink href="/pengajuan" icon={IconClipboardList} label="Pengajuan" />
          <SidebarLink href="/barang" icon={IconBox} label="Daftar Barang" />
          <SidebarLink href="/ruangan" icon={IconBuilding} label="Daftar Ruangan" />
        </>
      )}
    </div>
  );
};

export default Sidebar;
