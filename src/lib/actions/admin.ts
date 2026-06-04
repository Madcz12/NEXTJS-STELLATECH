"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

// ─── DASHBOARD ────────────────────────────────────────────────────────────────

export async function getDashboardStats() {
  const [totalProducts, totalUsers, totalCategories, lowStockProducts, recentProducts] =
    await Promise.all([
      prisma.product.count(),
      prisma.user.count(),
      prisma.category.count(),
      prisma.product.count({ where: { stock: { lt: 20 } } }),
      prisma.product.findMany({
        take: 5,
        orderBy: { createdAt: "desc" },
        include: { category: true },
      }),
    ])

  const totalStock = await prisma.product.aggregate({
    _sum: { stock: true },
  })

  return {
    totalProducts,
    totalUsers,
    totalCategories,
    lowStockProducts,
    totalStock: totalStock._sum.stock ?? 0,
    recentProducts,
  }
}

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────

export async function createProduct(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const categoryId = formData.get("categoryId") as string
  const stock = parseInt(formData.get("stock") as string) || 0
  const image = (formData.get("image") as string) || "https://picsum.photos/seed/newproduct/800/800"
  const isFeatured = formData.get("isFeatured") === "on"
  const isNew = formData.get("isNew") === "on"

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      stock,
      image,
      images: [image],
      categoryId,
      isFeatured,
      isNew,
    },
  })

  revalidatePath("/admin/products")
  revalidatePath("/catalog")
  revalidatePath("/")
}

export async function updateProduct(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = parseFloat(formData.get("price") as string)
  const categoryId = formData.get("categoryId") as string
  const stock = parseInt(formData.get("stock") as string) || 0
  const image = formData.get("image") as string
  const isFeatured = formData.get("isFeatured") === "on"
  const isNew = formData.get("isNew") === "on"

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/-$/, "")

  await prisma.product.update({
    where: { id },
    data: { name, slug, description, price, categoryId, stock, image, isFeatured, isNew },
  })

  revalidatePath("/admin/products")
  revalidatePath(`/product/${id}`)
  revalidatePath("/")
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } })
  revalidatePath("/admin/products")
  revalidatePath("/")
}

// ─── CATEGORIES ───────────────────────────────────────────────────────────────

export async function createCategory(formData: FormData) {
  const name = formData.get("name") as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

  await prisma.category.create({ data: { name, slug } })
  revalidatePath("/admin/categories")
  revalidatePath("/")
}

export async function renameCategory(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-")

  await prisma.category.update({ where: { id }, data: { name, slug } })
  revalidatePath("/admin/categories")
}

export async function deleteCategory(id: string) {
  // Move products to uncategorised or just delete if none
  const productCount = await prisma.product.count({ where: { categoryId: id } })
  if (productCount > 0) {
    throw new Error(`Cannot delete category: ${productCount} product(s) still assigned to it.`)
  }
  await prisma.category.delete({ where: { id } })
  revalidatePath("/admin/categories")
}

// ─── USERS ────────────────────────────────────────────────────────────────────

export async function updateUserRole(id: string, role: "ADMIN" | "CUSTOMER") {
  await prisma.user.update({ where: { id }, data: { role } })
  revalidatePath("/admin/users")
}

export async function deleteUser(id: string) {
  await prisma.user.delete({ where: { id } })
  revalidatePath("/admin/users")
}
