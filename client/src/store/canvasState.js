import { makeAutoObservable } from 'mobx'
import pictureService from '../services/pictureService';
import toolState from './toolState';

class CanvasState {
  canvas = null;
  context = null;
  undoList = [];
  redoList = [];
  username = '';
  socket = null;
  sessionId = null;
  data = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUsername(username){
    this.username = username;
  }

  setSocket(socket){
    this.socket = socket;
  }

  setSessionId(sessionId) {
    this.sessionId = sessionId;
  }

  setCanvas(canvas) {
    this.canvas = canvas;
    this.context = this.canvas.getContext('2d');
  }

  pushToUndo(data) {
    this.undoList.push(data);
  }

  pushToRedo(data) {
    this.redoList.push(data);
  }

  undo() {
    if (this.undoList.length) {
      //відправляємо поточний малюнок в redo
      this.pushToRedo(this.canvas.toDataURL());

      //повертаємо попердній малюнок
      let data = this.undoList.pop();
      const img = new Image();
      img.src = data;
      img.onload = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      }
    } else {
      alert('Це початковий малюнок')
    }
  }

  redo() {
    if (this.redoList.length) {
      //відправляємо поточний малюнок в undo
      this.pushToUndo(this.canvas.toDataURL());

      //повертаємо попердній малюнок
      let data = this.redoList.pop();
      const img = new Image();
      img.src = data;
      img.onload = () => {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      }
    } else {
      alert('Скасованих змін немає')
    }
  }

  setPicture() {
    const img = new Image();
    img.src = this.data;
    img.onload = () => {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.context.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    }
  }

  clearCanvas() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  setUndoList(list){
    this.undoList = list;
  }

  setRedoList(list) {
    this.redoList = list;
  }

  async uploadPicture() {
    const data = {
      session: this.sessionId,
      pictureData: this.canvas.toDataURL(),
      undoList: [],
      redoList: []
    };

    await pictureService.savePicture(data);
  }
}

export default new CanvasState()