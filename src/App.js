import React, { useRef, useState } from "react";
import "./App.css";
import html2pdf from "html2pdf.js";

function App() {
  const editorRef = useRef(null);
  const fileInputRef = useRef(null);

  const [text, setText] = useState("");
  const [darkMode, setDarkMode] = useState(false);

  const format = (command, value = null) => {
    document.execCommand(command, false, value);
  };

  const handleInput = () => {
    setText(editorRef.current.innerText);
  };

  const clearEditor = () => {
    editorRef.current.innerHTML = "";
    setText("");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.style.maxWidth = "100%";
      img.style.margin = "10px 0";

      editorRef.current.appendChild(img);
    };

    reader.readAsDataURL(file);
  };

  const exportPDF = () => {
    const element = editorRef.current;

    const opt = {
      margin: 0.5,
      filename: "editor-content.pdf",
      image: { type: "jpeg", quality: 1 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "in", format: "a4", orientation: "portrait" }
    };

    html2pdf().set(opt).from(element).save();
  };

  const words =
    text.trim().length === 0 ? 0 : text.trim().split(/\s+/).length;

  return (
    <div className={darkMode ? "container dark" : "container"}>

      <h1>Text editor</h1>

      <div className="toolbar">

        <button onClick={() => format("bold")}>B</button>
        <button onClick={() => format("italic")}>I</button>
        <button onClick={() => format("underline")}>U</button>
        <button onClick={() => format("strikeThrough")}>S</button>

        <button onClick={() => format("undo")}>Undo</button>
        <button onClick={() => format("redo")}>Redo</button>

        <select onChange={(e) => format("fontSize", e.target.value)}>
          <option>Font Size</option>
          <option value="1">Small</option>
          <option value="3">Normal</option>
          <option value="5">Large</option>
          <option value="7">Huge</option>
        </select>

        <input
          type="color"
          onChange={(e) => format("foreColor", e.target.value)}
        />

        <button onClick={() => fileInputRef.current.click()}>
          Image
        </button>

        <button onClick={exportPDF}>
          Export PDF
        </button>

        <button onClick={clearEditor}>
          Clear
        </button>

        <button onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "Light" : "Dark"}
        </button>

        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleImageUpload}
          hidden
        />

      </div>

      <div
        ref={editorRef}
        className="editor"
        contentEditable
        onInput={handleInput}
      ></div>

      <div className="stats">
        <span>Words: {words}</span>
        <span>Characters: {text.length}</span>
      </div>

    </div>
  );
}

export default App;