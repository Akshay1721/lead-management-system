import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  createLead,
  getLeads,
  getLead,
  updateLead,
  deleteLead
} from "../controllers/leadController.js";

const router = express.Router();

router.use(protect);          // 401 for all below if not authenticated
router.post("/", createLead); // 201 or 409
router.get("/", getLeads);    // 200 with {data,page,limit,total,totalPages}
router.get("/:id", getLead);  // 200/404
router.put("/:id", updateLead);   // 200/404/409
router.delete("/:id", deleteLead); // 200/404

export default router;
