import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition;

function App() {
  const [text, setText] = useState('');

  useEffect(() => {
    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.continues = true;
    recognition.onresult = (event) => {
      var msg = new SpeechSynthesisUtterance();
      msg.text = event.results[0][0].transcript;
      window.speechSynthesis.speak(msg);
      setText(prevState => `${prevState} ${event.results[0][0].transcript}`);
    };
    recognition.onend = () => {
      try {
        recognition.start();
      } catch (error) {
        console.log(error);
      }
    }
  }, []);

  return (
    <>
      <h1>{text}</h1>
      <div className="card">
        <button onClick={() => recognition.start()}>
          Start Speech Recognition
        </button>
        <p></p>
      </div>
    </>
  )
}

export default App
