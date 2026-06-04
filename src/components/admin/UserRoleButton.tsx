"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUserRole } from "@/lib/actions/admin";

interface UserRoleButtonProps {
  userId: string;
  currentRole: "ADMIN" | "CUSTOMER";
  userName: string;
}

export function UserRoleButton({ userId, currentRole, userName }: UserRoleButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleUpdateRole = () => {
    const newRole = currentRole === "ADMIN" ? "CUSTOMER" : "ADMIN";
    
    startTransition(async () => {
      try {
        await updateUserRole(userId, newRole);
        toast.success("Role Updated", {
          description: `${userName} is now a ${newRole.toLowerCase()}.`,
        });
      } catch {
        toast.error("Error", {
          description: "Failed to update user role.",
        });
      }
    });
  };

  return (
    <Button 
      type="button" 
      variant="outline" 
      size="sm"
      onClick={handleUpdateRole}
      disabled={isPending}
    >
      {isPending ? "Updating..." : currentRole === "ADMIN" ? "Make Customer" : "Make Admin"}
    </Button>
  );
}
