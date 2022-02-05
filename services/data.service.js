//improt db.js
const db=require('./db')



//import JWT
const jwt=require('jsonwebtoken')



let user={
    1000:{uname:"Abijith",acno:1000,password:"userone",balance:5000,transactions:[]}, //transactions empty array
    1001:{uname:"neer",acno:1001,password:"usertwo",balance:5000,transactions:[]},
    1002:{uname:"Laisha",acno:1002,password:"userthree",balance:5000,transactions:[]},
  }

// Register using Mongodb
 const  register=(acno,uname,password)=>{   
   return db.User.findOne({acno})
   .then(user=>{
     if(user){
       return{
            statusCode:400,
            status:false,
            message:("User alreay Exist , Please Login")
       }
     }
    else{
       const newUser=new db.User({
          uname,
          acno,
          password,
          balance:0, 
          transactions:[]
       })
        newUser.save()
        return{
        statusCode:200,
        status:true,
        message:("Sucessfully Registered")
    }
    }
  })
 }



//  const  register=(acno,uname,password)=>{   
//   //  db.User.findOne({acno})
//   //  .then(user=>{
//   //    console.log(user);
//   //  })
//     if(acno in user){
//         return{
//             statusCode:400,
//             status:false,
//             message:("User alreay Exist , Please Login")
//         }
//     }
//     else{
//         user[acno]={
//         uname,
//         acno,
//         password,
//         balance:0,  
//         transactions:[]
//       } 
//       console.log(user)
//       return{
//         statusCode:200,
//         status:true,
//         message:("Sucessfully Registered")
//     }
//     }
//   }

//login from mongodb
const login=(acno,password)=>{
  return db.User.findOne({acno,password})               //Sep 28  1:06:5
  .then(user=>{
    if(user){
      const token=jwt.sign({       
        currentNo:acno
      },'supersecretkey123123')
      return{
          statusCode:200,
          status:true,
          message:("Login Successful"),
          token,
          currentUser:user.uname,
      }
    }
  else{
      return {
          statusCode:400,
          status:false,
          message:("Invalid Acno or Password")
      }
    }

  })
}

  // const login=(acno,password)=>{
  //   if(acno in user){
  //     if(password==user[acno]["password"])
  //     {
  //       currentUser=user[acno]["uname"]
  //       accountNum=acno
  //       // req.session.currentNo=user[acno]

  //       const token=jwt.sign({       //sep24 29:59
  //         currentNo:acno
  //       },'supersecretkey123123')
  //       return{
  //           statusCode:200,
  //           status:true,
  //           message:("Login Successful"),
  //           token  // sending token to the client
  //       }
  //     }
  //     else{
  //       return {
  //           statusCode:400,
  //           status:false,
  //           message:("Invalid Password")
  //       }
  //     }
  //   }
  //   else
  //   {
  //     return{
  //       statusCode:400,
  //       status:false,
  //       message:("Invalid Account Number")
  //   }
  //   }
  // }





  //Deposit Using Mongodb
  const deposit=(acno,password,amount)=>{    //sep 28  1:36:35
    var amt=parseInt(amount)
    return db.User.findOne({acno,password})
    .then(user=>{
      if(!user){
        return{
          statusCode:400,
          status:false,
          message:("Invalid Acno or Password")
        }
      }
      user.balance+=amt
      user.transaction.push({
        amount:amt,
        type:"Credit"
      })
      user.save()
      return{
        statusCode:200,
        status:true,
        message:amt+" Creditted Successfully & Your Balance is "+user.balance,
      }
  })
}
  


  // const deposit=(acno,password,amount)=>{
  //   var amt=parseInt(amount)   //converting string into integer
  
  //   if(acno in user){
  //     if(password==user[acno]["password"])
  //     {
  //       user[acno]["balance"]+=amt
  //       user[acno]["transactions"].push({
  //         amount:amt,
  //         type:"Credit"
  //       })
  //       return{
  //           statusCode:200,
  //           status:true,
  //           message:amt+ " Deposited Successfully & the balance is " +user[acno]["balance"],
  //       }

  //     }
  //     else{
  //       return{
  //           statusCode:400,
  //           status:false,
  //           message:("Invalid Password")
  //       }
  //     }
  //   }
  //   else
  //   {
  //       return{
  //           statusCode:400,
  //           status:false,
  //           message:("Invalid Account Number")
  //       }
  //   } 
  // }

  //Wwithdraw Using mongodb 
  const withdraw=(req,acno,password,amount)=>{    //sep 28  1:36:35
    var amt=parseInt(amount)
    return db.User.findOne({acno,password})
    .then(user=>{
      if(!user){
        return{
          statusCode:400,
          status:false,
          message:("Invalid Acno or Password")
        }
      }
      if(req.currentAcc!=user.acno){  //checking that  is logged acno ,all acno in user can perform operations
        return{
          statusCode:400,
          status:false,                                   //sep 29 35:35
          message:("Operation Denied")  
      }
      }
      if(user.balance<amt)
      {
        return{
          statusCode:400,
          status:false,
          message:("Insufficient Amount")
      }
      }
      user.balance-=amt
      user.transaction.push({
        amount:amt,
        type:"Debit"
      })
      user.save()
      return{
        statusCode:200,
        status:true,
        message:amt+" Debitted Successfully & Your Balance is "+user.balance,
      }
  })
}




  // const withdraw=(wacno,wpswd,wamount)=>{
  //   var amt=parseInt(wamount)
  //   if(wacno in user){
  //     if(wpswd==user[wacno]["password"])
  //     {
  //       if(user[wacno]["balance"]>=amt){
  //         user[wacno]["balance"]-=amt

  //         user[wacno]["transactions"].push({
  //           amount:amt,
  //           type:"Debit"
  //         })
  //         return {
  //             statusCode:200,
  //             status:true,
  //             message:amt+ " Debitted Successfully & the balance is " +user[wacno]["balance"],
  //         }
  //       }else{
  //         return{
  //           statusCode:400,
  //           status:false,
  //           message:("Insufficient Amount")
  //       }
  //       }
  //     }
  //     else{
  //        return{
  //         statusCode:400,
  //         status:false,
  //         message:("Invalid Password")
  //     }
  //     }
  //   }
  //   else
  //   {
  //     return {
  //       statusCode:400,
  //       status:false,
  //       message:("Invalid Account Number")
  //   }
  //   }
  // }

  const getTransaction=(acno)=>{
    return db.User.findOne({acno})
    .then(user=>{
      if(user){
        return {
          statusCode:200,
          status:true,
          transaction:user.transaction
        }
      }
       else{
        return {
          statusCode:400,
          status:false,
          message:"Invalid User"
        }
      }
    })
  }

//Account Delete
const deleteAcc=(acno)=>{
  return db.User.deleteOne({acno})
  .then(user=>{
    if(user){
      return {
        statusCode:200,
        status:true,
        message:"Account Deleted Successfully"
      }
    }else{
      return {
        statusCode:400,
        status:false,
        message:"Invalid User"
      }
    }
  })
}




  module.exports={
      register,
      login,
      deposit,
      withdraw,
      getTransaction,
      deleteAcc
  }