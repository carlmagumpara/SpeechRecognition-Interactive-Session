import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();
const defaultLocale = 'en-US'

recognition.lang = defaultLocale;
recognition.interimResults = true; 
recognition.continues = true;

function App() {
  const [locale, setLocale] = useState(defaultLocale);
  const [text, setText] = useState('');

  const rnPostMessage = data => {
    if(window.isRNWebView) {
      window.ReactNativeWebView?.postMessage(JSON.stringify(data));
    }
  };

  const rnMessageListener = (msg) => {
    if(window.isRNWebView) {
      const data = JSON.parse(msg.data);
      alert(data.event);
      if(data.event === 'start') {
        recognition.start();
      }
    }
  };

  useEffect(() => {
    recognition.onresult = (event) => {
      rnPostMessage({
        event: 'result',
        message: event.results[0][0].transcript
      });

      setText(prevState => event.results[0][0].transcript);
    };
    recognition.onend = () => {
      try {
        recognition.start();
      } catch (error) {
        rnPostMessage({
          event: 'error',
          message: error
        });
      }
    }
    recognition.onstart = (event) => {
      rnPostMessage({
        event: 'start',
        message: 'onstart'
      });
    };

    /** android */
    document.addEventListener("message", rnMessageListener);
    /** ios */
    window.addEventListener("message", rnMessageListener);

    return () => {
      /** android */
      document.removeEventListener("message", rnMessageListener);
      /** ios */
      window.removeEventListener("message", rnMessageListener);
    }
  }, []);

  return (
    <>
      <p>{text}</p>
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
