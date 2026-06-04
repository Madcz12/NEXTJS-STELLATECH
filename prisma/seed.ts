import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import "dotenv/config";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({
  adapter,
  log: ["info", "warn", "error"],
});

async function main() {
  // Clean existing data
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.review.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();

  console.log("Cleaned database");

  // Create Categories
  const laptops = await prisma.category.create({ data: { name: "Laptops", slug: "laptops" } });
  const peripherals = await prisma.category.create({ data: { name: "Peripherals", slug: "peripherals" } });
  const components = await prisma.category.create({ data: { name: "Components", slug: "components" } });
  const monitors = await prisma.category.create({ data: { name: "Monitors", slug: "monitors" } });
  const accessories = await prisma.category.create({ data: { name: "Accessories", slug: "accessories" } });

  console.log("Categories created");

  const productsData = [
    // Laptops
    { name: "Stella Book Pro 16", price: 2499.99, categoryId: laptops.id, description: "M3 Max equivalent power." },
    { name: "Stella Air 13", price: 1099.99, categoryId: laptops.id, description: "Thin and light powerhouse." },
    { name: "Zenith Gaming G15", price: 1599.99, categoryId: laptops.id, description: "RTX 4070, 16GB RAM." },
    { name: "Workstation X-Prime", price: 3200.0, categoryId: laptops.id, description: "Pro-grade graphics and storage." },
    { name: "LitePad V2", price: 549.99, categoryId: laptops.id, description: "Affordable everyday laptop." },
    { name: "UltraFlow 14", price: 1899.99, categoryId: laptops.id, description: "Long battery life for pros." },
    { name: "Glider X-S8", price: 1299.99, categoryId: laptops.id, description: "Futuristic design, OLED screen." },
    { name: "Titan G-Pro", price: 2899.99, categoryId: laptops.id, description: "The ultimate desktop replacement." },
    { name: "Vision Book 15", price: 1450.0, categoryId: laptops.id, description: "Perfect for creators." },
    { name: "StudentBook SE", price: 449.99, categoryId: laptops.id, description: "Essential for school." },

    // Peripherals
    { name: "Stella Mouse X", price: 89.99, categoryId: peripherals.id, description: "Precision gaming mouse." },
    { name: "Mechanical Key-G1", price: 129.99, categoryId: peripherals.id, description: "RGB Mechanical keyboard." },
    { name: "Wireless Pro Click", price: 59.99, categoryId: peripherals.id, description: "Ergonomic office mouse." },
    { name: "HD Stream Cam Pro", price: 149.99, categoryId: peripherals.id, description: "4K Ultra HD webcam." },
    { name: "Studio Mic Z1", price: 199.99, categoryId: peripherals.id, description: "XLR condenser microphone." },
    { name: "Gaming Headset Alpha", price: 119.99, categoryId: peripherals.id, description: "7.1 Surround sound." },
    { name: "Macro Pad M9", price: 45.0, categoryId: peripherals.id, description: "Customizable shortcut pad." },
    { name: "Touchpad Elite", price: 79.99, categoryId: peripherals.id, description: "Multi-touch gesture pad." },
    { name: "Bluetooth SoundBar", price: 89.99, categoryId: peripherals.id, description: "Compact desk audio." },
    { name: "Pro Drawing Tablet", price: 349.99, categoryId: peripherals.id, description: "8192 levels of pressure." },

    // Components
    { name: "Nvidia RTX 5090 (Mock)", price: 1999.99, categoryId: components.id, description: "Extreme performance GPU." },
    { name: "AMD Ryzen 9 9950X", price: 649.99, categoryId: components.id, description: "Monster 16-core CPU." },
    { name: "Corsair Vengeance 64GB DDR5", price: 259.99, categoryId: components.id, description: "High-speed RAM kit." },
    { name: "Samsung 990 Pro 2TB", price: 189.99, categoryId: components.id, description: "Lightning fast Gen4 SSD." },
    { name: "ASUS ROG Maximus Z790", price: 499.99, categoryId: components.id, description: "Premium overclocking board." },
    { name: "Noctua NH-D15 G2", price: 119.99, categoryId: components.id, description: "Best-in-class air cooling." },
    { name: "EVGA SuperNOVA 1000W", price: 229.99, categoryId: components.id, description: "Reliable Platinum PSU." },
    { name: "Lian Li O11 Dynamic", price: 169.99, categoryId: components.id, description: "Iconic panoramic PC case." },
    { name: "Seagate IronWolf 12TB", price: 299.99, categoryId: components.id, description: "Reliable NAS storage." },
    { name: "Thermal Paste X-9", price: 15.0, categoryId: components.id, description: "High conductivity paste." },

    // Monitors
    { name: "Stella Vision 34\" UW", price: 799.99, categoryId: monitors.id, description: "Curved ultrawide display." },
    { name: "Nano IPS 27\" 144Hz", price: 449.99, categoryId: monitors.id, description: "Vivid gaming visuals." },
    { name: "4K ProArt 32\"", price: 1299.99, categoryId: monitors.id, description: "Accurate colors for designers." },
    { name: "OLED G8 34\"", price: 999.99, categoryId: monitors.id, description: "Infinite contrast, 0.03ms." },
    { name: "Triple Monitor Mount", price: 129.99, categoryId: monitors.id, description: "Heavy-duty steel arm." },
    { name: "Portable 15\" Monitor", price: 199.99, categoryId: monitors.id, description: "Type-C mobile display." },
    { name: "8K Master Series 40\"", price: 2499.99, categoryId: monitors.id, description: "The peak of pixel density." },
    { name: "Vertical Code Screen 24\"", price: 299.99, categoryId: monitors.id, description: "Optimized for developers." },
    { name: "Curved E-sports 240Hz", price: 399.99, categoryId: monitors.id, description: "Built for speed." },
    { name: "Mini LED TV-Monitor 43\"", price: 849.99, categoryId: monitors.id, description: "Brightness like no other." },

    // Accessories
    { name: "Laptop Sleeve 16\"", price: 35.0, categoryId: accessories.id, description: "Water-resistant padding." },
    { name: "USB-C Hub 10-in-1", price: 69.99, categoryId: accessories.id, description: "Expand your connectivity." },
    { name: "Desk Pad (Stella Grey)", price: 29.99, categoryId: accessories.id, description: "Minimalist felt mat." },
    { name: "Cable Management Kit", price: 25.0, categoryId: accessories.id, description: "Organize your workspace." },
    { name: "Monitor Light Bar", price: 89.99, categoryId: accessories.id, description: "Anti-glare screen lighting." },
    { name: "Ergo Footrest", price: 49.99, categoryId: accessories.id, description: "Relieve posture strain." },
    { name: "Portable Power Bank 30k", price: 99.99, categoryId: accessories.id, description: "Charge anything on the go." },
    { name: "VR Headset Mask", price: 19.99, categoryId: accessories.id, description: "Hygiene for VR users." },
    { name: "CleanKit Pro", price: 15.99, categoryId: accessories.id, description: "Screen and keyboard cleaning." },
    { name: "RGB Light Strips 5M", price: 45.0, categoryId: accessories.id, description: "Style your desk setup." },
  ];

  for (const product of productsData) {
    await prisma.product.create({
      data: {
        ...product,
        slug: product.name
          .toLowerCase()
          .replace(/ /g, "-")
          .replace(/[()"]/g, ""),
        stock: Math.floor(Math.random() * 100) + 10,
        image: `https://picsum.photos/seed/${product.name.replace(
          / /g,
          ""
        )}/800/800`,
        isFeatured: Math.random() > 0.7,
        isNew: Math.random() > 0.8,
      },
    });
  }

  console.log("Database seeded with 50 products successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
