import express, { Express, Request, Response } from "express";
import path from "path";
import * as fs from "fs";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import morgan from "morgan";
import xss from "xss-clean";
import mongoSanitize from "express-mongo-sanitize";

const app: Express = express();

// Middlewares

// body parser
app.use(express.json({ limit: "20kb" }));

// Set security headers
app.use(helmet());

// Cors
const allowedOrigins = ["http://localhost:3000"];

const options: cors.CorsOptions = {
  origin: allowedOrigins,
};

app.use(cors(options));

// Sanitize the data going to the db
app.use(mongoSanitize());

// Sanitize against xss
app.use(xss());

// rate limiting for the same IP address
const limiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 100,
  message:
    "Too many request from the same IP address. Try again in 1 hour time.",
});
app.use("/api", limiter);

// Using Static files
app.use(express.static(`${__dirname}/public`));

// setup the logger
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, "access.log"),
  { flags: "a" }
);

app.use(morgan("combined", { stream: accessLogStream }));

export default app;
