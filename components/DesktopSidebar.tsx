"use client";

import { buttonVariants } from "@/components/ui/button";

import {
  CoinsIcon,
  HomeIcon,
  Layers2Icon,
  ShieldCheckIcon,
} from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserAvailableCreditsBadge from "./UserAvailableCreditsBadge";

export const routes = [
  {
    href: "",
    label: "Home",
    icon: HomeIcon,
  },
  {
    href: "workflows",
    label: "Workflows",
    icon: Layers2Icon,
  },
  {
    href: "credentials",
    label: "Credentials",
    icon: ShieldCheckIcon,
  },
  {
    href: "billing",
    label: "Billing",
    icon: CoinsIcon,
  },
];

function DesktopSidebar() {
  const pathname = usePathname();

  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];

  return (
    <aside className="hidden relative md:block min-w-[280px] max-w-[280px] h-screen overflow-hidden w-full bg-primary/5 dark:bg-secondary/30 dark:text-foreground text-muted-foreground border-r-2 border-separate">
      <div className="flex items-center justify-center gap-2 border-b-[1px] border-separate p-4">
        <Logo />
      </div>
      <div className="p-2">
        <UserAvailableCreditsBadge />
      </div>
      <div className="flex flex-col p-2 space-y-2">
        {routes.map((route, i) => (
          <Link
            key={i}
            href={`/${route.href}`}
            className={buttonVariants({
              variant:
                activeRoute.href === route.href
                  ? "sidebarItemActive"
                  : "sidebarItem",
            })}
          >
            <route.icon size={20} />
            {route.label}
          </Link>
        ))}
      </div>
    </aside>
  );
}
export default DesktopSidebar;
