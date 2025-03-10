import './App.css';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TaskList from './components/TaskList';

function App() {

  return (
    <div className="app_container">
      <Sidebar />
      <div className="main_content">
        <Navbar />
        <TaskList />
      </div>
    </div>
  );
}

export default App
