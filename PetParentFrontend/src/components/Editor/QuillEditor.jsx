"use client";

import { useEffect, useRef } from "react";
import "quill/dist/quill.snow.css";
import "./editor.css";

export default function QuillEditor({ value, onChange }) {
  const editorRef = useRef(null);
  const quillRef = useRef(null);
  const initializedRef = useRef(false);

  useEffect(() => {
    let mounted = true;

    async function initQuill() {
      if (!editorRef.current || quillRef.current) return;

      const Quill = (await import("quill")).default;

      if (!mounted) return;

      const quill = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your content...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["blockquote", "code-block"],
            ["link"], 
            ["clean"],
          ],
        },
      });

      quill.root.setAttribute("dir", "ltr");
      quill.root.style.textAlign = "left";

      if (value) {
        quill.clipboard.dangerouslyPasteHTML(value); 
      }

      quill.on("text-change", () => {
        onChange(quill.root.innerHTML);
      });

      quillRef.current = quill;
    }

    initQuill();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!quillRef.current) return;

    const editor = quillRef.current;
    const current = editor.root.innerHTML;

    if (value !== current) {
      editor.clipboard.dangerouslyPasteHTML(value || ""); 
    }
  }, [value]);

  return <div ref={editorRef} className="quill-wrapper" />;
}
