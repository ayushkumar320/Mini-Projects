import {useRef} from "react";
import axios from "axios";
import "./Register.css";
function Register() {

  // Using useRef to access input values and thus avoid states and re-renders
  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();

  async function sendRegisterRequest() {
    try {
      await axios.post("http://localhost:3000/api/register", {
        name: nameRef.current.value,
        email: emailRef.current.value,
        password: passwordRef.current.value
      });
      // Clear the input from and show success message
      nameRef.current.value = "";
      emailRef.current.value = "";
      passwordRef.current.value = "";
      alert("Registration successful!");
    } catch (err) {
      console.error(err);
    }
  }


  return (
    <div className="flex flex-col items-center justify-center h-90 w-120 rounded-lg shadow-2xl bg-gray-700 p-10 m-12">
      <h1 className="text-white text-2xl p-3">Register Here</h1>
      <input
        className="mb-4 p-2 rounded border-2 text-white border-black bg-gray-800 w-110 hover:bg-gray-700"
        type="text"
        id="name"
        placeholder="Name"
        ref={nameRef}
      />
      <input
        className="mb-4 p-2 rounded border-2 text-white border-black bg-gray-800 w-110 hover:bg-gray-700"
        type="email"
        id="email"
        placeholder="Email"
        ref={emailRef}
      />
      <input
        className="mb-4 p-2 rounded border-2 text-white border-black bg-gray-800 w-110 hover:bg-gray-700"
        type="password"
        id="password"
        placeholder="Password"
        ref={passwordRef}
      />
      <button
        className="bg-blue-500 text-white p-2 rounded hover:cursor-pointer hover:bg-blue-900"
        onClick={sendRegisterRequest}
      >
        Register
      </button>
    </div>
  )
}

export default Register;