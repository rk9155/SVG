import { useState } from "react";
import "./App.css";
import Editor from "./components/Editor";
import FabricEditor from "./components/FabricShapes/FabricEditor";

function App() {
  const [editorTypeSvg, setEditorTypeSvg] = useState(false);

  const handleSwitchEditor = () => {
    setEditorTypeSvg(!editorTypeSvg);
  };
  return (
    <>
      <div style={{ margin: "20px" }}>
        <button onClick={handleSwitchEditor}>Switch editor</button>
      </div>
      {editorTypeSvg ? <Editor /> : <FabricEditor />}
    </>
  );
}

export default App;
