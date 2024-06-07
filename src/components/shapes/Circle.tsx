/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';


interface ICircleProps {
    id: number;
    cx: number; 
    cy: number;
    rx: number; 
    ry: number; 
    onDrag: (newX: number, newY: number) => void
    onResize: (newWidth: number, newHeight: number) => void;
}


const Circle: React.FC<ICircleProps> = (props) => {
    const { cx, cy, rx, ry, onDrag, onResize } =props;
    const [dragging, setDragging] = useState(false);
    const [resizing, setResizing] = useState(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: any, action: any) => {
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
            onDrag(cx + (e.clientX - offset.x), cy + (e.clientY - offset.y));
            setOffset({ x: e.clientX, y: e.clientY });
        } else if (resizing) {
            const dx = e.clientX - offset.x;
            const dy = e.clientY - offset.y;

            if (resizing === 'right') {
                onResize(rx + dx, ry);
            } else if (resizing === 'bottom') {
                onResize(rx, ry + dy);
            } else if (resizing === 'left') {
                onResize(rx - dx, ry);
                onDrag(cx + dx, cy);
            } else if (resizing === 'top') {
                onResize(rx, ry - dy);
                onDrag(cx, cy + dy);
            } else if (resizing === 'bottomRight') {
                onResize(rx + dx, ry + dy);
            } else if (resizing === 'topLeft') {
                onResize(rx - dx, ry - dy);
                onDrag(cx + dx, cy + dy);
            }

            setOffset({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = () => {
        setDragging(false);
        setResizing(null);
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
        <g>
            <ellipse
                cx={cx}
                cy={cy}
                rx={rx}
                ry={ry}
                fill="#000"
                stroke="blue"
                onMouseDown={(e) => handleMouseDown(e, 'drag')}
            />
            {/* Resize handles */}
            <circle
                cx={cx + rx}
                cy={cy}
                r="5"
                fill="red"
                onMouseDown={(e) => handleMouseDown(e, 'right')}
            />
            <circle
                cx={cx}
                cy={cy + ry}
                r="5"
                fill="red"
                onMouseDown={(e) => handleMouseDown(e, 'bottom')}
            />
            <circle
                cx={cx - rx}
                cy={cy}
                r="5"
                fill="red"
                onMouseDown={(e) => handleMouseDown(e, 'left')}
            />
            <circle
                cx={cx}
                cy={cy - ry}
                r="5"
                fill="red"
                onMouseDown={(e) => handleMouseDown(e, 'top')}
            />
            <circle
                cx={cx + rx}
                cy={cy + ry}
                r="5"
                fill="blue"
                onMouseDown={(e) => handleMouseDown(e, 'bottomRight')}
            />
            <circle
                cx={cx - rx}
                cy={cy - ry}
                r="5"
                fill="blue"
                onMouseDown={(e) => handleMouseDown(e, 'topLeft')}
            />
        </g>
    );
};

export default Circle;
