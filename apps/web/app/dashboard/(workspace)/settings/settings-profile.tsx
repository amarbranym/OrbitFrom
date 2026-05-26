"use client";

import { IconLoader2 } from "@tabler/icons-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { trpc } from "~/trpc/client";

export function SettingsProfile() {
  const { data, isLoading } = trpc.auth.getSession.useQuery();

  const user = data?.user;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your signed-in account details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <IconLoader2 className="size-4 animate-spin" />
            Loading profile…
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={user?.fullName ?? ""}
                readOnly
                className="bg-muted/30"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={user?.email ?? ""}
                readOnly
                className="bg-muted/30"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {user?.emailVerified ? "Email verified" : "Email not verified"}
            </p>
          </>
        )}
      </CardContent>
    </Card>
  );
}
