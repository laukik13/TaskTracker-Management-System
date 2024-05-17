import { Router } from "express";
import { createComment, createReply, deleteComment, getAllComment, getComment, updateComment } from "../Controllers/comment.controller.js";
import { verifyJwt } from "../Middleware/auth.middleware.js";


// async function routes(fastify) {
//   fastify.post("/createComment",{verifyJwt}, createComment);
//   fastify.get("/getAllComment",{verifyJwt}, getAllComment);
//   fastify.get("/getComment/:commentId",{verifyJwt}, getComment);
//   fastify.patch("/updateComment/:commentId",{verifyJwt}, updateComment);
//   fastify.delete("/deleteComment/:commentId",{verifyJwt}, deleteComment);
// }


const router = Router();

router.route("/createComment").post(verifyJwt,createComment);
router.route("/getAllComment").get(verifyJwt,getAllComment);
router.route("/getComment/:commentId").get(verifyJwt,getComment);
router.route("/updateComment/:commentId").patch(verifyJwt,updateComment);
router.route("/deleteComment/:commentId").delete(verifyJwt,deleteComment);
router.post("/createReply", verifyJwt, createReply);
// router.post("/addCommentToReply", verifyJwt, addCommentToReply);
// // Route for adding a comment to a reply
// router.post("/reply/:replyId/comment", addCommentToReply);

// // Route for adding a comment to a sub-reply
// router.post("/reply/:replyId/sub-reply/:subReplyId", addCommentToReply);


export default router ;
