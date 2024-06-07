import { useState } from "react";
import ShapeRenderer from "./ShapeRenderer";

const Editor = () => {
const [type, setType] = useState<string| null>(null);
const [isEdit, setIsEdit] = useState(true);
  return (
    <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <h4>Editor</h4>
        <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '800px', padding: '10px', gap: '20px'}}>
            <button onClick={() => setType('highlight')}>Highlight</button>
            <button onClick={() => setType('textbox')}>Textbox</button>
            <button onClick={() => setType('rectangle')}>Rectangle</button>
            <button onClick={() => setType('circle')}>Circle</button>
            <button onClick={() => setType('callout')}>Callout</button>
            <button onClick={()=> setIsEdit(false)}>Disable Edit</button>
            <button onClick={()=> setIsEdit(true)}>Resume Edit</button>
        </div>
        <div className="editor-area">
            <ShapeRenderer type={type} isEdit={isEdit}/>
        </div>
    </div>
  )
}

export default Editor