import {SpeedReader} from "./components/Reader/Reader.tsx";
import {Control} from "./components/Control/Control.tsx";
import {useCallback, useEffect, useState} from "react";
import s from './App.module.scss'

function App() {
  const [currentCursor, setCurrentCursor] = useState(() => {
    const localValue = localStorage.getItem('currentCursor');
    if (localValue) {
      return parseInt(localValue);
    }
    return 0;
  });

  const handleCurrentCursorChange = useCallback(() => {
    setCurrentCursor(prevState => prevState + 1)
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

  const toggle = () => {
    setActive(prevState => !prevState)
  }

  return (
    <div className={s.App}>
      <SpeedReader
        text={text}
        wpm={wpm}
        active={active}
        onActivityChange={toggle}
        currentCursor={currentCursor}
        onCurrentCursorChange={handleCurrentCursorChange}
      />
      {!active && <Control wpm={wpm} onWPMChange={handleWPMChange} onTextChange={handleTextChange}/>}
    </div>
  );
}

export default App
