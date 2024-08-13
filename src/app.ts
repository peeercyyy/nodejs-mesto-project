import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import cardRouter from "./routes/cards";
import userRouter from "./routes/users";

const app = express();

mongoose.connect("mongodb://localhost:27017/mestodb");

app.use(express.json());
app.use((req: Request, res: Response, next: NextFunction) => {
  // TODO: Временная авторизация
  // @ts-ignore
  req.user = {
    _id: "66ba207febd9f178335d5264",
  };

  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.listen(3000, () => {
  console.log("listening in port 3000");
});
