import { Comment } from "../Models/comment.model.js";
import { Project } from "../Models/project.model.js";
import { Task } from "../Models/task.model.js";
import { User } from "../Models/user.model.js";
import { AsyncHandler } from "../Utils/asyncHandler.js";


const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);

    if (!user) {
    return reply.status(400).send({ message: "User Id Not Found" });
    }

    const accessToken = user.generateAccessToken();

    const refreshToken = user.generateRefreshToken();

     user.refreshToken = refreshToken;

     await user.save({validateBeforeSave: false});

     return {accessToken , refreshToken}
    
  } catch (error) {
    return reply.status(400).send({ message: error?.message });
  }
};

const loginUser = async (req, res) => {
  
  const { email, password ,role } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
   return res.status(400).json({ message: "User Not Found" });
  }


 if(role !== user.role){
  return res.status(400).json({ message: "Role is Invalid" });
 }


  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
  return res.status(400).json({ message: "Password is Invalid" });
  }

  const {accessToken, refreshToken}= await generateAccessAndRefreshToken(user?._id);


  const loggedIn = await User.findById(user?._id).select(
    "-password -refreshToken"
  );

  if (!loggedIn) {
  return res.status(400).json({ message: "User Not Found" });
  }

  const option = {
    httpOnly: true,
    secure: true,
  };

 return res
    .status(200)
    .cookie("accessToken",accessToken,option)
    .cookie("refreshToken",refreshToken,option)
    .json({
      // data: loggedIn,
      role: loggedIn.role,
      accessToken,
      refreshToken,
      message: "User Login Success",
    });
};

const logoutUser = AsyncHandler(async (req, res) => {

  // console.log(req.user);
  
    await User.findByIdAndUpdate(
      req.user?._id,
      {
        $set: {
          refreshToken: null,
        },
      },
      {
        new: true,
      }
    );
  
    const option = {
      httpOnly: true,
      secure: true,
    };
  
    return (
      res
        .status(200)
        .clearCookie("accessToken",option)
        .clearCookie("refreshToken",option)
        .json({ message: "User Logout Success" })
    );
  });

const createUser = AsyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;

  try {
    
  if(req.user.role !== "Admin"){
    return res.status(400).json({ message: "Sorry!!! You cannot Create Task" });
   }
 
   if (
     [firstName, lastName, email, password].some((field) => field?.trim() === "")
   ) {
     return res.status(400).json({ message: "All Fields Are Empty" });
   }
 
   if (!["Admin", "Project Manager", "Team Member"].includes(role)) {
   return  res.status(400).json({ message: "Role Dose not match" });
   }
 
   const user = await User.create({
     firstName,
     lastName,
     email,
     password,
     role,
   });
 
   if (!user) {
   return  res
       .status(400)
       .json({ message: "Something Went Wrong While Creating User" });
   }
 
   return res.status(200).json({ data: user, message: "User Added success" })
  } catch (error) {
    return res.status(200).json({ message: error.message })
  }

})

const getCurrentUser = AsyncHandler(async (req,res)=>{
  
 try {
  
  const userExists = await User.findById(req.user._id);

  if(!userExists){
    return res.status(200).json({message: "User not Found"})
  }

  const userTask = await Task.find({assignedTo: req.user._id})

  
  if(!userTask){
    return res.status(200).json({message: "Task not Found"})
  }


  const userProject = await Project.find({ teamMembers: req.user._id });

  if(!userProject){
    return res.status(200).json({message: "Project not Found"})
  }


const comments = await Comment.find({commentby: req.user._id});

  if(!comments){
    return res.status(200).json({message: "Comments not Found"})
  }
  

  const user = {
    id: userExists._id,
    firstName: userExists.firstName,
    lastName: userExists.lastName,
    role: userExists.role,
    email: userExists.email,
    phone: userExists.phone || 0,
    taskCount: userTask.length || 0,
    projectCount: userProject.length || 0,
    taskCollaboratorCount: userTask.length || 0,
    projectCollaboratorCount: userTask.length || 0,
    commentsCount: comments.length || 0,
  }


  return res.status(200).json({ data: user, message: "User success" })

 } catch (error) {

  return res.status(200).json({ message: error.message })

 }

});

