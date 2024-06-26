import { Grid } from "@mantine/core";
import React from "react";

interface Props {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
}
export default function AdminCard({ title, subtitle, icon }: Props) {
  return (
    <div className="w-full h-36 p-8 bg-background-secondary rounded-md flex flex-row gap-4 items-center text-white shadow-md">
      <div>
        {icon}
      </div>
      <div>
        <h2 className="font-bold">{title}</h2>
        <p>{subtitle}</p>
      </div>
    </div>
  )
}