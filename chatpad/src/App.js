import React, { useRef, useState } from 'react';
import './App.css';

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore'

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';


  firebase.initializeApp({
    apiKey: "AIzaSyDYkvkZ6yjn0DyJpTXtgyQ9GSz86pfvfW4",
    authDomain: "chatpad-portfolio.firebaseapp.com",
    projectId: "chatpad-portfolio",
    storageBucket: "chatpad-portfolio.appspot.com",
    messagingSenderId: "635780496960",
    appId: "1:635780496960:web:343ea60875362ea3b469a5",
    measurementId: "G-9WGZ0H8LJX"
});

const auth= firebase.auth();
const firestore = firebase.firestore();


function App() {
  const [user] = useAuthState(auth);
  return (
    <div className="App">
      <header>
        <h1>Welcome to Chatpad</h1>
        <SignOut />
      </header>

      <section>
        {user ? <ChatRoom /> : <SignIn />}
      </section>

    </div>
  );
}

function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  }

  return (
    <button onClick={signInWithGoogle} class='sign-in'>Sign in with Google</button>
  )
}

function SignOut() {
  return auth.currentUser && (
    <button className="sign-out" onClick={() => auth.signOut()}>Sign Out</button>
  )
}

function ChatRoom() {
  
  const dummy = useRef();
  const messagesRef = firestore.collection('messages');
  const messageRef = firestore.collection('messages');
  const query = messageRef.orderBy('createdAt').limit(100);
  const [messages] = useCollectionData(query, {idField: 'id'});
  const [formValue, setFormValue] = useState('');

  const sendMessage = async (e) => {
    e.preventDefault();

    const { uid, photoURL } = auth.currentUser;

    await messagesRef.add({
      text: formValue,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      photoURL
    })

    setFormValue('');
    dummy.current.scrollIntoView({ behavior: 'smooth' });
  }

  return(
    <>
    <div class="sidenav">
      <img alt="profile picture" src={firebase.auth().currentUser.photoURL} id='user-display-picture'></img>
      <h2>{firebase.auth().currentUser.displayName}</h2>  
    </div>
    <main>
      <h1 id='heading'> Welcome to Chatpad</h1>
      {messages && messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
      <div ref={dummy}></div>

    </main>

    <form onSubmit={sendMessage}>
        <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="say something nice" />
        <button type='submit'>Send</button>
    </form>
    </>
  )
}
  
function ChatMessage(props) {
  const { text, uid, photoURL } = props.message;

  const messageClass = uid === auth.currentUser.uid ? 'sent' : 'received';

  return (<>
    <div className={`message ${messageClass}`}>
      <img src={photoURL} />
      <p>{text}</p>
    </div>
  </>)
}



export default App;

 