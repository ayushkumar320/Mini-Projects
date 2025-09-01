import express from "express";

import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());


app.get("/sum", function(req, res) {
  const {a, b} = req.query;
  const result = parseInt(a) + parseInt(b);
  res.status(200).send(`The sum of ${a} and ${b} is ${result}`);
});

app.listen(3000, function() {
  console.log("Server is running on port 3000");
});