import toolState from "../store/toolState";
import Tool from "./Tool";

export default class Fill extends Tool{
  constructor(canvas, socket, id){
    super(canvas, socket, id);
    this.listen();
  }

  listen() {
    this.canvas.onmouseup = this.mouseUpHandler.bind(this);
  }

  mouseUpHandler(e) {
    const style = toolState.getStyleTool();
    const { x, y } = this.currentPos(e);

    this.socket.send(JSON.stringify({
      method: 'draw',
      id: this.id,
      figure: {
        type: 'fillCanvas',
        x,
        y,
        ...style
      }
    }))
  }

  static fillCanvas(ctx, x, y){
    const color = toolState.getFillColor()
    const colorR = parseInt(color.slice(1, 3), 16)
    const colorG = parseInt(color.slice(3, 5), 16)
    const colorB = parseInt(color.slice(5), 16)
    const imageData = ctx.getImageData(0, 0, toolState.widthCanvas, toolState.heightCanvas);
    const width = imageData.width;
    const height = imageData.height;
    const thisColorR = imageData.data[y * 4 * width + x * 4 + 0];
    const thisColorG = imageData.data[y * 4 * width + x * 4 + 1];
    const thisColorB = imageData.data[y * 4 * width + x * 4 + 2];
    let stack = [[x, y]];
    let pixel;
    let pointR = 0;
    let pointG = 0;
    let pointB = 0;
    while (stack.length > 0) {
      pixel = stack.pop();
      if (pixel[0] < 0 || pixel[0] >= width)
        continue;
      if (pixel[1] < 0 || pixel[1] >= height)
        continue;

      pointR = pixel[1] * 4 * width + pixel[0] * 4 + 0;
      pointG = pixel[1] * 4 * width + pixel[0] * 4 + 1;
      pointB = pixel[1] * 4 * width + pixel[0] * 4 + 2;

      // Якщо колір не відрізняється від кольору почтакової точки і її ще не зафарбували
      if (
        (imageData.data[pointR] === thisColorR &&
        imageData.data[pointG] === thisColorG &&
        imageData.data[pointB] === thisColorB)) {
        // зафарбовуємо
        imageData.data[pointR] = colorR;
        imageData.data[pointG] = colorG;
        imageData.data[pointB] = colorB;

        // Ставимо сусідів в стек на перевірку
        stack.push([
          pixel[0] - 1,
          pixel[1]
        ]);
        stack.push([
          pixel[0] + 1,
          pixel[1]
        ]);
        stack.push([
          pixel[0],
          pixel[1] - 1
        ]);
        stack.push([
          pixel[0],
          pixel[1] + 1
        ]);
      }
    }
    ctx.putImageData(imageData, 0, 0);
  }
}