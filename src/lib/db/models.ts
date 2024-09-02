import { sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

//ye basically data ka model creation hai mongoDB ke terme me
// migration supabase ke andar jo database hai(postgreSQL) usme ye table create karega

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  fname: varchar("fname", { length: 100 }).notNull(),
  lname: varchar("lname", { length: 100 }).notNull(),
  email: varchar("email", { length: 100 }).unique(),
  provider: varchar("provider", { length: 100 }),
  externalId: varchar("external_id", { length: 100 }).notNull(),
  image: text("image"),
  role: varchar("role", { length: 12 }).notNull().default("customer"),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const product = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("fname", { length: 100 }).notNull(),
  image: text("image"),
  description: text("description"),
  price: integer("price").notNull(),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

//adding index on pincode ,bcz it will search manytime
export const warehouses = pgTable(
  "warehouses",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }).notNull(),
    pincode: varchar("pincode", { length: 6 }).notNull(),
    updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
    createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => {
    return {
      pincodeIdx: index("pincode_idx").on(table.pincode),
    };
  }
);

export const orders = pgTable("Orders", {
  id: serial("id").primaryKey(),
});

export const deliveriPersons = pgTable("Delivery_persons", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 13 }).notNull(),
  warehouseId: integer("warehouse_id").references(
    () => {
      // kis table ki konsi field ko forein key banana hai
      return warehouses.id;
      // onDelete-> yadi warehiuse delete hi jaye to delivery person ka kya karna hai, cascade ka matlab delivery_persons ko bhi detach kar dena
    },
    { onDelete: "cascade" }
  ),
  orderId: integer("order_id").references(
    () => {
      return orders.id;
      // order delete delete hone pr delivey_person ko job se nahi nikalna hai isiliye cascade nahi kar sakte hai , setnull-> orderId null hoi jayegi
    },
    { onDelete: "set null" }
  ),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const inventories = pgTable("inventories", {
  id: serial("id").primaryKey(),
  sku: varchar("name", { length: 8 }).unique().notNull(),
  orderId: integer("order_id").references(() => orders.id, {
    onDelete: "set null",
  }),
  warehouseId: integer("warehouse_id").references(() => warehouses.id, {
    onDelete: "cascade",
  }),
  productId: integer("product_id").references(() => product.id, {
    onDelete: "cascade",
  }),
  updatedAt: timestamp("updated_at").default(sql`CURRENT_TIMESTAMP`),
  createdAt: timestamp("created_at").default(sql`CURRENT_TIMESTAMP`),
});

//"db-generate": "drizzle-kit generate --config=drizzle.config.ts" create this scrit in packag.json
// in schema se migrate script create hoti(SQL query) hai in drizzel folder
