"use client";

import { useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { createCategory } from "@/lib/actions/admin";

export function CategoryForm() {
  const [isPending, startTransition] = useTransition();
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const categoryName = formData.get("name") as string;

    startTransition(async () => {
      try {
        await createCategory(formData);
        toast.success(categoryName, {
          description: "Successfully added to your categories.",
        });
        setName(""); // Clear input on success
      } catch {
        toast.error("Error", {
          description: "Could not create category. Please try again.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-end gap-3">
      <div className="flex-1 grid gap-1.5">
        <label htmlFor="name" className="text-sm font-medium">Category Name</label>
        <Input 
          id="name" 
          name="name" 
          placeholder="e.g., Smartphones" 
          required 
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
        />
      </div>
      <Button type="submit" disabled={isPending}>
        <Plus className="mr-2 h-4 w-4" /> 
        {isPending ? "Adding..." : "Add Category"}
      </Button>
    </form>
  );
}
