"use client";

import { usePathname } from "next/navigation";
import { routes } from "./DesktopSidebar";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button, buttonVariants } from "./ui/button";
import { MenuIcon } from "lucide-react";
import Logo from "./Logo";
import Link from "next/link";
import UserAvailableCreditsBadge from "./UserAvailableCreditsBadge";

function MobileSidebar() {
  const pathname = usePathname();

  const activeRoute =
    routes.find(
      (route) => route.href.length > 0 && pathname.includes(route.href)
    ) || routes[0];

  return (
    <aside className="block border-separate bg-background md:hidden">
      <nav className="container flex items-center justify-between px-8">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant={"ghost"} size={"icon"}>
              <MenuIcon />
            </Button>
          </SheetTrigger>
          <SheetContent
            className="p-4 w-[400px] sm:w-[540px] space-y-4"
            side="left"
          >
            <SheetTitle> </SheetTitle>
            <Logo />
            <UserAvailableCreditsBadge />
            <div className="flex flex-col gap-1">
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
          </SheetContent>
        </Sheet>
      </nav>
    </aside>
  );
}
export default MobileSidebar;
