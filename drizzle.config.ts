import {defineConfig} from 'drizzle-kit'

/* 
schema -> data models kaha se milenge
out -> postgreSql ki data table bnane ki query (written through typescript) ko kaha store karna hai
dialect -> konsa DB ham use kar rahe hai
dbCredentials -> DB ki url
kyuki supabase me ham ek se jyada db ko use kar sakte hai like:- PostgreSQL, SQL, mySQL...
*/

// Data model ke table bnane ki SQL query ./drizzle folder me write karne ke liye

export default defineConfig({
  schema: './src/lib/db/models.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.POSTGRES_DB_URI as string
  }
})