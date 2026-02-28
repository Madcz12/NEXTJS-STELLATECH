import Link from "next/link";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { getCategories } from "@/lib/actions/products";
import { createCategory, deleteCategory } from "@/lib/actions/admin";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold md:text-2xl">Categories</h1>
      </div>

      {/* Create Category */}
      <Card>
        <CardHeader>
          <CardTitle>New Category</CardTitle>
          <CardDescription>Add a new product category to the catalog.</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={createCategory} className="flex items-end gap-3">
            <div className="flex-1 grid gap-1.5">
              <label htmlFor="name" className="text-sm font-medium">Category Name</label>
              <Input id="name" name="name" placeholder="e.g., Smartphones" required />
            </div>
            <Button type="submit">
              <Plus className="mr-2 h-4 w-4" /> Add Category
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Categories</CardTitle>
          <CardDescription>
            {categories.length} categories found.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead className="text-center">Products</TableHead>
                <TableHead><span className="sr-only">Actions</span></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-medium">{cat.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm font-mono">{cat.slug || cat.name.toLowerCase().replace(/ /g, "-")}</TableCell>
                  <TableCell className="text-center">
                    <span className="inline-flex items-center justify-center rounded-full bg-muted px-2.5 py-0.5 text-sm font-medium">
                      {cat._count.products}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <form
                      action={async () => {
                        "use server";
                        await deleteCategory(cat.id);
                      }}
                    >
                      <Button
                        type="submit"
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        disabled={cat._count.products > 0}
                        title={cat._count.products > 0 ? "Cannot delete: has products" : "Delete category"}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </form>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
