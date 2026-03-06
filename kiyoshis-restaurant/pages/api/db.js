import postgres from 'postgres'

console.log(process.env.DBNAME);
const DATABASE_URL= `postgres://${process.env.DBUSER}:${process.env.DBPASSWORD}@${process.env.DBURL}:${process.env.DBPORT}/${process.env.DBNAME}`;
const sql = postgres(DATABASE_URL, {
  max: 10, // connection pool size
})
export default sql
