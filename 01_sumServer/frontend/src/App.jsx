import "./App.css";
import {useState, useEffect} from "react";

function App() {
  const [a, setA] = useState(0);
  const [b, setB] = useState(0);
  const [result, setResult] = useState("");

  useEffect(() => {
    (async function() {
      const res = await fetch(`http://localhost:3000/sum?a=${a}&b=${b}`);
      const data = await res.text();
      setResult(data);
    })();
  }, [a, b]);

  return (
    <div>
      <input type="text" placeholder="Enter the first number" onChange={(e) => setA(parseInt(e.target.value))}/>
      <input type="text" placeholder="Enter the second number" onChange={(e) => setB(parseInt(e.target.value))}/>
      <button
        onClick={() => document.querySelector(".result").innerHTML=result}
      >Find sum</button>
      <div className="result"></div>
    </div>
  )
}
export default App;