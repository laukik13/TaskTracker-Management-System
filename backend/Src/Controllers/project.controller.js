import { Project } from "../Models/project.model.js";
import { User } from "../Models/user.model.js";
import { AsyncHandler } from "../Utils/asyncHandler.js";

//Admin
const createProject = async (req, res) => {
  //get project details
  //check feild empty
  //check project manager in db
  //check team members in db
  //send data to db
  //return res

  const {
    title,
    description,
    startDate,
    endDate,
    projectManager,
    teamMembers,
  } = req.body;

  try {
    if (req.user.role !== "Admin") {
      return res
        .status(400)
        .json({ message: "Sorry! you cannot create project" });
    }

    // if (
    //   [
    //     title,
    //     description,
    //     startDate,
    //     endDate,
    //     projectManager,
    //     teamMembers,
    //   ].some((field) => field?.trim() === "")
    // ) {
    //   return res.status(400).json({ message: "All fields are Empty" });
    // }

    const projectManagerExists = await User.findById(projectManager);

    if (
      !projectManagerExists ||
      !["Admin", "Project Manager"].includes(projectManagerExists.role)
    ) {
      return res.status(400).json({ message: "Project Manager not Found" });
    }

    for (let membersId of teamMembers) {
      const teamMember = await User.findById(membersId);
      if (!teamMember) {
        return res.status(400).json({ message: "Team Member not Found" });
      }
    }

    const startDateNew = new Date(startDate).toLocaleDateString();
    const endDateNew = new Date(endDate).toLocaleDateString();

    // const project = new Project(req.body);
    // await project.save({ validateBeforeSave: true });

    const project = await Project.create({
      title,
      description,
      projectManager,
      teamMembers,
      startDate: startDateNew,
      endDate: endDateNew,
    });

    if (!project) {
      return res
        .status(400)
        .json({ message: "Somthing Went Wrong While creating Task" });
    }

    return res
      .status(200)
      .json({ data: project, message: "Project Add Successfully" });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

//Admin
const getAllprojectAdmin = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(400).json({ message: "Sorry!!! your Role Not Match" });
    }

    const project = await Project.find()
      .populate("projectManager", "firstName lastName email")
      .populate("teamMembers", "firstName lastName email");
    return res.status(200).json({ data: project });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getAllproject = async (req, res) => {
  try {
    const project = await Project.find({
      $or: [
        {
          projectManager: req.user._id,
        },
        {
          teamMembers: req.user._id,
        },
      ],
    })
      .populate("projectManager", "firstName lastName email")
      .populate("teamMembers", "firstName lastName email");
    return res.status(200).json({ data: project });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

const getProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await Project.findById(projectId)
      .populate("projectManager", "firstName lastName email")
      .populate("teamMembers", "firstName lastName email");
    return res.status(200).json({ data: project });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

//Admin
const updateProject = async (req, res) => {
  const { projectId } = req.params;
  const {
    title,
    description,
    startDate,
    endDate,
    projectManager,
    teamMembers,
    status,
  } = req.body;

  try {
    const project = await Project.findById(projectId);

    if (req.user.role !== "Admin") {
      return res
        .status(400)
        .json({ message: "Sorry!!! You cannot Create project" });
    }

    if (!project) {
      return res.status(400).json({ message: "Project Id is Invalid" });
    }

    if (projectManager) {
      const projectMg = await User.findById(projectManager);

      if (!project || !["Admin", "Project Manager"].includes(projectMg.role)) {
        return res.status(400).json({ message: "Project Manager Not found" });
      }
    }

    if (teamMembers) {
      for (let memberId of teamMembers) {
        const teamMember = await User.findById(memberId);

        if (!teamMember) {
          return res.status(400).json({ message: "Team Member Not found" });
        }
      }
    }

    const startDateNew = new Date(startDate).toLocaleDateString();
    const endDateNew = new Date(endDate).toLocaleDateString();

    const updateProject = await Project.findByIdAndUpdate(
      projectId,
      {
        $set: {
          title,
          description,
          startDate: startDateNew,
          endDate: endDateNew,
          projectManager,
          teamMembers,
          status,
        },
      },
      {
        new: true,
      }
    );

    if (!updateProject) {
      return res
        .status(400)
        .json({ message: "Something Went Wrong While Updating Project" });
    }

    return res
      .status(200)
      .json({ data: updateProject, message: "Project Update Success" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

//Admin
const deleteProject = async (req, res) => {
  const { projectId } = req.params;

  try {
    if (req.user.role !== "Admin") {
      return res
        .status(400)
        .json({ message: "Sorry!!! You cannot Create Task" });
    }

    if (!projectId) {
      return res.status(400).json({ message: "Project Id is Invalid" });
    }

    const existsProject = await Project.findById(projectId);

    if (!existsProject) {
      return res.status(400).json({ message: "Project Not Found" });
    }

    const deleteProject = await Project.findByIdAndDelete(projectId);

    if (!deleteProject) {
      return res
        .status(400)
        .json({ message: "Something Went Wrong While Deleting Project" });
    }

    return res.status(200).json({ message: "Project Deleted Success" });
  } catch (error) {
    return res.status(400).json({ message: error });
  }
};

export {
  createProject,
  getAllproject,
  getProject,
  updateProject,
  deleteProject,
  getAllprojectAdmin,
};
