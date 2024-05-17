import { Router } from "express";
import {completedToggle, createTask, deleteTask, getTodaysTask, getTask, startToggle, updateTask, getAllTask } from "../Controllers/task.controller.js";
import { verifyJwt } from "../Middleware/auth.middleware.js";

// async function routes(fastify) {
//   fastify.post("/createTask",{verifyJwt}, createTask);
//   fastify.get("/getTodaysTask",{verifyJwt}, getTodaysTask);
//   fastify.get("/getTask/:taskId",{verifyJwt}, getTask);
//   fastify.patch("/updateTask/:taskId",{verifyJwt}, updateTask);
//   fastify.delete("/deleteTask/:taskId",{verifyJwt}, deleteTask);
//   fastify.get("/completedToggle/:taskId",{verifyJwt}, completedToggle);
//   fastify.get("/startToggle/:taskId",{verifyJwt}, startToggle);

// }


const router = Router();

router.route("/createTask").post(verifyJwt,createTask);
router.route("/getTodaysTask").get(verifyJwt, getTodaysTask);
router.route("/getTask/:taskId").get(verifyJwt,getTask);
router.route("/getAllTask").get(verifyJwt,getAllTask);
router.route("/updateTask/:taskId").patch(verifyJwt,updateTask);
router.route("/deleteTask/:taskId").delete(verifyJwt,deleteTask);
router.route("/completedToggle/:taskId").get(verifyJwt,completedToggle);
router.route("/startToggle/:taskId").get(verifyJwt,startToggle);





export default router;
