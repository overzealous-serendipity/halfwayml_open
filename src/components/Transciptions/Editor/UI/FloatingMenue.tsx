import React, { useState, useEffect, useCallback } from "react";
import { Editor, Range, Transforms } from "slate";
import { ReactEditor } from "slate-react";
import { FiBold, FiItalic, FiUnderline } from "react-icons/fi";
import { LuHighlighter } from "react-icons/lu";
import { FaCircleCheck } from "react-icons/fa6";
interface ComProps {
  editor: Editor;
  onAddComment?: (editor: Editor) => void;
}

const FloatingMenu: React.FC<ComProps> = ({ editor }) => {
  const [visible, setVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });

  // Define toggleMark function here so it's accessible throughout the component
  const toggleMark = (editor: Editor, format: string) => {
    const isActive =
      Editor.marks(editor)?.[format as keyof typeof Editor.marks];
    if (isActive) {
      Editor.removeMark(editor, format);
    } else {
      Editor.addMark(editor, format, true);
    }
  };

  const updatePosition = useCallback(() => {
    const { selection } = editor;
    if (
      !selection ||
      !ReactEditor.isFocused(editor as ReactEditor) || // Cast 'editor' to ReactEditor
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ""
    ) {
      setVisible(false);
      return;
    }

    const domSelection = window.getSelection();
    if (!domSelection) {
      setVisible(false);
      return;
    }

    const domRange = domSelection.getRangeAt(0);
    const rect = domRange.getBoundingClientRect();
    setVisible(true);
    setPosition({
      top: rect.top + window.pageYOffset - rect.height - 25, // Adjust above the selection
      left: rect.left + window.pageXOffset + rect.width / 2 - 45, // Center it over the selection
    });
  }, [editor]);

  useEffect(() => {
    const handleMouseUp = () => updatePosition();
    const handleKeyUp = () => updatePosition();

    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("keyup", handleKeyUp);
    document.addEventListener("selectionchange", updatePosition);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("keyup", handleKeyUp);
      document.removeEventListener("selectionchange", updatePosition);
    };
  }, [editor, updatePosition]);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="floating-menu absolute z-10 flex flex-row gap-4 p-2 bg-white rounded-lg shadow-lg border border-gray-300"
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, "bold");
        }}
        className="font-bold hover:text-blue-500"
      >
        <FiBold />
      </button>
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, "italic");
        }}
        className="italic hover:text-blue-500"
      >
        <FiItalic />
      </button>
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, "underline");
        }}
        className="underline hover:text-blue-500"
      >
        <FiUnderline />
      </button>
      {/* Corrected: Use toggleMark for highlighting */}
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, "highlight");
        }}
        className="hover:text-blue-500"
      >
        <LuHighlighter />
      </button>
      {/* <button
        onMouseDown={(event) => {
          event.preventDefault();
          if (onAddComment) onAddComment(editor);
        }}
        className="hover:text-blue-500"
      >
        Add Comment
      </button> */}
      {/* Reviewed */}
      <button
        onMouseDown={(event) => {
          event.preventDefault();
          toggleMark(editor, "reviewed");
        }}
        className="flex flex-row gap-1 items-center"
      >
        <FaCircleCheck className="text-purple-500 hover:text-purple-500 cursor-pointer" />
        <p>Review</p>
      </button>
    </div>
  );
};

export default FloatingMenu;
