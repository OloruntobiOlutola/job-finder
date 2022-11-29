import app from "./index";
import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";

const { DB_URL, PORT } = process.env;

const port = PORT || 3000;

mongoose
  // @ts-ignore
  .connect(DB_URL, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("connected to Db"))
  .catch((err) => console.log(err));

app.listen(port, () => console.log(`Server is running at ${port}`));
