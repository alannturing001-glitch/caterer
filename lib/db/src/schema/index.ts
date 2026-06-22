import { pgTable, text, serial, integer, doublePrecision, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  price: doublePrecision("price").notNull(),
  pricePerPerson: doublePrecision("price_per_person"),
  minGuests: integer("min_guests").default(10),
  maxGuests: integer("max_guests").default(500),
  duration: text("duration"),
  mainImage: text("main_image"),
  slug: text("slug").notNull().unique(),
  inStock: integer("in_stock").notNull().default(1),
  stock: integer("stock").notNull().default(100),
  description: text("description"),
  manufacturer: text("manufacturer"),
  category: text("category"),
  // Package builder extensions
  pricingModel: text("pricing_model").default("dynamic"),
  serviceFee: doublePrecision("service_fee").default(0),
  deliveryFee: doublePrecision("delivery_fee").default(0),
  packageSections: jsonb("package_sections").default([]),
  customizationRules: jsonb("customization_rules").default({}),
  availableLocations: text("available_locations"),
  bookingNotice: text("booking_notice"),
  maxEventsPerDay: integer("max_events_per_day").default(5),
  createdAt: timestamp("created_at").defaultNow(),
});

export const categoriesTable = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("user"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const ordersTable = pgTable("orders", {
  id: serial("id").primaryKey(),
  email: text("email"),
  name: text("name"),
  phone: text("phone"),
  eventDate: text("event_date"),
  eventLocation: text("event_location"),
  guestCount: integer("guest_count"),
  message: text("message"),
  total: doublePrecision("total"),
  status: text("status").notNull().default("pending"),
  products: jsonb("products"),
  selectedMenuItems: jsonb("selected_menu_items"),
  selectedServices: jsonb("selected_services"),
  address: text("address"),
  city: text("city"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const wishlistTable = pgTable("wishlist", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id),
  productId: integer("product_id").references(() => productsTable.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const menuItemsTable = pgTable("menu_items", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category"),
  packageId: integer("package_id").references(() => productsTable.id),
  // Pricing
  pricePerPerson: doublePrecision("price_per_person").notNull().default(0),
  baseCost: doublePrecision("base_cost").default(0),
  sellingPrice: doublePrecision("selling_price").default(0),
  // Availability & details
  available: integer("available").default(1),
  preparationTime: text("preparation_time"),
  servingSize: text("serving_size"),
  minimumQuantity: integer("minimum_quantity").default(1),
  // Dietary flags as jsonb array of strings
  dietary: jsonb("dietary").default([]),
  // Images as jsonb array of strings
  images: jsonb("images").default([]),
  createdAt: timestamp("created_at").defaultNow(),
});

export const additionalServicesTable = pgTable("additional_services", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
  price: doublePrecision("price").notNull().default(0),
  priceType: text("price_type").notNull().default("flat"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true, createdAt: true });
export const insertCategorySchema = createInsertSchema(categoriesTable).omit({ id: true, createdAt: true });
export const insertUserSchema = createInsertSchema(usersTable).omit({ id: true, createdAt: true });
export const insertOrderSchema = createInsertSchema(ordersTable).omit({ id: true, createdAt: true });
export const insertMenuItemSchema = createInsertSchema(menuItemsTable).omit({ id: true, createdAt: true });
export const insertAdditionalServiceSchema = createInsertSchema(additionalServicesTable).omit({ id: true, createdAt: true });

export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type Category = typeof categoriesTable.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
export type InsertOrder = z.infer<typeof insertOrderSchema>;
export type Order = typeof ordersTable.$inferSelect;
export type MenuItem = typeof menuItemsTable.$inferSelect;
export type AdditionalService = typeof additionalServicesTable.$inferSelect;
