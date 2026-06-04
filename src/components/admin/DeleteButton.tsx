"use client";

import { useState, useTransition } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface DeleteButtonProps {
  action: () => Promise<void>;
  itemName: string;
  disabled?: boolean;
  disabledTooltip?: string;
}

export function DeleteButton({ action, itemName, disabled, disabledTooltip }: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition();
  const [isConfirming, setIsConfirming] = useState(false);

  const handleDelete = () => {
    if (!isConfirming) {
      setIsConfirming(true);
      // Auto-cancel confirmation after 3 seconds
      setTimeout(() => setIsConfirming(false), 3000);
      return;
    }

    startTransition(async () => {
      try {
        await action();
        toast.success("Deleted", {
          description: `"${itemName}" has been removed.`,
        });
        setIsConfirming(false);
      } catch (error: any) {
        toast.error("Error", {
          description: error.message || "Failed to delete item.",
        });
        setIsConfirming(false);
      }
    });
  };

  const button = (
    <Button
      type="button"
      variant={isConfirming ? "destructive" : "ghost"}
      size={isConfirming ? "sm" : "icon"}
      className={
        isConfirming 
          ? "animate-in fade-in zoom-in duration-200" 
          : "text-destructive hover:text-destructive hover:bg-destructive/10"
      }
      onClick={handleDelete}
      disabled={disabled || isPending}
    >
      {isPending ? (
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : isConfirming ? (
        <>
          <AlertTriangle className="mr-2 h-4 w-4" />
          Confirmar
        </>
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </Button>
  );

  if (disabled && disabledTooltip) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="inline-block">{button}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{disabledTooltip}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return button;
}
