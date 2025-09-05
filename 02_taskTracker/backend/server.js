import router from './routes/routes.js';
import express from 'express';
import dotenv from 'dotenv';
import {connectDB} from './db/connectDB.js';
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use('/api', router);

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
