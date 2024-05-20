'use client'

import AuthButton from "@/components/AuthButton";
import { AppShell, Burger, Group, Text, Avatar } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "@/components/Sidebar";
import { LogoutButton } from "@/components/LogoutButton";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
    >
      <AppShell.Header >
        <div className="flex flex-row justify-between px-4 h-full bg-background-secondary items-center text-white">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="white"/>
          <Text>InventSchool</Text>
          <div className="flex flex-row">
            <AuthButton />
          </div>
        </div>
      </AppShell.Header>
      <AppShell.Navbar p="md">
        <div className="flex flex-col justify-between h-full">
          <Sidebar />
          <LogoutButton />
        </div>
      </AppShell.Navbar>
      <AppShell.Main >
        <div className="p-4">
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  );
}

export default DashboardLayout;