import { Router } from "express";
//aqui se declara el endpoint para visualizacion:
const app = Router();
app.get("/", (req, res) => {
  res.render("home", {});
});
export default app;
