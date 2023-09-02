import React, {useEffect, useMemo, useRef, useState} from "react";
import s from './Reader.module.scss'

interface IFakeRendererProps {
  words: string[];
  onDone: (portion: string[]) => void;
}

const _FakeRenderer: React.FC<IFakeRendererProps> = ({ words, onDone }) => {
  const [portion, setPortion] = useState<string[]>([]);
  const rendererRef = useRef<HTMLDivElement>(null);
  const [done, setDone] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const d = Date.now();

  const checkOverflow = () => {
    if (!rendererRef.current) {
      return;
    }
    const container = rendererRef.current;
    if (container.scrollHeight > container.clientHeight) {
      setDone(true);
      return;
    }
    if (currentIndex >= words.length) {
      setDone(true);
      return;
    }
    setCurrentIndex(prevState => prevState + 1)
  };

  useEffect(() => {
    console.log('render', d, Date.now() - d);
    checkOverflow();
  }, [words]);

  useEffect(() => {
    setPortion(words.slice(0, currentIndex));
    checkOverflow()
  }, [currentIndex, words]);

  useEffect(() => {
    if (done) {
      onDone(portion.slice(0, -1));
    }
  }
  , [done, onDone, portion]);

  const textHTML = useMemo(() => {
    return portion.join(' ')
  }, [portion])

  return (
    <div ref={rendererRef} className={s.reader} style={{ overflow: "auto", height: "100vh" }}>
      {textHTML}
    </div>
  );
};

export const FakeRenderer = React.memo(_FakeRenderer);
