import dotenv from "dotenv";
import { connectDB } from "./Database/db.js";
// import { basicAuth } from "./Middleware/auth.middleware.js";
// import fastify from 'fastify';
// import cookiePlugin from '@fastify/cookie';
// import cors from '@fastify/cors';
import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors'

const app = express();
// const app = fastify();


app.use(express.json());

app.use(cookieParser());

app.use(cors(
  {
  origin: '*',
  credentials: true
}
))

// app.register(cookiePlugin);

// app.register(cors,{
//   origin: '*',
//   credentials: true
// });

//env confg
dotenv.config({ path: "./.env" });


//router
import userRoute from "./routes/user.route.js";
import projectRoute from "./routes/project.route.js";
import taskRoute from "./routes/task.route.js"
import commentRoute from "./routes/comment.route.js"
import pendingTaskRoute from "./routes/pendingTask.route.js"
import completedTaskRoute from "./routes/completedTask.route.js"
import replyRoute from "./routes/reply.route.js"

// app.register(userRoute, { prefix: "/api/v1/users" });
// app.register(projectRoute, { prefix: "/api/v1/projects" });
// app.register(taskRoute, { prefix: "/api/v1/tasks" });
// app.register(commentRoute, { prefix: "/api/v1/comments" });

app.use("/api/v1/users",userRoute);
app.use("/api/v1/projects",projectRoute);
app.use("/api/v1/tasks",taskRoute);
app.use("/api/v1/comments",commentRoute);
app.use("/api/v1/pendingTask",pendingTaskRoute);
app.use("/api/v1/completedTask",completedTaskRoute);
app.use("/api/v1/replys",replyRoute);

//databse
// connectDB()
//   .then(async () => {
//    await app.listen({ port: process.env.PORT || 4000 });
//     app.log.info(`Server is Working on ${app.server.address().port}`);
//   })
//   .catch((error) => {
//     console.error(error);
//   });

connectDB()
.then(async()=>{
  await app.listen(process.env.PORT || 4000,()=>{
    console.log(`Server is working on ${process.env.PORT}`)
  })
})
.catch((error)=>{
  console.log(error)
})



export {app}
