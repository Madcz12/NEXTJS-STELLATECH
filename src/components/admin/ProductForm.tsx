"use client";

import { useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { createProduct, updateProduct } from "@/lib/actions/admin";

interface Category {
  id: string;
  name: string;
}

interface ProductFormProps {
  categories: Category[];
  initialData?: any;
  productId?: string;
}

export function ProductForm({ categories, initialData, productId }: ProductFormProps) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const productName = formData.get("name") as string;

    startTransition(async () => {
      try {
        if (productId) {
          await updateProduct(productId, formData);
          toast.success("Producto actualizado", {
            description: `Se han guardado los cambios en "${productName}".`,
          });
        } else {
          await createProduct(formData);
          toast.success("Producto creado", {
            description: `"${productName}" se ha añadido al catálogo.`,
          });
        }
        
        // Redirigir manualmente después del éxito
        router.push("/admin/products");
      } catch {
        toast.error("Error", {
          description: "No se pudo guardar el producto.",
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mx-auto grid max-w-4xl flex-1 auto-rows-max gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild type="button">
            <Link href="/admin/products">
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </Button>
          <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
            {productId ? "Editar Producto" : "Crear Producto"}
          </h1>
          <div className="hidden items-center gap-2 md:ml-auto md:flex">
            <Button variant="outline" size="sm" type="button" asChild>
              <Link href="/admin/products">Descartar</Link>
            </Button>
            <Button type="submit" size="sm" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar Producto"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-[1fr_250px] lg:grid-cols-3 lg:gap-8">
          <div className="grid auto-rows-max items-start gap-4 lg:col-span-2 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Detalles del Producto</CardTitle>
                <CardDescription>Información básica del producto.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    type="text" 
                    placeholder="Nombre del producto" 
                    required 
                    defaultValue={initialData?.name}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea 
                    id="description" 
                    name="description" 
                    placeholder="Descripción del producto" 
                    className="min-h-32" 
                    required 
                    defaultValue={initialData?.description}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="price">Precio ($)</Label>
                    <Input 
                      id="price" 
                      name="price" 
                      type="number" 
                      step="0.01" 
                      placeholder="0.00" 
                      required 
                      defaultValue={initialData?.price}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="stock">Stock</Label>
                    <Input 
                      id="stock" 
                      name="stock" 
                      type="number" 
                      placeholder="0" 
                      defaultValue={initialData?.stock ?? 0}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categoría</CardTitle>
              </CardHeader>
              <CardContent>
                <Select name="categoryId" required defaultValue={initialData?.categoryId}>
                  <SelectTrigger id="categoryId">
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>

          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Imagen del Producto</CardTitle>
                <CardDescription>URL de la imagen representativa.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-2">
                  <Label htmlFor="image">URL de la Imagen</Label>
                  <Input 
                    id="image" 
                    name="image" 
                    type="url" 
                    placeholder="https://..." 
                    defaultValue={initialData?.image}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Visibilidad</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="isFeatured" 
                    name="isFeatured" 
                    defaultChecked={initialData?.isFeatured}
                  />
                  <Label htmlFor="isFeatured">Producto Destacado</Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="isNew" 
                    name="isNew" 
                    defaultChecked={initialData?.isNew}
                  />
                  <Label htmlFor="isNew">Marcar como Nuevo</Label>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 md:hidden">
          <Button variant="outline" size="sm" type="button" asChild>
            <Link href="/admin/products">Descartar</Link>
          </Button>
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar Producto"}
          </Button>
        </div>
      </div>
    </form>
  );
}
