import app from "./src/app.js";
import connectDB from "./src/config/database.js";

// Start the server
const PORT =  3000;

// Connect to the database and then start the server
connectDB().then(() => { 
    console.log("Database connected successfully");   
})

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})