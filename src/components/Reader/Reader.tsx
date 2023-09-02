import React, {useEffect, memo, useRef, useMemo, useState} from "react";
import s from './Reader.module.scss'
import {FakeRenderer} from "./FakeRenderer.tsx";

interface ISpeedReaderProps {
  text: string;
  active: boolean;
  wpm?: number;
  currentCursor: number;
  onCurrentCursorChange: (newValue: number | null) => void;
}

const _SpeedReader: React.FC<ISpeedReaderProps> = ({ currentCursor, onCurrentCursorChange, active, text, wpm = 300 }) => {

  const words = useMemo(() => {
    return text.split(' ')
  }, [text])

  const [currentWords, setCurrentWords] = useState<string[]>([]);
  const [lastWordIndex, setLastWordIndex] = useState(0);

  const wordRef = useRef<HTMLDivElement>(null);
  const speed = 60000 / wpm;

  useEffect(() => {
    if (!active) {
      return;
    }
    const timer = setTimeout(() => {
      if (currentCursor < currentWords.length - 1) {
        onCurrentCursorChange(null);
      } else {
        setFakeRendererActive(true)
      }
    }, speed);

    return () => {
      clearTimeout(timer);
    }
  }, [active, currentCursor, currentWords.length, onCurrentCursorChange, speed]);

  const [fakeRendererActive, setFakeRendererActive] = useState(true);

  const goNext = (portion: string[]) => {
    requestAnimationFrame(() => {
      onCurrentCursorChange(0)
      setCurrentWords(portion)
      console.log('portion', portion.length)
      setFakeRendererActive(false);
      setLastWordIndex(prevState => prevState + portion.length);
      console.log('goNext', Date.now())
    });
  };

  return (
    <>
      {fakeRendererActive && <FakeRenderer words={words.slice(lastWordIndex)} onDone={goNext}/>}
      <div className={s.reader} ref={wordRef}>
        {currentWords.map((word, index) => {
          return <span key={index} className={index === currentCursor ? s.readerActive : ''}>{word + ' '}</span>
        })}
      </div>
    </>
  );
};

export const SpeedReader = memo(_SpeedReader);