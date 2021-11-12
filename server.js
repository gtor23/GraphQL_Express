//configure port for teh server
const PORT = 5000;

//require express to be used
const express = require('express');
//call the genereated app by express as server
const server = express();

//start the server
server.listen(PORT, () => console.log('Server Running on', PORT));