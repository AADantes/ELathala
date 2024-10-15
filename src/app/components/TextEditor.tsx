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
      <div className="mb-4">
        <textarea
          ref={ref}
          className="w-full h-64 p-2 text-base font-arial bg-transparent resize-none focus:outline-none"
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          style={{ minHeight: '400px' }}
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