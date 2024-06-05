// /components/SidebarLink.tsx
import React, { useEffect, useState, ElementType } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { IconType } from 'react-icons'; // Import IconType dari react-icons

interface SidebarLinkProps {
  href: string;
  icon: ElementType;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ href, icon: Icon, label }) => {
  const router = usePathname();
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (router) {
      setIsActive(router === href);
    }
  }, [router, href]);

  return (
    <Link href={href}>
      <button className={`sidebar-link ${isActive ? 'bg-background-secondary-light text-background-secondary' : 'bg-transparent'} flex flex-row justify-start gap-4 items-center w-full h-10 px-4 rounded-md text-md font-sans font-medium`}>
        <Icon className="sidebar-icon" />
        <span className="sidebar-label">{label}</span>
      </button>
    </Link>
  );
};

export default SidebarLink;
