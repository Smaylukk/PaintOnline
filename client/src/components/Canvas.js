import {observer} from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss'
import Brush from '../tools/Brush';
import { Modal, Button } from "react-bootstrap";
import { useParams } from 'react-router-dom';
import Rect from '../tools/Rect';
import Circle from '../tools/Circle';
import Eraser from '../tools/Eraser';
import Clear from '../tools/Clear';
import Line from '../tools/Line';


const Canvas = observer(() => {
  const canvasRef = useRef();
  const usernameRef = useRef();
  const [modal, setModal] = useState(true);
  const params = useParams();
  const URL_WS = process.env.ERL_WS || 'ws://localhost:5000/';

  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
  }, [])

  useEffect(() => {
    if (canvasState.username) {
      const socket = new WebSocket(URL_WS);
      
      canvasState.setSocket(socket);
      canvasState.setSessionId(params.id);

      toolState.setTool(new Brush(canvasRef.current, socket, params.id))

      socket.onopen = () => {
        socket.send(JSON.stringify({
          id: params.id,
          username: canvasState.username,
          method: 'connection'
        }))
      }

      socket.onmessage = (event) => {
        let msg = JSON.parse(event.data);
        
        switch (msg.method) {
          case 'connection':
            console.log(msg);   
            break;        
          case 'draw':
            console.log(msg);   
            drawHandler(msg);
            break;

          default:
            break;
        }
      }
    }
  }, [canvasState.username])

  const mouseDownHandler = (e) => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  }

  const drawHandler = (msg) => {
    const figure = msg.figure;
    //const ctx = canvasRef.current.getContext('2d');
    const ctx = toolState.getContext();
    
    //збергіаємо стилі поточного сеанcу
    const curFillColor = toolState.getFillColor();
    const curStrokeColor = toolState.getStrokeColor();
    const curLineWidth = toolState.getLineWidth();

    //встановлюємо стилі, які прийшли
    toolState.setFillColor(figure.fillColor);
    toolState.setStrokeColor(figure.strokeColor);
    toolState.setLineWidth(figure.lineWidth);

    switch (figure.type) {
      case 'brush':
        Brush.draw(ctx, figure.x, figure.y);
        break;
    
      case 'finish_brush':
        ctx.beginPath();
        break;

      case 'rect':
        Rect.drawRect(ctx, figure.x, figure.y, figure.w, figure.h);
        break;

      case 'circle':
        Circle.drawCircle(ctx, figure.x, figure.y, figure.r);
        break;

      case 'line':
        Line.drawLine(ctx, figure.startX, figure.startY, figure.x, figure.y);
        break;

      case 'eraser':
        Eraser.draw(ctx, figure.x, figure.y);
        break;

      case 'finish_eraser':
        ctx.beginPath();
        break;
      
      case 'clearCanvas':
        Clear.clearCanvas(ctx);
        break;

      default:
        break;
    }
    //повертаємо поточні стилі
    toolState.setFillColor(curFillColor);
    toolState.setStrokeColor(curStrokeColor);
    toolState.setLineWidth(curLineWidth);
  }

  const connectionHandler = () => {
    if (usernameRef.current.value) {
      canvasState.setUsername(usernameRef.current.value);
      setModal(false);
    }
  }

  return (
    <div className='canvas'>
      <Modal show={modal} onHide={() => {}}>
          <Modal.Header closeButton>
            <Modal.Title>Введіть ваш нік</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <input type='text' ref={usernameRef}/>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => connectionHandler()}>
              Увійти
            </Button>
          </Modal.Footer>
        </Modal>
      <canvas onMouseDown={e => mouseDownHandler(e)} ref={canvasRef} width={toolState.widthCanvas} height={toolState.heightCanvas} />
    </div>
  );
});

export default Canvas;