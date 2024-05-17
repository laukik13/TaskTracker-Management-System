import { Router } from "express";
import {
  adminOverview,
  createUser,
  deleteUser,
  getAllUser,
  getCurrentUser,
  getUser,
  loginUser,
  logoutUser,
  updateUser,
  updateUserProfile,
} from "../Controllers/user.controller.js";
import { basicAuth, verifyJwt } from "../Middleware/auth.middleware.js";

const router = Router();

router.route("/loginUser").post(loginUser);
router.route("/logoutUser").post(verifyJwt, logoutUser);
router.route("/createUser").post(verifyJwt,createUser);
router.route("/getAllUser").get(verifyJwt,getAllUser);
router.route("/getCurrentUser").get(verifyJwt,getCurrentUser);
router.route("/getUser/:userId").get(verifyJwt,getUser);
router.route("/adminOverview").get(verifyJwt,adminOverview);
router.route("/updateUser/:userId").patch(verifyJwt,updateUser);
router.route("/updateUserProfile/:userId").patch(verifyJwt,updateUserProfile);
router.route("/deleteUser/:userId").delete(verifyJwt,deleteUser);

// async function routes(fastify) {
//   fastify.post("/loginUser", loginUser);
//   fastify.post("/logoutUser", {preHandler: verifyJwt }, logoutUser);
//   fastify.post("/createUser", createUser);
//   fastify.get("/getAllUser",{preHandler: verifyJwt }, getAllUser);
//   fastify.get("/getUser/:userId", { verifyJwt }, getUser);
//   fastify.patch("/updateUser/:userId", { verifyJwt }, updateUser);
//   fastify.delete("/deleteUser/:userId", { verifyJwt }, deleteUser);
// }

export default router;


