const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error']
})

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany()
  await prisma.order.deleteMany()
  await prisma.review.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  console.log('Cleaned database')

  // Create Categories
  await Promise.all([
    prisma.category.create({ data: { name: 'Laptops', slug: 'laptops' } }),
    prisma.category.create({ data: { name: 'Peripherals', slug: 'peripherals' } }),
    prisma.category.create({ data: { name: 'Components', slug: 'components' } }),
    prisma.category.create({ data: { name: 'Monitors', slug: 'monitors' } }),
    prisma.category.create({ data: { name: 'Accessories', slug: 'accessories' } }),
  ])

  console.log('Database seeded with categories!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
