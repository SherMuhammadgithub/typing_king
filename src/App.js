import React, { useEffect, useRef, useState } from 'react'
import { generate } from "random-words";
import './App.css'
const NUMB_OF_WORDS = 100;
const SECONDS = 60;


export default function App() {
  const [words, setWords] = useState([]);
  const [countDown, setCountDown] = useState(SECONDS);
  const [currentInput, setCurrentInput] = useState('');
  const [currWordIndex, setCurrentWordIndex] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const [status, setStatus] = useState("waiting");
  const [currCharIndex, setCurrCharIndex] = useState(-1)
  const [currChar, setCurrChar] = useState("");
  const textInput = useRef(null);
  useEffect(() => {
    setWords(generateWords())
  }, []);
  useEffect(() => {
    if (status === "started") {
      textInput.current.focus();
    }
  }, [status]);
  function generateWords() {
    return new Array(NUMB_OF_WORDS).fill(null).map(() => generate())
  }
  function start() {
    if (status === "finished") {
      setWords(generateWords());
      setCurrentWordIndex(0);
      setCorrect(0);
      setIncorrect(0);
      setCurrCharIndex(-1);
      currChar("");
    }
    if (status !== "started") {
      setStatus("started")
      let interval = setInterval(() => {
        setCountDown((prevCountdown) => {
          if (prevCountdown === 0) {
            clearInterval(interval)
            setStatus("finished");
            setCurrentInput("");
            return SECONDS;
          }
          else {
            return prevCountdown - 1;
          }
        });
      }, 1000);
    }
  }

  function handleKeyDown({ keyCode, key }) {
    if (keyCode === 32) { //keycode for spacebar 
      checkMatch();
      setCurrentInput("");
      setCurrentWordIndex(currWordIndex + 1);
      setCurrCharIndex(-1);
    }
    //keyCode for backspace 
    else if (keyCode === 8) {
      setCurrCharIndex(currCharIndex - 1);
      setCurrChar("");

    }

    else {
      setCurrCharIndex(currCharIndex + 1);
      setCurrChar(key);

    }

  }
  function checkMatch() {
    const wordToCompare = words[currWordIndex];
    const doesItMatch = wordToCompare === currentInput.trim();
    if (doesItMatch) {
      setCorrect(correct + 1);

    } else {
      setIncorrect(incorrect + 1);
    }
  }
  function getCharClass(wordIdx, charIdx, char) {
    if (wordIdx === currWordIndex && charIdx === currCharIndex && currChar && status !== 'finished') {
      if (char === currChar) {
        return 'has-background-success'

      }
      else if (wordIdx === currWordIndex && currCharIndex >= words[currWordIndex].length) {
        return 'has-background-danger';
      }
      else {
        return 'has-background-danger'

      }

    } else {
      return ''
    }

  }
  return (
    <>
      <div className='text-center text-red-600 animate-bounce  text-4xl m-16
     font-medium '>
        The king Typing Meter

      </div>
      <div className='seciton'>
        <div className="is-size-1 has-text-centered has-text-primary">
          <h2>{countDown}</h2>
        </div>

      </div>
      <div className="control is-expanded section">
        <input ref={textInput} disabled={status !== "started"} type="text" className='input' onKeyDown={handleKeyDown} value={currentInput} onChange={(e) => setCurrentInput(e.target.value)} />
      </div>
      <div className="section">
        <button className='button is-info is-fullwidth ' onClick={start}>
          Start
        </button>
      </div>
      {status === "started" && (
        <div className="section animate__animated animate__fadeInDown">
          <div className="card">
            <div className="card-content">
              <div className="content">
                {words.map((words, i) => (
                  <span key={i}>
                    <span >
                      {words.split("").map((char, idx) => (
                        <span className={getCharClass(i, idx, char)} key={idx}>{char}</span>
                      ))}
                    </span>
                    <span> </span>
                  </span>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
      {status === "finished" && (
        <div className="scetion animate__animated animate__fadeInDown">
          <div className="columns">
            <div className="column has-text-centered">
              <p className="is-size-5">Words per minute: </p>
              <p className="has-text-primary is-size-1">
                {correct}
              </p>
            </div>
            <div className="column has-text-centered">
              <p className="is-size-5">Accuary: </p>
              <p className="has-text-primary is-size-1  ">
                {Math.round((correct / (correct + incorrect)) * 100)}%
              </p>
            </div>
          </div>

        </div>

      )}

    </>
  )
}

