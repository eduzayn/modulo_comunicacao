"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { cn } from "../../../lib/utils";

interface SettingsMenuGroup {
  title: string;
  items: {
    name: string;
    href: string;
    icon?: React.ReactNode;
  }[];
}

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  const menuGroups: SettingsMenuGroup[] = [
    {
      title: "Geral",
      items: [
        { name: "Perfil", href: "/settings/account/profile" },
        { name: "Notificações", href: "/settings/account/notifications" },
        { name: "Geral", href: "/settings/general" },
      ],
    },
    {
      title: "Comunicação",
      items: [
        { name: "Canais", href: "/settings/channels" },
        { name: "Horário Comercial", href: "/settings/business-hours" },
        { name: "Tags", href: "/settings/tags" },
      ],
    },
    {
      title: "Automação",
      items: [
        { name: "Automações", href: "/settings/automations" },
        { name: "Bots", href: "/settings/bots" },
        { name: "Fluxos", href: "/settings/workflows" },
      ],
    },
    {
      title: "Integrações",
      items: [
        { name: "Integrações", href: "/settings/integrations" },
        { name: "API Keys", href: "/settings/integrations/api-keys" },
      ],
    },
  ];

  return (
    <div className="flex flex-col md:flex-row w-full gap-6 p-2">
      {/* Menu lateral */}
      <aside className="w-full md:w-64 shrink-0">
        <nav className="space-y-6">
          {menuGroups.map((group) => (
            <div key={group.title} className="space-y-2">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {group.title}
              </h3>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm rounded-md",
                        pathname === item.href
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                    >
                      {item.icon && <span className="mr-2">{item.icon}</span>}
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Conteúdo principal */}
      <main className="flex-1 p-4 border rounded-lg">
        {children}
      </main>
    </div>
  );
} 