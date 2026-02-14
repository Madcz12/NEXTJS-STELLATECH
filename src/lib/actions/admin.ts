"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

export async function createProduct(formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const price = parseFloat(formData.get("price") as string)
    const category = formData.get("category") as string
    const stock = parseInt(formData.get("stock") as string) || 0
    const image = formData.get("image") as string || "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800"

    // Generate slug from name
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

    // Find or create category
    let categoryRecord = await prisma.category.findUnique({
      where: { slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-') }
    })

    if (!categoryRecord) {
      categoryRecord = await prisma.category.create({
        data: {
          name: category,
          slug: category.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        }
      })
    }

    // Create product
    await prisma.product.create({
      data: {
        name,
        slug,
        description,
        price,
        stock,
        image,
        images: [image],
        categoryId: categoryRecord.id,
        isNew: true,
      }
    })

    revalidatePath('/admin/products')
    revalidatePath('/catalog')
    revalidatePath('/')
  } catch (error) {
    console.error('Error creating product:', error)
    throw new Error('Failed to create product')
  }

  redirect('/admin/products')
}
