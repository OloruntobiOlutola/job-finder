import express, { Express, Request, Response } from "express";

const app: Express = express();

app.get("/users", (req: Request, res: Response) => {
  res.status(200).json([
    {
      name: "Bola",
      dob: "17 december",
      age: 45,
      address: "Shina bola close",
    },
  ]);
});

export default app;
