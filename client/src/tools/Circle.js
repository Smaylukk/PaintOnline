import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Circle extends Tool{
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
        type: 'circle',
        x: this.startX,
        y: this.startY,
        r: this.radius,
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
      this.radius = Math.sqrt((x - this.startX)**2 + (y - this.startY)**2);
            
      this.draw(this.startX, this.startY, this.radius);
    }
  }

  draw(x, y, r){
    const img = new Image();
    img.src = this.saved;
    img.onload = () => {
      this.ctx.clearRect(0, 0, toolState.widthCanvas, toolState.heightCanvas);
      this.ctx.drawImage(img, 0, 0, toolState.widthCanvas, toolState.heightCanvas);
      
      Circle.drawCircle(this.ctx, x, y, r);
    }
  }

  static drawCircle(ctx, x, y, r) {
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
  }
}