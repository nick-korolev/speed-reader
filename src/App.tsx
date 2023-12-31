import {SpeedReader} from "./components/Reader/Reader.tsx";
import {Control} from "./components/Control/Control.tsx";
import React, {useCallback, useEffect, useState} from "react";
import s from './App.module.scss'

function App() {
  const [currentCursor, setCurrentCursor] = useState(() => {
    const localValue = localStorage.getItem('currentCursor');
    if (localValue) {
      const parsed = parseInt(localValue);
      if (isNaN(parsed)) {
        return 0;
      }
      return parseInt(localValue);
    }
    return 0;
  });

  const handleCurrentCursorChange = useCallback((newValue: number | null) => {
    setCurrentCursor(prevState => {
      if (newValue === null) {
        return prevState + 1;
      }
      return newValue;
    })
  }, []);

  useEffect(() => {
    localStorage.setItem('currentCursor', String(currentCursor))
  }, [currentCursor]);

  const [text, setText] = useState(() => {
    const localValue = localStorage.getItem('text');
    if (localValue) {
      return localValue;
    }
    return '';
  })

  const handleTextChange = useCallback((newText: string) => {
    setText(newText)
    localStorage.setItem('text', newText)
  }, []);


  const [wpm, setWPM] = useState(() => {
    const localValue = localStorage.getItem('wpm');
    if (localValue) {
      return parseInt(localValue);
    }
    return 700;
  });
  const [active, setActive] = useState(false);

  const handleWPMChange = useCallback((newWpm: number) => {
    setWPM(newWpm)
    localStorage.setItem('wpm', String(newWpm))
  }, []);

  const toggle = (event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setActive(prevState => !prevState)
  }

  const handleCursorChange = (cursor: number) => {
    setCurrentCursor(cursor);
  }

  return (
    <div className={s.App} >
      <div className={s.Overlay} onClick={toggle}></div>
      <SpeedReader
        text={text}
        wpm={wpm}
        active={active}
        currentCursor={currentCursor}
        onCurrentCursorChange={handleCurrentCursorChange}
      />
      {!active && <Control
          wpm={wpm}
          onWPMChange={handleWPMChange}
          onTextChange={handleTextChange}
          onCursorChange={handleCursorChange}
          cursor={currentCursor}
      />}
    </div>
  );
}

export default App
