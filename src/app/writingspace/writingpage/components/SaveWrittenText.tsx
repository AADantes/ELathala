// /components/SaveWrittenText.tsx
'use client';

import { useEffect } from 'react';
import { useWritingContext } from '../../WritingContext';

interface SaveWrittenTextProps {
  textAreaRef: React.RefObject<HTMLTextAreaElement>;
  triggerSave: boolean; // A boolean you toggle when the timer ends
}

const SaveWrittenText = ({ textAreaRef, triggerSave }: SaveWrittenTextProps) => {
  const { setWrittenText } = useWritingContext();

  useEffect(() => {
    if (triggerSave && textAreaRef.current) {
      const text = textAreaRef.current.value;
      setWrittenText(text);
    }
  }, [triggerSave, textAreaRef, setWrittenText]);

  return null; // This component doesn’t render anything visible
};

export default SaveWrittenText;
