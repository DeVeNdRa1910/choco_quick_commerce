import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres'
//drizzle ek powerfull orm hai 
/* 
drizzel ko mongoose ki traha treet karo bas antar ye hai ki mongoos se keval mongodb ke liye use hota hai lekin drizzel bhut sare DB k liye use hota hai.
*/

const queryString = process.env.POSTGRES_DB_URI as string;

export const connection = postgres(queryString);
export const db = drizzle(connection)

/* 
varchar me number of words ke likhne ki limit hoti hai lekin text me likhne ki koi line nahi hoti usme ham so many word likh sakte hai
*/



// drizzle docs -> https://drizzle.team/
// github docs -> https://orm.drizzle.team/docs