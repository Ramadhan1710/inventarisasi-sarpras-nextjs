'use client'

import AuthButton from "@/components/AuthButton";
import { AppShell, Burger } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import Sidebar from "@/components/Sidebar";
import { LogoutButton } from "@/components/LogoutButton";
import { Navbar } from "@/components/Navbar";
import classes from "./layout.module.css";


const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [opened, { toggle }] = useDisclosure();

  return (
    <AppShell
      navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
      header={{ height: 60 }}
    >
      <AppShell.Navbar p={'md'}>
        <div className="flex flex-col justify-between h-full">
          <Sidebar />
          <LogoutButton />
          {/* <Navbar /> */}
        </div>
      </AppShell.Navbar>
      <AppShell.Header className={classes.header}>
        <div className="flex flex-row justify-between px-4 h-full items-center text-background-secondary">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="blue" />
          <span className="text-xl md:text-3xl font-poppins font-bold">InventSchool</span>
          <div className="flex flex-row">
            <AuthButton />
          </div>
        </div>
      </AppShell.Header>
      <AppShell.Main>
        <div className="p-4">
          {children}
        </div>
        <Footer />
      </AppShell.Main>
    </AppShell>
  );
}

const Footer = () => {
  return (
    <footer className="text-gray-400 py-4 mx-4 mb-4 border rounded-md h-36 flex justify-center items-center text-center">
      <div className="text-sm">
        &copy; {new Date().getFullYear()} InventSchool. All rights reserved.
      </div>
    </footer>
  );
}

export default DashboardLayout;
