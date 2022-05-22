import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Spray extends Tool{
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
        figure:{
          type: 'finish_brush',
          x: 0,
          y: 0,
          ...style
        }
      }))
  }

  mouseDownHandler(e) {
    this.mouseDown = true;

    this.ctx.beginPath();

    const {x, y} = this.currentPos(e);
    this.ctx.moveTo(x, y)
  }

  mouseMoveHandler(e) { 
    if (this.mouseDown) {
      const { x, y } = this.currentPos(e);
      //this.draw(x, y);
      const style = toolState.getStyleTool();
      
      this.socket.send(JSON.stringify({
        method: 'draw',
        id: this.id,
        figure:{
          type: 'spray',
          x,
          y,
          ...style
        }
      }))
    }
  }

  static draw(ctx, x, y){
    const lineWidth = toolState.getLineWidth()
    const spray_size = lineWidth + 10;

    ctx.rect(x, y, 1, 1);
    for (let i = 11; i--;) {
      ctx.rect(x + Math.random() * spray_size - spray_size / 2,
        y + Math.random() * spray_size - spray_size / 2,
        1, 1);
      ctx.fill();
    }
  }
}