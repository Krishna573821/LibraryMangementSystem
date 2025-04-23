import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDb from './database/connectDb.js';
import userRoutes from './routes/user.routes.js';
import bookRoutes from "./routes/book.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import membershipRoutes from "./routes/membership.route.js";
import transactionRoutes from "./routes/transaction.route.js";

dotenv.config();

const app = express(); 



const PORT = process.env.PORT || 5000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => { 
  res.send('Server is running...');
})

app.use('/api/users', userRoutes);
app.use("/api/books", bookRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/memberships", membershipRoutes);
app.use("/api/transactions", transactionRoutes);


app.listen(PORT, () => { 
  console.log("Trying to connect to MongoDB...");
  connectDb();
  console.log(`Server is running on http://localhost:${PORT}`);
 })