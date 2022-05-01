import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Rect extends Tool{
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
        type: 'rect',
        x: this.startX,
        y: this.startY,
        w: this.width,
        h: this.height,
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
      let currentX = x;
      let currentY = y;
      this.width = currentX - this.startX;
      this.height = currentY - this.startY;
      
      this.draw(this.startX, this.startY, this.width, this.height);
    }
  }

  draw(x, y, w, h){
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, toolState.widthCanvas, toolState.heightCanvas);
      this.ctx.drawImage(img, 0, 0, toolState.widthCanvas, toolState.heightCanvas);
      
      Rect.drawRect(this.ctx, x, y, w, h);
    }
  }

  static drawRect(ctx, x, y, w, h) {
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.fill();
    ctx.stroke();
  }
}