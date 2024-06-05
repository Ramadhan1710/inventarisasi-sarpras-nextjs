'use client'

import { signOut } from '@/utils/supabase/auth';
import { Button, rem } from '@mantine/core';
import { IconLogout } from '@tabler/icons-react';
import { useRouter } from 'next/navigation';

export function LogoutButton() {
  const router = useRouter();

  return (
    <button
      onClick={async () => {
        signOut();
        router.refresh();
      }}
      className="w-ful h-10 rounded-md flex justify-center items-center gap-2 text-background-secondary hover:bg-background-secondary-dark "
    >
      <div className="flex items-center gap-2 text-md">
        <IconLogout style={{ width: rem(24), height: rem(24) }} />
        Logout
      </div>
    </button>
  );
}