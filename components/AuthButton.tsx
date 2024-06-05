'use client'

import { useEffect, useState } from 'react';
import { getCurrentUser, getProfile, signOut } from '@/utils/supabase/auth';
import { Menu, Button, rem, Avatar, Group } from '@mantine/core';
import { IconExternalLink, IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export default function AuthButton() {
  const [profile, setProfile] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const userData = await getCurrentUser();
      if (userData?.data?.user) {
        const { profile, error } = await getProfile(userData.data.user.id);
        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }
        setProfile(profile);
      }
    };
    fetchUser();
  }, []);

  const image = 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-5.png';

  const router = useRouter();

  return (
    <div className='h-full'>
      <Menu width={200} shadow="md">
        <Menu.Target >
          <button className='flex flex-row gap-2 p-2 items-center justify-items-center '>
            <Avatar size="md" src={image} radius={'xl'} />
            <div className='hidden md:block text-xl font-medium'>
              {profile && profile.nama_lengkap}
            </div>
          </button>
        </Menu.Target>

        <Menu.Dropdown>
          <Menu.Item
            color="red"
          >
            <button
              onClick={async () => {
                signOut();
                router.refresh();
              }}
              className="w-full rounded-md flex justify-start items-center text-red-500 h-full"
            >
              <div className="flex items-center gap-2">
                <IconLogout style={{ width: rem(20), height: rem(20) }} />
                Logout
              </div>

            </button>
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </div>
  );
}
