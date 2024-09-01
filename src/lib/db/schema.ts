import { sql } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

//ye basically data ka model creation hai mongoDB ke terme me
// migration supabase ke andar jo database hai(postgreSQL) usme ye table create karega

export const users = pgTable("users",{
  id: serial("id").primaryKey(),
  fname: varchar("fname", {length:100}).notNull(),
  lname: varchar("lname", {length: 100}).notNull(),
  email: varchar("email", {length: 100}).unique(),
  provider: varchar("provider", {length: 100}),
  externalId: varchar("external_id", {length: 100}).notNull(),
  image: text("image"),
  role: varchar("role", {length: 12}).notNull().default("customer"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
})

export const product = pgTable("products",{
  id: serial("id").primaryKey(),
  name: varchar("fname", {length:100}).notNull(),
  image: text("image"),
  description: text("description"),
  price: integer("price").notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
})

//"db-generate": "drizzle-kit generate --config=drizzle.config.ts" create this scrit in packag.json

// in schema se migrate script create hoti(SQL query) hai in drizzel folder