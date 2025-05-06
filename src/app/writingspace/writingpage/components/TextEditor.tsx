import React, { forwardRef } from 'react'

interface TextEditorProps {
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  disabled: boolean
  placeholder: string
}

const TextEditor = forwardRef<HTMLTextAreaElement, TextEditorProps>(
  ({ onChange, disabled, placeholder }, ref) => {
    const handleCopyPaste = (e: React.ClipboardEvent) => {
      e.preventDefault()
    }

    return (
      <div className="mb-4 p-4 bg-[#F5FDF8] rounded-xl shadow-lg">
        <textarea
          ref={ref}
          className="w-full h-96 p-4 text-lg font-mono text-black bg-white resize-none focus:outline-none rounded-lg shadow-inner"
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          style={{ minHeight: '290px', overflow: 'hidden' }}
          onCopy={handleCopyPaste}
          onCut={handleCopyPaste}
          onPaste={handleCopyPaste}
        />
      </div>
    )
  }
)

TextEditor.displayName = 'TextEditor'

export default TextEditor
