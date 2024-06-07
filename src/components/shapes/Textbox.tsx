/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from 'react';


interface ITextBoxProps {
    id: number;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    onDrag: (newX: number, newY: number) => void
    onResize: (newWidth: number, newHeight: number) => void;
    onTextChange: (newText: any) => void
}
const TextBox: React.FC<ITextBoxProps> = (props) => {
    const { x, y, width, height, text, onDrag, onResize, onTextChange } = props;
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isEditing, setIsEditing] = useState(false);
    const inputRef = useRef(null);

    const handleMouseDown = (e: any, action:any) => {
        e.stopPropagation();
        setOffset({ x: e.clientX, y: e.clientY });

        if (action === 'drag') {
            setDragging(true);
        } else {
            setResizing(action);
        }
    };

    const handleMouseMove = (e) => {
        if (dragging) {
            onDrag(x + (e.clientX - offset.x), y + (e.clientY - offset.y));
            setOffset({ x: e.clientX, y: e.clientY });
        } else if (resizing) {
            const dx = e.clientX - offset.x;
            const dy = e.clientY - offset.y;

            if (resizing === 'right') {
                onResize(width + dx, height);
            } else if (resizing === 'bottom') {
                onResize(width, height + dy);
            } else if (resizing === 'left') {
                onResize(width - dx, height);
                onDrag(x + dx, y);
            } else if (resizing === 'top') {
                onResize(width, height - dy);
                onDrag(x, y + dy);
            } else if (resizing === 'bottomRight') {
                onResize(width + dx, height + dy);
            } else if (resizing === 'topLeft') {
                onResize(width - dx, height - dy);
                onDrag(x + dx, y + dy);
            }

            setOffset({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setResizing(null);
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if(inputRef.current){
            onTextChange(inputRef.current.value);
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove]);

    return (
        <svg width="100%" height="100%">

        <g>
            <rect
                x={x}
                y={y}
                width={width}
                height={height}
                fill="lightgrey"
                stroke="blue"
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
                onDoubleClick={handleDoubleClick}
            />
            {isEditing ? (
                <foreignObject x={x} y={y} width={width} height={height}>
                    <input
                        ref={inputRef}
                        type="text"
                        defaultValue={text}
                        style={{ width: '100%', height: '100%' }}
                        onBlur={handleBlur}
                        autoFocus
                    />
                </foreignObject>
            ) : (
                <text
                    x={x + width / 2}
                    y={y + height / 2}
                    textAnchor="middle"
                    alignmentBaseline="middle"
                >
                    {text}
                </text>
            )}
            {/* Resize handles */}
            <circle
                cx={x + width}
                cy={y + height / 2}
                r="5"
                fill="red"
                onMouseDown={(e) => handleMouseDown(e, 'right')}
            />
            <circle
                cx={x + width / 2}
                cy={y + height}
                r="5"
                fill="red"
                onMouseDown={(e) => handleMouseDown(e, 'bottom')}
            />
            <circle
                cx={x}
                cy={y + height / 2}
                r="5"
                fill="red"
                onMouseDown={(e) => handleMouseDown(e, 'left')}
            />
            <circle
                cx={x + width / 2}
                cy={y}
                r="5"
                fill="red"
                onMouseDown={(e) => handleMouseDown(e, 'top')}
            />
            <circle
                cx={x + width}
                cy={y + height}
                r="5"
                fill="blue"
                onMouseDown={(e) => handleMouseDown(e, 'bottomRight')}
            />
            <circle
                cx={x}
                cy={y}
                r="5"
                fill="blue"
                onMouseDown={(e) => handleMouseDown(e, 'topLeft')}
            />
        </g>
        </svg>
    );
};

export default TextBox;
