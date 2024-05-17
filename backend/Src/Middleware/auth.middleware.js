import jwt from "jsonwebtoken";
import { User } from "../Models/user.model.js";
import { AsyncHandler } from "../Utils/asyncHandler.js";

const verifyJwt = AsyncHandler(async (req, res, next) => {
  try {
    const token = req.cookies.accessToken || req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      return res.status(400).json({ message: "Unauthorized request" });
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      return res.status(400).json({ message: "Invalid Access Token" });
    }

    req.user = user;
    next();
    
  } catch (error) {
    return res.status(400).json({ message: error?.message });
  }
});

async function basicAuth(req, reply) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    reply.status(400).send({ message: "Unathorization Header" });
  }

  const [authType, authKey] = authHeader.split(" ");

  if (authType !== "Basic") {
    reply.status(401).send({ error: "requires basic auth" });
  }

  const [email, password] = Buffer.from(authKey, "base64")
    .toString("ascii")
    .split(":");

  try {
    const user = await User.findOne({ email });

    if (!user) {
      reply.status(401).send({ error: "User not Found" });
    }

    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      reply.status(401).send({ error: "Password not match" });
    }

    console.log(isPasswordValid);
  } catch (error) {
    reply.status(401).send({ error: "An error occur during authorization" });
  }
}

export { verifyJwt, basicAuth };
