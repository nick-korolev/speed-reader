import React, {useEffect, memo, useRef} from "react";
import s from './Reader.module.scss'
import { VariableSizeList as List } from "react-window";

interface ISpeedReaderProps {
  text: string;
  active: boolean;
  wpm?: number;
  currentCursor: number;
  onCurrentCursorChange: () => void;
}

const _SpeedReader: React.FC<ISpeedReaderProps> = ({ currentCursor, onCurrentCursorChange, active, text, wpm = 300 }) => {

    const sentences = text.split(". ");
    const words = text.split(" ");
    const listRef = useRef<List | null>(null);

    const speed = 60000 / wpm;

    useEffect(() => {
        if (!active) {
            return;
        }
        const timer = setTimeout(() => {
            if (currentCursor < sentences.length - 1) {
              onCurrentCursorChange();
            }
        }, speed);

        return () => {
            clearTimeout(timer);
        }
    }, [active, currentCursor, onCurrentCursorChange, speed, sentences.length]);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollToItem(currentCursor, 'center');
    }
  }, [currentCursor]);

  const getItemSize = (index: number) => {
    // Assume a basic uniform size for simplicity, but you can calculate it differently if you like.
    return 30;
  };

  const Row = ({ index, style }: any) => {
    const isCurrentRow = index === currentCursor;
    return (
      <div style={style} className={s.reader}>
        <span className={isCurrentRow ? s.readerActive : ""}>
          {
            sentences[index].split(" ").map((word, i) => {
              return <span key={i}>{word + ' '}</span>
            })
          }
          {'. '}
        </span>
      </div>
    );
  };

  return (
    <div>
      <List
        ref={listRef}
        height={window.innerHeight} // viewport height
        itemCount={sentences.length}
        itemSize={getItemSize}
        width={window.innerWidth} // viewport width
        className={s.list}
      >
        {Row}
      </List>
    </div>
  );
};

export const SpeedReader = memo(_SpeedReader);
