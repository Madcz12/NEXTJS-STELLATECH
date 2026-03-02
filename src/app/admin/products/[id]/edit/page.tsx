import { notFound } from "next/navigation";
import { getProductById, getCategories } from "@/lib/actions/products";
import { ProductForm } from "@/components/admin/ProductForm";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getProductById(id),
    getCategories(),
  ]);

  if (!product) notFound();

  return (
    <ProductForm 
      categories={categories} 
      initialData={product} 
      productId={id} 
    />
  );
}
