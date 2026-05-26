"use client";

import {
  IconChevronUp,
  IconLoader2,
  IconLogout,
  IconSettings,
  IconUserCircle,
} from "@tabler/icons-react";
import Link from "next/link";
import { toast } from "sonner";

import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "~/components/ui/sidebar";
import { trpc } from "~/trpc/client";
import { cn } from "~/lib/utils";

function initialsFromName(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function NavUser() {
  const { isMobile } = useSidebar();
  const utils = trpc.useUtils();
  const { data, isLoading } = trpc.auth.getSession.useQuery();
  const signOut = trpc.auth.signOut.useMutation({
    onSuccess: async () => {
      await utils.auth.getSession.invalidate();
      window.location.href = "/logout";
    },
    onError: (error) => {
      toast.error(error.message || "Could not sign out. Clearing local session...");
      window.location.href = "/logout";
    },
  });

  const user = data?.user;
  const displayName = user?.fullName ?? "Account";
  const displayEmail = user?.email ?? "";
  const initials = user ? initialsFromName(user.fullName) : "…";

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-sidebar-accent text-sidebar-accent-foreground">
                  {isLoading ? (
                    <IconLoader2 className="size-4 animate-spin" />
                  ) : (
                    initials
                  )}
                </AvatarFallback>
              </Avatar>
              <UserDetails name={displayName} email={displayEmail} loading={isLoading} />
              <IconChevronUp className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <UserDetails
                className="px-2 py-1.5"
                name={displayName}
                email={displayEmail}
                loading={isLoading}
              />
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">
                <IconSettings />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              <IconUserCircle />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={signOut.isPending}
              onClick={() => signOut.mutate()}
              variant="destructive"
            >
              {signOut.isPending ? (
                <IconLoader2 className="size-4 animate-spin" />
              ) : (
                <IconLogout />
              )}
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function UserDetails({
  className,
  name,
  email,
  loading,
}: {
  className?: string;
  name: string;
  email: string;
  loading?: boolean;
}) {
  return (
    <div className={cn("grid flex-1 text-left text-sm leading-tight", className)}>
      <span className="truncate font-medium">{loading ? "Loading…" : name}</span>
      <span className="truncate text-xs text-primary-foreground/70">
        {loading ? "…" : email}
      </span>
    </div>
  );
}
