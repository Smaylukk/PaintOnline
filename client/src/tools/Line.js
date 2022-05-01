import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Line extends Tool{
  constructor(canvas, socket, id){
    super(canvas, socket, id);
    this.listen();
  }

  listen(){
    this.canvas.onmousemove = this.mouseMoveHandler.bind(this);
    this.canvas.onmousedown = this.mouseDownHandler.bind(this);
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  mouseUpHandler(e){
    this.mouseDown = false;

    const style = toolState.getStyleTool();

    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'line',
        startX: this.startX,
        startY: this.startY,
        x: this.x,
        y: this.y,
        ...style
      }
    }))
  }

  mouseDownHandler(e) {
    this.mouseDown = true;
    
    const { x, y } = this.currentPos(e);
    this.startX = x;
    this.startY = y;
    this.saved = this.canvas.toDataURL();
  }

  mouseMoveHandler(e) { 
    if (this.mouseDown) {
      const { x, y } = this.currentPos(e);
      this.x = x;
      this.y = y;

      this.draw();
    }
  }

  draw(){
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
      
      Line.drawLine(this.ctx, this.startX, this.startY, this.x, this.y);
    }
  }

  static drawLine(ctx, startX, startY, x, y) {
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(x, y);
    ctx.stroke();
  }
}