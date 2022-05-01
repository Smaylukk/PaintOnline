import { makeAutoObservable } from 'mobx'

class CanvasState {
  canvas = null;
  undoList = [];
  redoList = [];
  username = '';
  socket = null;
  sessionId = null;

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
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
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
        let ctx = this.canvas.getContext('2d');
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      }
    } else {
      alert('Скасованих змін немає')
    }
  }
}

export default new CanvasState()