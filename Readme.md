# My Task Tracker

My Task Tracker is a robust task management application designed to streamline project workflows and enhance productivity. Developed with a modern tech stack, the frontend is built using React.js with Bootstrap 5 for a sleek and responsive user interface, while the backend is powered by Node.js and Express.js. MongoDB serves as the database to efficiently manage and store user data and tasks.

## Key Features

1. **User Authentication and Roles:**
   - **User Authentication:** Secure login and registration system for users.
   - **Roles:** Three distinct roles - User, Project Manager, and Admin, each with specific permissions and access levels.

2. **Task Management:**
   - **Today's Tasks:** Users can view tasks scheduled for the current day.
   - **Pending Tasks:** Track tasks that are yet to be completed.
   - **Completed Tasks:** Keep a record of tasks that have been finished.

3. **Project Involvement:**
   - **Involved Projects:** View and manage the projects in which a user is involved.
   - **Comments:** Users can add comments to tasks and projects to facilitate communication and collaboration.

4. **Admin Dashboard:**
   - **Member Management:** Admins can view, edit, and delete user profiles.
   - **Project and Task Oversight:** Admins have an overarching view of all projects and tasks, enabling them to monitor progress and manage resources effectively.

## Technologies Used

- **Frontend:** 
  - React.js for building interactive and dynamic user interfaces.
  - Bootstrap 5 for styling and responsive design.

- **Backend:**
  - Node.js for scalable server-side application development.
  - Express.js for creating a robust API to handle client requests.

- **Database:**
  - MongoDB for flexible and scalable data storage, ensuring efficient data retrieval and management.

## User Experience

Upon logging in, users are greeted with a personalized dashboard displaying their tasks for the day, pending tasks, completed tasks, and projects they are involved in. Project managers can assign tasks, track project progress, and facilitate team collaboration through comments. The admin dashboard provides comprehensive control over user management, enabling admins to maintain an organized and efficient user base.

My Task Tracker is designed to enhance productivity, improve project management efficiency, and provide a seamless user experience through its intuitive interface and powerful backend infrastructure. Whether you're managing personal tasks or leading a team project, My Task Tracker is your go-to solution for efficient task and project management.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/your_username/my-task-tracker.git


2. Install NPM packages

    cd my-task-tracker
    npm install

3. Set up your MongoDB database and add your MongoDB URI to the '.env' file

    MONGO_URI=your_mongo_uri


### Running the Application

1. Start the backend server

   npm run server


2. Start the frontend development server

    npm start

## Usage

Open http://localhost:3000 to view it in the browser.