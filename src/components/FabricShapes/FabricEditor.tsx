/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fabric from "fabric";
import { useEffect, useRef } from "react";
import { calloutPoints } from "../../utils/calloutPoints";
import GroupWithPolygon from "../../utils/fabricPolygon";


const FabricEditor = () => {
    const fabricCanvas = useRef<fabric.Canvas>() as React.MutableRefObject<fabric.Canvas>;
    useEffect(()=> {
        const canvasDiv = document.getElementById('canvas-div') as HTMLCanvasElement;
        if(canvasDiv){
            fabricCanvas.current = new fabric.Canvas(canvasDiv, { width: 800, height: 800 });
        }

        return () => {
            if(fabricCanvas.current) {
                fabricCanvas.current.dispose();
            }
        }
    }, [])

    const handleAddRectangle = () => {
        const rect = new fabric.Rect({
            width: 200,
            height: 100,
            strokeWidth: 4,
            fill: '#d9d9d9',
            stroke: '#000', 
            lockRotation: true,
			objectCaching: true,
			noScaleCache: true,
			strokeUniform: true,
			transparentCorners: false,
			cornerColor: '#000',
			cornerStyle: 'circle',
			cornerSize: 8,
			cornerStrokeColor: '#1d7bb9',
        })

        fabricCanvas.current.add(rect);
        fabricCanvas.current.renderAll();
    }

     const handleAddText = (type: string) => {
        const points = calloutPoints(type);
        if (points.points.length === 0) return;
        const polygon = new GroupWithPolygon(points?.points, {
            left: 100,
            top: 50,
            fill: '#D81B60',
            scaleX: 1,
            scaleY: 1,
            lockRotation: true,
            objectCaching: false,
            transparentCorners: false,
            cornerColor: 'blue',
        }, fabricCanvas.current, points?.pointIndex);
       fabricCanvas.current.clear();
       fabricCanvas.current.add(polygon);
       fabricCanvas.current.renderAll();
    }

  return (
   <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px'}}>
    <div>FabricEditor</div>
    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '800px', padding: '10px', gap: '20px'}}>
        <button onClick={handleAddRectangle}>Rectangle</button>
        <button onClick={()=> handleAddText('bottom')}>Callout bottom</button>
        <button onClick={()=> handleAddText('top')}>Callout top</button>
        <button onClick={()=> handleAddText('left')}>Callout left</button>
        <button onClick={()=> handleAddText('right')}>Callout right</button>
    </div>
    <canvas id='canvas-div'/>
   </div>
  )
}

export default FabricEditor