import mysql from "mysql2";

// Create MySQL connection

//om-database
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysqlpass2005",
  database: "billboard",
});

// Connect to database
connection.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to database:", err.message);
    return;
  }
  console.log("✅ Database connected...");
});

// Export the connection
export default connection;
