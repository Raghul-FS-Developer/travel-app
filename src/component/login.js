import React,{useState} from 'react';
import "./register.css"
import {FaMapMarkerAlt} from 'react-icons/fa';
import axios from 'axios';
import {MdCancel} from 'react-icons/md'


function Login({setShowlogin,myStorage,setCurrentuser}) {

  const[username,setUsername]=useState('')  
  
  const[password,setPassword]=useState('')  
  const[msg ,setMsg]=useState('')



 let handleSubmit=async(e)=>{
     e.preventDefault()
try {
    
    let res= await axios.post('/login',{username:username,password:password});
    if(res.data.statuscode === 200){
    myStorage.setItem('user' ,res.data.username);
    setShowlogin(false)
    setCurrentuser(res.data.username); 
    }else{
        setMsg(res.data.message)
    }
    
     
  } catch (error) {
    console.log(error)
}
 }
 
    return (
        <>
    <div className='container1'>
    <div className='logo'><FaMapMarkerAlt style={{color:'slateblue'}}/>TravelPin</div>
    
    <form onSubmit={handleSubmit} >
        <div className='forms'>
        <p className='heads'>Username</p>
        <input className='steps' placeholder='username' type='name' minLength={3} maxLength={20} onChange={(e)=>setUsername(e.target.value)} required/>
        
        <p className='heads'>Password</p>
        <input className='steps' maxLength={14} minLength={8} placeholder='password' type='password' onChange={(e)=>setPassword(e.target.value)} required/>
        <button type='submit' className='btnss'>Login</button>
        <span className='error'>{msg}</span>
        <MdCancel className='cancel' onClick={()=>setShowlogin(false)}/>
        </div>
      
    </form>
   
    
    </div>
     </>
  )
}

export default Login