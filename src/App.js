import { addDoc, collection, doc,onSnapshot, orderBy,query} from 'firebase/firestore';
import { useState } from 'react';
import ImageUploader from './ImageUploader';
import './App.css';

import Posts from './components/posts';
import {db } from './firebse.config';
import { useEffect } from 'react';
import { Avatar, Input } from '@mui/material';
import Button from '@mui/material/Button';
import { confirmPasswordReset, onAuthStateChanged } from 'firebase/auth';
import Modal from '@mui/material/Modal';
import {getAuth,createUserWithEmailAndPassword,updateProfile} from 'firebase/auth'
import { setUserId } from 'firebase/analytics';
import { signOut } from 'firebase/auth';
import {setDoc} from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { signInWithEmailAndPassword } from 'firebase/auth';
function App() {
  const auth = getAuth();
  const [posts,setPosts]  = useState([]);
  const [open, setOpen] = useState(false);
  const [User,setUser] = useState(null)
  const [OpenSignIn,setOpenSignIn] = useState(false);
  const [postflag ,setpostFlag ] = useState(false)
  // const [userdata,setuserdata] = useState({});
const [signupform,setsignUpform] = useState({
  username:'',
  email:'',
  password:'',
})
// console.log(posts);

const {username,password,email}=signupform

  const ref = collection(db,'posts');
  const q = query(ref,orderBy('timestamp','desc'))

  useEffect(()=>{
     onSnapshot(q,(snapshot)=>{
        setPosts(snapshot.docs.map(doc=>({post: doc.data(),id:doc.id})))

     })
  },[]);
  
  useEffect(()=>{
   const unscbscripbe =  onAuthStateChanged(auth,(user)=>{
    // console.log(user)
    // getDoc(doc(db,'users',user.uid)).then(data=>setuserdata(data.data()));
        if(user){
          // console.log('user idf =evkepw : ',user);

        
          setUser(user);
          if(!user.displayName){
              return updateProfile(user,{
                displayName:username,
              })
          }
        }else {
          setUser(null)
        }
    })
    return ()=>{
      unscbscripbe();
    }
  },[username,User])
  // console.log(userdata)
 const handleChange  = (e)=>{
    setsignUpform(pre=>({...pre,[e.target.name]: e.target.value}))
    // console.log(signupform);
 }

  const SignUp = async(e)=>{

   e.preventDefault();
   try{
const auth = getAuth();
const usercredential = await createUserWithEmailAndPassword(auth,email,password);
  const user = usercredential.user;
  updateProfile(auth.currentUser,{
    displayName:username,
  })
  setOpen(false);
  const formDataCopy = {...signupform}
  delete formDataCopy.password;
  formDataCopy.timestamp  = serverTimestamp()

  await setDoc(doc(db,'users',user.uid),formDataCopy);

}catch(e){console.log(e)}
// const user = usercredential.user;

// console.log("this is null ",auth)
// console.log(user.displayName)

   
   
  }
//  console.log(username)
//  console.log(User)


 const SignIn =(e)=>{
  e.preventDefault();
     signInWithEmailAndPassword(auth,email,password).then((cred)=>{
        console.log('loged in : ',cred.user)
        setOpenSignIn(false)
        setsignUpform({
          username:'',
          email:''
        })

      })
     .catch(e=>alert(e.message))
    }
    return (
      <div className="App">
  
   
    {/* <div>{(User) ? <h1>{`this is ${User.displayName}`}</h1> : <h2>not loged in </h2>}</div> */}
    <div className='nav'>
      {/* {auth?.currentUser&& <div className='prof'><Avatar alt={auth.currentUser.displayName} src="/static/images/avatar/1.jpg" /></div>}
      {User?.displayName ? <ImageUploader />: "Oops you need to login for upload"} */}
      
      <Modal
      className='modal'
        open={open}
        onClose={()=>setOpen(false)}
        
      >
       <div className=''>
        <form className='App__signUp' onSubmit={SignUp}>
        <center>
        <img 
       className='App__headerImage'
       src='https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png' 
       alt='insta'/>
       </center>
       <input 
       type='text'
       placeholder='username'
       name='username'
       value={signupform.username}
       required
       onChange={(e)=>handleChange(e)}
       />
       <input 
       type='email'
       placeholder='email'
       name='email'
       value={signupform.email}
       required
       onChange={(e)=>handleChange(e)}
       />
       <input 
       type='password'
       name='password'
       required
       placeholder='password'
       value={signupform.password}
       onChange={(e)=>handleChange(e)}

       />


        <Button className='btn' type='submit'>Sign Up</Button>
       

      </form>
       </div>
      </Modal>

    {/* for signin --------- */}


      <Modal
       className='modal'
        open={OpenSignIn}
        onClose={()=>setOpenSignIn(false)}
        
      >
       <div className=''>
        <form className='App__signUp' onSubmit={SignIn}>
        <center>
        <img 
       className='App__headerImage'
       src='https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png' 
       alt='insta'/>
       </center>
       <input 
       type='email'
       placeholder='email'
       name='email'
       value={signupform.email}
       required
       onChange={(e)=>handleChange(e)}
       />
       <input 
       type='password'
       name='password'
       required
       placeholder='password'
       value={signupform.password}
       onChange={(e)=>handleChange(e)}

       />


        <Button className='btn' type='submit'>sign In</Button>
       

      </form>
       </div>
       </Modal>


      <div className='App__header'>
      <img 
       className='App__headerImage'
       src='https://www.instagram.com/static/images/web/logged_out_wordmark-2x.png/d2529dbef8ed.png' 
       alt='insta'/>
       {!User ? 
       <div className='btn'> 
       <Button  onClick={()=>setOpen(true)}>SignUp</Button>
       <Button onClick={()=>setOpenSignIn(true)}>Sign In</Button>
       </div>
        : 
       <Button onClick={()=>signOut(auth)}>LogOut</Button>
       }
      {auth?.currentUser&&<Button onClick={()=>setpostFlag(pre=>!pre)}>{`${postflag ? 'Close':'Add'} Post`}</Button>}
{auth?.currentUser&& <div className='prof'><Avatar alt={auth.currentUser.displayName} src="/static/images/avatar/1.jpg" /></div>}
      {User?.displayName && postflag ?  <ImageUploader /> : ""}
       
      </div>
      </div>

   
   {/* heaedr */}
   <div className='allposts'>
    <div>
   {
    
    posts.map((data)=><Posts key={data.id} {...data}/>)

   }
   </div>
   
   </div>
    </div>
  );
}

export default App;
