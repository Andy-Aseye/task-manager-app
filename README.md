Here is a simple guide to installing and running the Task Manager app:

- First, copy the link from the GitHub clone dropdown:

Run "git clone <link>" in the terminal of your IDE

- Second, run this command "cd taskkit" to enter into the vite react app.

- Third, run "npm install" after the repo has been cloned locally. A node version above "18" would be preferable to avoid version issues.

Running these above commands should get the app running locally. In case of any issues, feel free to contact me at: andyaseye@gmail.com


Overview
I developed TaskKit, a task management application, to provide users with an intuitive interface for organizing and prioritizing their tasks. Drawing inspiration from platforms like ClickUp, I aimed to create a clean and user-friendly design that emphasizes functionality and aesthetics.

Key Features
Sidebar Navigation: Located on the left, the sidebar offers quick access to the application's main sections, ensuring seamless navigation.
Task Area: On the right, users can filter tasks by priority and view a list of tasks tailored to their preferences.
Task Management: Users can add new tasks, edit existing ones, and delete tasks as needed.
Drag-and-Drop Functionality: Tasks can be reordered effortlessly using drag-and-drop interactions, enhancing the user experience.
Design Approach
To achieve a visually pleasing and organized layout:

Component Structure: I structured the application into distinct components: Navbar, Sidebar, TaskList, and TaskItem. This modular approach promotes reusability and simplifies maintenance.
Styling: I utilized modern CSS practices to ensure a clean design. The layout is responsive, adapting to various screen sizes, and incorporates consistent spacing, typography, and color schemes.
Code Structure and State Management
For state management, I leveraged React's Context API. This decision was driven by the need to share state across multiple components without resorting to prop drilling, thereby maintaining a cleaner codebase. 
LEGACY.REACTJS.ORG

TaskContext: Manages the state related to tasks, including adding, updating, deleting, and reordering tasks.
FilterContext: Handles the current filter settings, allowing users to view tasks based on their selected priority.
By organizing the code into these contexts, I ensured that each part of the application has access to the specific state it requires, promoting scalability and maintainability.

Conclusion
TaskKit embodies my commitment to creating efficient and user-centric applications. By focusing on a clear design and effective state management, I aimed to deliver a tool that enhances productivity and provides a seamless user experience.



