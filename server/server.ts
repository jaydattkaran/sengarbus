import app from "./app";

const PORT = process.env.PORT || 5000;

app.listen(5000, "0.0.0.0", () => { 
  console.log(`Server is running on port ${PORT}`)
});
