import app from "./src/app.js";
import connectDB from "./src/config/database.js";

const PORT = process.env.PORT || 3000;

connectDB().then(() => { 
    console.log("Database connected successfully");   
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
})