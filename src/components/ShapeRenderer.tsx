import React, { useEffect, useState } from 'react';
import Circle from './shapes/Circle';
import Highlight from './shapes/Highlight';
import TextBox from './shapes/Textbox';

interface IShapeRenderProps {
    type: string | null;
}

interface IShapeType {
    id: number,
    type: string,
    x: number,
    y: number,
    width: number,
    height: number,
    text?:string;
}

const ShapeRenderer: React.FC<IShapeRenderProps> = (props) => {
    const {type} = props;
    const [shapes, setShapes] = useState<IShapeType[]>([]);
    useEffect(()=> {
        const initialShapes = [];
        if(type==='highlight') {
            initialShapes.push({    
                    id: 1,
                    type: "highlight",
                    x: 300,
                    y: 200,
                    width: 300,
                    height: 100,
            })
            setShapes(initialShapes);
        }
        else if(type==='rectangle') {
            initialShapes.push({    
                    id: 1,
                    type: "rectangle",
                    x: 300,
                    y: 200,
                    width: 300,
                    height: 100,
            })
            setShapes(initialShapes);
        }
        else if(type==='circle') {
            initialShapes.push({    
                    id: 1,
                    type: "circle",
                    x: 300,
                    y: 200,
                    width: 100,
                    height: 100,
            })
            setShapes(initialShapes);
        }
         else if(type==='textbox') {
            initialShapes.push({    
                    id: 1,
                    type: "textbox",
                    x: 300,
                    y: 200,
                    width: 200,
                    height: 100,
                    text: 'Editable text',
            })
            setShapes(initialShapes);
        }

    }, [type])

  const handleDrag = (id: number, newX: number, newY: number) => {
    setShapes(
      shapes.map((shape) =>
        shape.id === id ? { ...shape, x: newX, y: newY } : shape,
      ),
    );
  };

  const handleResize = (id: number, newWidth: number, newHeight: number) => {
    setShapes(
      shapes.map((shape) =>
        shape.id === id
          ? { ...shape, width: newWidth, height: newHeight }
          : shape,
      ),
    );
  };

   const handleTextChange = (id: number, newText: string) => {
        setShapes(shapes.map(shape => shape.id === id ? { ...shape, text: newText } : shape));
    };

  const getShapes = (shape: IShapeType) => {
    if(shape.type === 'highlight') {
            return (
                <Highlight
               key={shape.id}
               {...shape}
               isRectangle={false}
               onDrag={(newX, newY) => handleDrag(shape.id, newX, newY)}
               onResize={(newWidth, newHeight) => handleResize(shape.id, newWidth, newHeight)}
               />
    )}
    if(shape.type === 'rectangle') {
            return (
                <Highlight
               key={shape.id}
               {...shape}
               isRectangle={true}
               onDrag={(newX, newY) => handleDrag(shape.id, newX, newY)}
               onResize={(newWidth, newHeight) => handleResize(shape.id, newWidth, newHeight)}
               />
    )}
    if(shape.type === 'circle') {
            return (
                <Circle
               key={shape.id}
               id={shape.id}
               cx={shape.x}
               cy={shape.y}
               rx={shape.width}
               ry={shape.height}
               onDrag={(newX, newY) => handleDrag(shape.id, newX, newY)}
               onResize={(newWidth, newHeight) => handleResize(shape.id, newWidth, newHeight)}
               />
    )}
    if(shape.type === 'textbox') {
            return (
                <TextBox
                    text={''} 
                    key={shape.id}
                    {...shape}
                    onDrag={(newX, newY) => handleDrag(shape.id, newX, newY)}
                    onResize={(newWidth, newHeight) => handleResize(shape.id, newWidth, newHeight)}
                    onTextChange={(newText) => handleTextChange(shape.id, newText)}
                />
    )}
  }

  return (
    <div style={{zIndex: 5, width: '100%', height: '100%'}}>
      <svg width="100%" height="100%">
       { shapes.map((shape) => (
          getShapes(shape)
        ))}
      </svg>
    </div>
  );
};

export default ShapeRenderer