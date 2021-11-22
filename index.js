const express = require("express")
const cors = require("cors");
const app = express();
const port = process.env.PORT;

require("./src/db/mongoose");
const pollRouter = require("./src/routers/pollRouter");


app.use(cors());
app.use(express.json());
app.use(pollRouter);

app.listen(port, ()=>{
    console.log(`Server connected: ${port}`)
})