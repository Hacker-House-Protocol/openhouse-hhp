"use client";

import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AuthButtonProps {
  className?: string;
}

export function AuthButton({ className }: AuthButtonProps) {
  const { isAuthenticated, isLoading, user, login, logout } = useAuth();
  const router = useRouter();

  async function handleLogout() {
    await logout();
    router.replace("/");
  }

  if (isLoading) {
    return <Button size="sm" disabled className={className}>Loading...</Button>;
  }

  if (!isAuthenticated) {
    return (
      <Button
        size="sm"
        onClick={login}
        className={className ?? "rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-5"}
      >
        Connect
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" variant="outline" className={className}>Go to Dashboard</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
        <DropdownMenuItem onClick={handleLogout}>Disconnect</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
