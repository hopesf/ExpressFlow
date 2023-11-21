import express, { Router } from "express";
import controllers from "./controller";

const router: Router = express.Router();

router.get("/", controllers.main);
router.get("/:id", (req, res) => {
  res.send("list");
});

router.post("/register", controllers.register);
router.post("/unregister", controllers.unregister);
router.post("/enable/:apiName", controllers.enable);
router.all("/:apiName/:path", controllers.redirect);

export default router;