const getAllUser = async (req, res) => {
  try {
    // console.log(req.user.role);


    // if(req.user.role !== "Admin"){
    //   res.status(400).json({ message: "Sorry!!! You not Admin" });
    // }

    const user = await User.find();

    if (!user) {
      res.status(400).json({ message: "User not Found" });
    }
    
   return res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

const getUser = async (req, res) => {
  const { userId } = req.params;

  try {

    if(req.user.role !== "Admin"){
      res.status(400).json({ message: "Sorry!!! You cannot Create Task" });
    }

    if (!userId) {
      res.status(400).json({ message: "User Id is Invalid" });
    }

    const user = await User.findById(userId);

    if (!user) {
      res.status(400).json({ message: "User not Found" });
    }
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(400).json({ message: "hello" });
  }
};

const updateUserProfile = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email } = req.body;

  try {

    // if(req.user.role !== "Admin" ){
    //   res.status(400).json({ message: "Sorry!!! You cannot Create Task" });
    // }
  

    if (!userId) {
      res.status(400).json("User Id is Invalid");
    }

    const existsuser = await User.findById(userId);

    if (!existsuser) {
      res.status(400).json("User Not Found");
    }

    // if (!["Admin", "Project Manager", "Team Member"].includes(role)) {
    //   res.status(400).json({ message: "Role Dose not match" });
    // }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName,
          lastName,
          email,
          // role,
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      res
        .status(400)
        .json({ message: "Something Went Wrong While Updating Use" });
    }

    res.status(200).json({ data: user, message: "User Update Success" });
  } catch (error) {
    res.status(200).json({ message: error });
  }
};

const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {

    if(req.user.role !== "Admin"){
      res.status(400).json({ message: "Sorry!!! You cannot Delete User" });
    }
  

    if (!userId) {
      reply.status(400).json({ message: "User Id is Invalid" });
    }

    const existsUser = await User.findById(userId);

    if (!existsUser) {
      res.status(400).json({ message: "User not Found" });
    }

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      res
        .status(400)
        .json({ message: "Something Went Wrong While Deleting User" });
    }

    res.status(200).json({ message: "User Deleted Success" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};


//Admin
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const { firstName, lastName, email , role} = req.body;

  try {

    if(req.user.role !== "Admin" ){
      res.status(400).json({ message: "Sorry!!! You cannot Create Task" });
    }
  

    if (!userId) {
      res.status(400).json("User Id is Invalid");
    }

    const existsuser = await User.findById(userId);

    if (!existsuser) {
      res.status(400).json("User Not Found");
    }

    if (!["Admin", "Project Manager", "Team Member"].includes(role)) {
      res.status(400).json({ message: "Role Dose not match" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          firstName,
          lastName,
          email,
          role,
        },
      },
      {
        new: true,
      }
    );

    if (!user) {
      res
        .status(400)
        .json({ message: "Something Went Wrong While Updating Use" });
    }

    res.status(200).json({ data: user, message: "User Update Success" });
  } catch (error) {
    res.status(400).json({ message: error });
  }
};

//Admin
const adminOverview = AsyncHandler(async(req,res)=>{

try {
  
   if(req.user.role !== "Admin"){
    return res.status(400).json({message: "You cannot access this api"});
   }

   const getUserCount = await User.find();

   if(!getUserCount){
    return res.status(400).json({message: "User Not found"});
   }

   const getTaskCount = await Task.find();

   if(!getTaskCount){
    return res.status(400).json({message: "User Not found"});
   }

   const getProjectCount = await Project.find();

   if(!getProjectCount){
    return res.status(400).json({message: "User Not found"});
   }


   const data = {
      userCount: getUserCount.length,
      taskCount: getTaskCount.length,
      projectCount: getProjectCount.length,
   }

   return res.status(200).json({data: data});

} catch (error) {
  return res.status(400).json({message: error.message});
}


})

export {
  createUser,
  getAllUser,
  getUser,
  updateUser,
  deleteUser,
  loginUser,
  logoutUser,
  getCurrentUser,
  updateUserProfile,
  adminOverview
};

