import {useRef} from "react";
import axios from "axios";
import "./Login.css";

function Login() {
  const emailRef = useRef();
  const passwordRef = useRef();

  async function sendLoginRequest() {
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    try {
      const res = await axios.post("http://localhost:3000/api/login", {
        email,
        password,
      });
      // Send the token to local storage
      localStorage.setItem("token", `Bearer ${res.data.token}`);
      // Clear the input from and show success message
      emailRef.current.value = "";
      passwordRef.current.value = "";
      alert("Login successful!");
    } catch (error) {
      alert("Login failed. Please check your credentials.");
      console.error(error);
    }
  }

  return (
    <div className="flex flex-col items-center justify-center h-90 w-120 rounded-lg shadow-2xl bg-gray-700 p-10 m-12">
      <h1 className="text-white text-2xl p-3">Login</h1>
      <input
        className="mb-4 p-2 rounded border-2 text-white border-black bg-gray-800 w-110 hover:bg-gray-700"
        type="text"
        placeholder="email"
        ref={emailRef}
      />
      <input
        className="mb-4 p-2 rounded border-2 text-white border-black bg-gray-800 w-110 hover:bg-gray-700"
        type="password"
        placeholder="password"
        ref={passwordRef}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded hover:cursor-pointer hover:bg-blue-900"
        onClick={sendLoginRequest}
      >
        Login
      </button>
    </div>
  );
}

export default Login;
