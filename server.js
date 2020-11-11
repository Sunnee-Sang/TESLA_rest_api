const axios = require("axios");
const express = require("express");
const circuitBreaker = require("opossum"); //for circuit breaker
const app = express();  
const port = 3000; 

app.use(express.json()); // for parsing application/json

app.get("/api" , (req,res)=>{
  const breaker = new circuitBreaker(axios.get,{
    timeout: 3000,
    errorThresholdPercentage: 50 
  });
  breaker.fallback(() =>"Sorry, something wrong with GIPHY"); 
  breaker.on('fallback', (result) => res.status(500).json({fallback:result}));
  return breaker.fire(`https://gorest.co.in/public-api/users`)
    .then(res=>{
      res.status(200).json(res.data);
    })
    .catch(err=>{
      res.status(500).json({err})
    })
})

app.listen(port ,()=>{
  console.log(`Server is running on port ${port}`);
})