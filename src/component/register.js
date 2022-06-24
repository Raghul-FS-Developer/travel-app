import React,{useState} from 'react';
import "./register.css"
import {FaMapMarkerAlt} from 'react-icons/fa';
import axios from 'axios';
import {MdCancel} from 'react-icons/md'


function Register({setShowregister,setShowlogin}) {

  const[username,setUsername]=useState('')  
  const[email,setEmail]=useState('')  
  const[password,setPassword]=useState('')  
  const[msg ,setMsg]=useState('')
  const[errmsg ,setErrmsg]=useState('')


let handleSubmit=async(e)=>{
     e.preventDefault()
try {
    let res= await axios.post('https://travel-app-t.herokuapp.com/register',{username:username,email:email,password:password})
   
       if(res.data.statuscode === 400){
    if(res.data.message.keyValue.username){
    
    setErrmsg('*Username already exist')
    }else{
        setErrmsg('*Email already exist')
    }
    }else{
        setMsg('Successfully Registered...you can login now')
        setTimeout(() => {
            setShowregister(false)
            setShowlogin(true)
        }, 2000);
    } 
} catch (error) {
    console.log(error)
}
 }
 
    return (
        <>
    <div className='container'>
    <div className='logo'><FaMapMarkerAlt style={{color:'slateblue'}}/>TravelPin</div>
    
    <form onSubmit={handleSubmit} >
        <div className='forms'>
        <p className='heads'>Username</p>
        <input className='steps' placeholder='username' type='name' minLength={3} maxLength={20} onChange={(e)=>setUsername(e.target.value)} required/>
        <p className='heads'>Email</p>
        <input className='steps' placeholder='email' type='email' onChange={(e)=>setEmail(e.target.value)} required/>
        <p className='heads'>Password</p>
        <input className='steps' maxLength={14} minLength={8} placeholder='password' type='password' onChange={(e)=>setPassword(e.target.value)} required/>
        <button type='submit' className='btnss'>Register</button>
        {msg ? <span className='success'>{msg}</span>: <span className='error'>{errmsg}</span>}
        <MdCancel className='cancel' onClick={()=>setShowregister(false)}/>
        </div>
      
    </form>
   
    
    </div>
     </>
  )
}

export default Register