import "./Home.css";
import {useNavigate} from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full px-4 sm:px-0">
      <div className="bg-gray-700 rounded-lg shadow-2xl p-6 sm:p-10 m-4 sm:m-12 w-full max-w-md text-white text-center space-y-4">
        <h1 className="text-2xl sm:text-4xl font-bold">To-Do List</h1>
        <p className="text-lg sm:text-xl mt-2 sm:mt-4">
          Welcome to the To-Do List application!
        </p>
        <p className="text-lg sm:text-xl mt-2 sm:mt-4">
          Please login to access your tasks.
        </p>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-4">
          <button
            className="bg-blue-500 text-white py-2 px-6 rounded hover:cursor-pointer hover:bg-blue-900 w-full sm:w-auto"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
          <button
            className="bg-green-500 text-white py-2 px-6 rounded hover:cursor-pointer hover:bg-green-900 w-full sm:w-auto"
            onClick={() => navigate("/register")}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}

export default Home;
