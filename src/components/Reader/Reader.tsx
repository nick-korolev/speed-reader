import React, {useEffect, memo, useRef, useMemo} from "react";
import s from './Reader.module.scss'

interface ISpeedReaderProps {
  text: string;
  active: boolean;
  wpm?: number;
  onActivityChange: () => void;
  currentCursor: number;
  onCurrentCursorChange: () => void;
}

const _SpeedReader: React.FC<ISpeedReaderProps> = ({ currentCursor, onCurrentCursorChange, onActivityChange, active, text, wpm = 300 }) => {

    const words = text.split(" ");
    const wordRef = useRef<HTMLDivElement>(null);

    const speed = 60000 / wpm;

    const formattedText = useMemo(() => {
      let text = '';
      for (let i = 0; i < words.length; i++) {
        if (i === currentCursor) {
          text += `<span class="${s.readerActive}">${words[i]}</span> `;
        } else {
          text += `${words[i]} `;
        }
      }
      return text;
    }, [currentCursor, words])

    useEffect(() => {
        if (!active) {
            return;
        }
        const timer = setInterval(() => {
            if (currentCursor < words.length - 1) {
              onCurrentCursorChange();
            }
        }, speed);

        return () => {
            clearInterval(timer);
        }
    }, [active, currentCursor, onCurrentCursorChange, speed, words.length]);

    useEffect(() => {
        if (!wordRef.current) {
            return;
        }

        const start = wordRef.current.scrollTop;
        const progress = currentCursor / words.length;
        const end = Math.ceil(wordRef.current.scrollHeight * progress) - Math.ceil((window.innerHeight / 2) * 1);
        let startTime: number;

        function animateScroll(timestamp: number) {
            if (!wordRef.current) {
                return;
            }
            if (!startTime) startTime = timestamp;

            const elapsed = timestamp - startTime;
            const duration = 500;
            const t = Math.min(1, elapsed / duration);

            wordRef.current.scrollTop = start + (end - start) * t;

            if (t < 1) {
                requestAnimationFrame(animateScroll);
            }
        }
        requestAnimationFrame(animateScroll);
    }, [currentCursor, words.length]);

    return (
        <div className={s.reader} ref={wordRef} onClick={onActivityChange} dangerouslySetInnerHTML={{__html: formattedText}}>
        </div>
    );
};

export const SpeedReader = memo(_SpeedReader);
