import {observer} from 'mobx-react-lite'
import React, { useEffect, useRef, useState } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import '../styles/canvas.scss'
import Brush from '../tools/Brush';
import { Modal, Button } from "react-bootstrap";
import { Link, useParams } from 'react-router-dom';
import pictureService from '../services/pictureService';
import env from "react-dotenv"
import tools from '../tools/tools';


const Canvas = observer(() => {
  const canvasRef = useRef();
  const usernameRef = useRef();
  const [modal, setModal] = useState(true);
  const [pictures, setPictures] = useState([]);
  const params = useParams();
  const URL_WS = env.URL_WS || '';

  //встановлення канвасу
  useEffect(() => {
    canvasState.setCanvas(canvasRef.current);
  }, []);

  //отримання всіх зображень
  useEffect(() => {
    pictureService.getAllPictures()
      .then(data => {
        setPictures(data);
      });
  }, []);

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
  }, [canvasState.username, params.id]);

  //отримання поточного зображення і завантаження його
  useEffect(() => {
    const id = params.id;

    canvasState.clearCanvas();
    
    pictureService.getPicture(id)
      .then(data => {
        if (data?.picture) {
          //console.log("Малюнок отримано");
          canvasState.data = data.picture;
          canvasState.setPicture();
        }
      });
  }, [params.id]);

  const mouseDownHandler = (e) => {
    canvasState.pushToUndo(canvasRef.current.toDataURL());
  }

  const mouseUpHandler = (e) => {
    canvasState.uploadPicture();
  }

  const drawHandler = (msg) => {
    const figure = msg.figure;
    //const ctx = canvasRef.current.getContext('2d');
    toolState.drawHandler(figure);
  }

  const onloadHandler = (e) => {
    canvasState.setPicture();
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
            <input 
              type='text' 
              ref={usernameRef} />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" onClick={() => connectionHandler()}>
              Увійти
            </Button>
          </Modal.Footer>
        </Modal>
        <ul className='links'>
        <li><Link to={`/${tools.getNewId()}`} >Новий малюнок</Link></li>
          {pictures.map((picture) => {
            const nav = `/${picture.session}`;
            return (<li key={picture._id}><Link to={nav} >{picture.session}</Link></li>)
          })}
        </ul>
      <canvas 
        onMouseDown={e => mouseDownHandler(e)} 
        onMouseUp={e => mouseUpHandler(e)} 
        onLoad={e => onloadHandler(e)}
        ref={canvasRef} 
        width={toolState.widthCanvas} 
        height={toolState.heightCanvas} 
      />
    </div>
  );
});

export default Canvas;