import "./App.css"
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import {BrowserRouter, Route, Routes} from "react-router-dom";
function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 h-full w-full text-white">
      <BrowserRouter >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}


export default App;