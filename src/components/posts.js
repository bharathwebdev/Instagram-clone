import React, { useEffect, useState } from 'react'
import { Avatar, Button } from '@mui/material';
import '../components/posts.css';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebse.config';
import { getAuth } from 'firebase/auth';



function Posts({post,id}) {
  const {username,caption,imgUrl} = post;
const [comments,setcomments]  = useState([]);
const [comment,setcomment]  = useState('');
const auth = getAuth()
// useEffect(()=>{
//   let unscbscripbe;
//   const ff = async()=>{
//     if(id){
//        unscbscripbe = await getDocs(doc(db, "post",where('id','===',id)))
//       .then(snap=>{
//        setcomments(snap.docs.map(doc=>doc.data()));
//       });

//     }
//     return ()=>{
//       unscbscripbe();
//     }

  

//   }
// ff()

// },[id])
useEffect(()=>{
   const ref =collection(db,'posts',id,'comments');
   const q = query(ref,orderBy('timestamp','desc'));
   onSnapshot(q,(snap)=>{
      setcomments(snap.docs.map(doc=>({...doc.data(),id:doc.id})))
   })
},[id])



// console.log(comments)
const submit=(e)=>{
  e.preventDefault();
  const ref = collection(db,'posts',id,'comments');
  // const q = query(ref,orderBy('timestamp','desc'));
  addDoc(ref,{
    text:comment,
    username:auth.currentUser.displayName,
    timestamp:serverTimestamp(),
  })
  setcomment('');
}
// console.log(comments)
  return (
    <div className='posts'> 
    <div className='posts__header'>
      <Avatar 
      className='posts__avatar'
      alt={username} 
      src="/static/images/avatar/1.jpg"
      />
      <h3>{username}</h3>

    </div>

        
        <img 
        className='posts__image'
        src={imgUrl}
        alt=''/>

        
        <h4 className='posts__text'><strong>{`${username} `}</strong>{caption}</h4>
        <div >
          <div className='comments__section'>
           
            {comments.map(comment=>{
             return <p key={comment.id}>
                <strong>{comment.username+' '}</strong>{comment.text}
              </p>
            })}
          </div>
          <form  className="post__comments"  onSubmit={submit}>
            <input 
            className='int__text'
             type='text'
             disabled={!auth.currentUser}
             placeholder={`${!auth.currentUser ? 'LoggIn to comment ':'Add comments...'}`}
             onChange={(e)=>setcomment(e.target.value)}
             value={comment}


             />
            <Button 
            className='inp__btn'
            type='submit'
            disabled={!comment}
            >POST</Button>
          </form>
        </div>

    </div>

  )
}

export default Posts