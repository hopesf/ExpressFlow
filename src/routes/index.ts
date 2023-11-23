import express, { Request, Response, Router } from "express";
import controllers from "./controller";
import { ApiRobots, ApiServices } from "../models";

const router: Router = express.Router();

router.get("/", controllers.main);

// this router should be update robot status for manage robots
router.post("/changeRobotStatus", async (req: Request, res: Response) => {
    const body = req.body;
    if (!body) return res.status(400).json({ message: "body is required" });
    if (!body.name) return res.status(400).json({ message: "name is required" });
    if (!body.status) return res.status(400).json({ message: "status is required" });
    if (!body.merchant) return res.status(400).json({ message: "merchant is required" });
  
    const { name, status, merchant } = body;
  
    ApiRobots.updateOne({ name, merchant }, { $set: { status: status === "on" ? "off" : "on" } }, { upsert: true })
      .then(() => res.json({ message: "success" }))
      .catch((err) => res.status(400).json({ message: err }));
  });
  
// this router should be update service status for manage services inside of instances
router.post("/changeServiceInstanceStatus", async (req: Request, res: Response) => {
  const body = req.body;
  if (!body) return res.status(400).json({ message: "body is required" });

  const { serviceName, instanceUrl, newStatus } = body;

  ApiServices.updateOne({ name: serviceName, "instances.url": instanceUrl }, { $set: { "instances.$.enabled": newStatus } }, { upsert: true })
    .then(() => res.json({ message: "success" }))
    .catch((err) => res.status(400).json({ message: err }));
});
  

router.post("/register", controllers.register);
router.post("/unregister", controllers.unregister);
router.post("/enable/:apiName", controllers.enable);
router.all("/:apiName/:path", controllers.redirect);

export default router;
