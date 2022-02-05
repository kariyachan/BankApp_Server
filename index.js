//import express
const express=require('express')
//import session
const session=require('express-session')
//importing data.service.js
const dataService=require('./services/data.service')
//import JWT
const jwt=require('jsonwebtoken')
//imoprt cors
const cors=require('cors')




//create app using express
const app=express()

//allow resource sharing using cors
app.use(cors({
        origin:'http://localhost:4200',
        credentials:true
}))

//To parse json
app.use(express.json())


//To Generate a session
app.use(session({
   secret:'randomsecretkey',
   resave:false,
   saveUninitialized:false
}))


//Middleware creation - application specific middleware
app.use((req,res,next)=>{
        console.log("Middleware");
        next()
})


//Router specific middleware
const authMiddleware=(req,res,next)=>{ 
        if(!req.session.currentNo)
        {                                       //sep23 52:35
          const result=({    //converting into json
            statusCode:401,
            status:false,
            message:"Please Login"
        })
        res.status(result.statusCode).json(result)
        }else{
                next()      //sep23 1:24:25
        }
        
}


//token validation middleware
const jwtMiddleware=(req,res,next)=>{
       try{
        const token=req.headers["x-access-token"]
        const data=jwt.verify(token,'supersecretkey123123')
        req.currentAcc=data.currentNo 
        next()
       }
       catch{
                const result=({
                        
                        statusCode:401,
                        status:false,
                        message:"Please Login"
                })
                res.status(result.statusCode).json(result)
       }
      
}

//jwt token testing api
app.post('/token',jwtMiddleware,(req,res)=>{
        res.send("Current Account Number "+req.currentAcc)
})


//resolving bankapp or  calling register api
app.post('/register',(req,res)=>{
        // console.log(req.body)
        dataService.register(req.body.acno,req.body.uname,req.body.password)
        .then(result=>{
                res.status(result.statusCode).json(result)   //this is asynchronous we cannot asign to a constant
        })
        // res.status(200).send("Success")
})


//login API
app.post('/login',(req,res)=>{
        const result=dataService.login(req.body.acno,req.body.password)
        // res.status(result.statusCode).json(result)  //converting response to json
        .then(result=>{
                res.status(result.statusCode).json(result)   //this is asynchronous we cannot asign to a constant
        })
})


//Deposit API
app.post('/deposit',jwtMiddleware,(req,res)=>{
        console.log(req.body)
        const result=dataService.deposit(req.body.acno,req.body.password,req.body.amount)
        .then(result=>{
                res.status(result.statusCode).json(result) 
        })
})


//Withdraw  API
app.post('/withdraw',jwtMiddleware,(req,res)=>{
        const result=dataService.withdraw(req,req.body.acno,req.body.password,req.body.amount)
        .then(result=>{
                res.status(result.statusCode).json(result) 
        })
})



//Transaction History   API
app.post('/transaction',jwtMiddleware,(req,res)=>{
        const result=dataService.getTransaction(req.body.acno)
        .then(result=>{
                res.status(result.statusCode).json(result) 
        })
})



//Account Delete   API
app.delete('/deleteAcc/:acno',jwtMiddleware,(req,res)=>{
        const result=dataService.deleteAcc(req.params.acno)
        .then(result=>{
                res.status(result.statusCode).json(result) 
        })
})




//Resolving http method
app.get('/',(req,res)=>{
        res.send("Server started at port 3000")
})

app.post('/',(req,res)=>{
        res.send("Server started-post method")
})

app.put('/',(req,res)=>{
        res.send("Server started-used to update completely")
})

app.patch('/',(req,res)=>{
        res.send("Server started-used to update partially")
})

app.delete('/',(req,res)=>{
        res.send("Server started-delete")
})


//to set a port
app.listen(3000,()=>{
        console.log("Server is started at port Number : 3000");
})

