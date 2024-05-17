import { Router } from "express";
import { verifyJwt } from "../Middleware/auth.middleware.js";
import { getAllPendingTask } from "../Controllers/pendingTask.controller.js";

// async function routes(fastify) {
//   fastify.post("/createProject",{verifyJwt},createProject);
//   fastify.get("/getAllProject",{verifyJwt}, getAllproject);
//   fastify.get("/getAllProjectforAdmin",{option:{ preHandler :verifyJwt}}, getAllprojectAdmin);
//   fastify.get("/getProject/:projectId",{verifyJwt}, getProject);
//   fastify.patch("/updateProject/:projectId",{verifyJwt}, updateProject);
//   fastify.delete("/deleteProject/:projectId",{verifyJwt}, deleteProject);
// }


const router = Router();

// router.route("/createProject").post(verifyJwt,createProject);
// router.route("/getAllProject").get(verifyJwt, getAllproject);
// router.route("/getAllProjectforAdmin").get(getAllprojectAdmin);
// router.route("/getProject/:projectId").get(verifyJwt,getProject);
// router.route("/updateProject/:projectId").patch(verifyJwt,updateProject);
// router.route("/deleteProject/:projectId").delete(verifyJwt,deleteProject);

router.route("/getAllPendingTask").get(verifyJwt,getAllPendingTask);

export default router ;
