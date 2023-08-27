import React from "react";
import s from './Control.module.scss'

interface IControlProps {
  onWPMChange: (wpm: number) => void;
  wpm: number;
  onTextChange: (text: string) => void;
}

function cleanText(text: string) {
  text = text.replace(/\n|\r|\t/g, ' ').replace(/\s+/g, ' ').trim();
  return text;
}

export const Control: React.FC<IControlProps> = ({wpm, onWPMChange, onTextChange}) => {
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    // const worker = new Worker('./worker.js');
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const text = await file.text();
    onTextChange(cleanText(text));
    // Listen for messages from the worker

    // worker.onmessage = (e) => {
    //   if (e.data.type === 'get') {
    //     localStorage.setItem('lastBook', file!.name);
    //   }
    // };
    //
    // // Start the worker with the file
    // worker.postMessage({
    //   file,
    //   type: 'parse',
    // });
  }
  return <>
    <div className={s.Control}>
      <div className={s.ControlBlock}>
        <label>Speed</label>
        <input value={wpm} type="number" placeholder="WPM" onChange={(e) => onWPMChange(parseInt(e.target.value))}/>
      </div>
      <div className={s.ControlBlock}>
        <label>Text</label>
        <input type="file" placeholder="Text" onChange={handleFileChange}/>
      </div>
    </div>
  </>
}

