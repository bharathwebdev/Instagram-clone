import { Button } from '@mui/material'
import { getAuth } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useState } from 'react'
import { ref } from 'firebase/storage';
import { db } from './firebse.config';
import { getDownloadURL } from 'firebase/storage';
import './App.css'
import { storage } from './firebse.config';
import { uploadBytesResumable } from 'firebase/storage';

function ImageUploader() {
    const [caption ,setCaption] = useState('');
    const [progress,setProgress] = useState(0);
    const [img,setImg] = useState(null);
    const auth  = getAuth();
//    console.log("im uploader : ",auth.currentUser)
    const handleChange =(e)=>{
    console.log(e.target.files[0]);
        if(e.target.files[0]){
            setImg(e.target.files[0]);
        }
        console.log(e.target.file);
    }
    const  handleSubmit = ()=>{

     const storageRef = ref(storage,`images/${img.name}`);
     const uploadTask = uploadBytesResumable(storageRef, img);
     uploadTask.on('state_changed',
     (snapshot)=>{
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);


     },(error)=>{
        console.log(error);
     },() => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
   
            const  temp = {
                username : auth.currentUser.displayName,
                caption : caption,
                imgUrl : downloadURL,
                timestamp: serverTimestamp()
            }
            const ref = collection(db,'posts');
            addDoc(ref,temp).then(data=>console.log(data)).catch(e=>console.log(e.message));
            setProgress(0);
            setCaption('');
            setImg(null);

        });
      })
  
        

    //    const ref = collection(db,'posts');

        //

    }
  return (
<>
<div className='uploadpost'>
<div className='uploadForm'>



        <input type='text' placeholder='Enter the Caption...' onChange={e => setCaption(e.target.value)} value={caption} />
        <progress id="file" value={progress} max="100"> {progress}% </progress>
        <input type='file' onChange={handleChange} />
        <Button onClick={handleSubmit}>Upload</Button>


    </div>
</div>
</>
  )

}

export default ImageUploader;