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
      className="w-full bg-background-secondary h-10 rounded-md flex justify-center items-center gap-2 text-white"
    >
      <div className="flex items-center gap-2">
        <IconLogout style={{ width: rem(20), height: rem(20) }} />
        Logout
      </div>

    </button>
  );
}