import { connection, db } from "@/lib/db/db"
import { migrate } from "drizzle-orm/postgres-js/migrator"

// based on file (SQL query) present in drizzel folder(in root) table create in DB(supabase-postgres)
(
  async ()=>{
    await migrate(db, {migrationsFolder: './drizzle'});
    await connection.end();
  }
)()

// "db-run": "node -r esbuild-register ./migrate.ts" 
// create this script in package.json