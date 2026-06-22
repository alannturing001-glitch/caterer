import { db } from "./index";
import { productsTable, categoriesTable, usersTable, menuItemsTable, additionalServicesTable } from "./schema";
import crypto from "crypto";
import { sql } from "drizzle-orm";

async function seed() {
  console.log("🌱 Seeding catering database...");

  // Categories (Event Types) — skip if already exist
  await db.execute(sql`
    INSERT INTO categories (name, slug, icon)
    VALUES
      ('Weddings', 'weddings', '💍'),
      ('Corporate Events', 'corporate', '🏢'),
      ('Birthday Parties', 'birthdays', '🎂'),
      ('Outdoor BBQ', 'bbq', '🍖'),
      ('Cocktail Receptions', 'cocktail', '🥂'),
      ('Gala Dinners', 'gala', '🍽️')
    ON CONFLICT (slug) DO UPDATE SET icon = EXCLUDED.icon
  `);
  console.log("✓ Upserted event types");

  // Packages — skip if already exist
  await db.execute(sql`
    INSERT INTO products (title, slug, description, price, price_per_person, min_guests, max_guests, duration, category, in_stock, stock)
    VALUES
      ('Elegant Wedding Buffet', 'elegant-wedding-buffet', 'A luxurious wedding buffet featuring 5 courses with premium proteins, seasonal sides, and a dessert station. Includes professional wait staff and full setup/cleanup.', 5000, 85, 50, 300, '6 hours', 'Weddings', 1, 100),
      ('Garden Wedding Package', 'garden-wedding-package', 'Romantic outdoor wedding catering with a farm-to-table menu. Features seasonal local produce, floral food stations, and artisan dessert table.', 7500, 120, 80, 200, '8 hours', 'Weddings', 1, 100),
      ('Corporate Lunch Box', 'corporate-lunch-box', 'Professional individual lunch boxes for corporate meetings and seminars. Includes sandwich, salad, snack, and beverage per person.', 1500, 22, 20, 500, '2 hours', 'Corporate Events', 1, 100),
      ('Executive Boardroom Catering', 'executive-boardroom', 'Premium boardroom catering for high-profile executive meetings. Includes morning pastries, hot lunch buffet, afternoon snacks, and continuous refreshments.', 3000, 65, 10, 50, 'Full day', 'Corporate Events', 1, 100),
      ('Birthday Fiesta Package', 'birthday-fiesta', 'Festive birthday party catering with colorful food stations, themed dessert table, and interactive food bars. Kids and adults will love it!', 2000, 45, 20, 150, '4 hours', 'Birthday Parties', 1, 100),
      ('Classic BBQ Cookout', 'classic-bbq-cookout', 'Authentic outdoor BBQ experience with slow-smoked meats, classic sides, and cold beverages. Includes on-site pitmaster and all serving equipment.', 1800, 35, 30, 300, '5 hours', 'Outdoor BBQ', 1, 100),
      ('Champagne Cocktail Reception', 'champagne-cocktail-reception', 'Sophisticated cocktail reception with canapés, hors d oeuvres, charcuterie boards, and a champagne tower. Perfect for launches, galas, and networking events.', 4500, 75, 40, 250, '3 hours', 'Cocktail Receptions', 1, 100),
      ('Black-Tie Gala Dinner', 'black-tie-gala-dinner', 'Full plated 5-course gala dinner with sommelier wine pairings. Includes table decor coordination, white glove service, and a live cooking station.', 15000, 145, 60, 400, '5 hours', 'Gala Dinners', 1, 100)
    ON CONFLICT (slug) DO NOTHING
  `);
  console.log("✓ Seeded packages");

  // Seed menu items for Elegant Wedding Buffet
  const result = await db.execute(sql`SELECT id FROM products WHERE slug = 'elegant-wedding-buffet' LIMIT 1`);
  const packageId = (result.rows[0] as any)?.id;
  if (packageId) {
    await db.execute(sql`
      INSERT INTO menu_items (name, category, price_per_person, package_id)
      VALUES
        ('Herb-Crusted Beef Tenderloin', 'Main Course', 0, ${packageId}),
        ('Pan-Seared Salmon', 'Main Course', 0, ${packageId}),
        ('Roasted Seasonal Vegetables', 'Sides', 0, ${packageId}),
        ('Gourmet Cheese & Charcuterie Board', 'Starters', 0, ${packageId}),
        ('Wedding Cake (3-tier)', 'Desserts', 12, ${packageId})
      ON CONFLICT DO NOTHING
    `);
    console.log("✓ Seeded menu items");
  }

  // Additional Services
  await db.execute(sql`
    INSERT INTO additional_services (name, description, price, price_type)
    VALUES
      ('Professional Wait Staff', 'Uniformed wait staff for your event', 250, 'per_unit'),
      ('Bar Setup & Bartender', 'Full bar setup with one professional bartender', 500, 'flat'),
      ('Tent & Outdoor Setup', 'Weather-proof tent and outdoor furniture', 1200, 'flat'),
      ('Custom Wedding Cake', '3-tier custom decorated wedding cake', 800, 'flat'),
      ('Premium Audio/Visual', 'Sound system and screen for presentations', 400, 'flat')
    ON CONFLICT DO NOTHING
  `);
  console.log("✓ Seeded additional services");

  // Admin user
  const hash = crypto.createHash("sha256").update("Admin1234!").digest("hex");
  await db.execute(sql`
    INSERT INTO users (email, password, role)
    VALUES ('admin@catermarket.com', ${hash}, 'admin')
    ON CONFLICT (email) DO NOTHING
  `);
  console.log("✓ Admin user: admin@catermarket.com / Admin1234!");

  console.log("✅ Seeding complete!");
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
