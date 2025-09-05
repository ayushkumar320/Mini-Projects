import "./App.css"
import Register from "./components/Register";
import Login from "./components/Login";
import {BrowserRouter, Route, Routes} from "react-router-dom";
function App() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 h-full w-full">
      <BrowserRouter>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}


export default App;