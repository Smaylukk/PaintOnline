import React, { useState } from 'react';
import canvasState from '../store/canvasState';
import toolState from '../store/toolState';
import "../styles/toolbar.scss"
import Brush from '../tools/Brush';
import Circle from '../tools/Circle';
import Clear from '../tools/Clear';
import Eraser from '../tools/Eraser';
import Line from '../tools/Line';
import Rect from '../tools/Rect';

const Toolbar = () => {
  const [instr, setInstr] = useState(1);

  const changeColor = (e) => {
    toolState.setFillColor(e.target.value);
    //toolState.setStrokeColor(e.target.value);
  }

  return (
    <div className='toolbar'>
      <button 
        className={"toolbar__btn brush" + (instr === 1 ? " active" : "")} 
        title='Кисть'
        onClick={(e) => {
          toolState.setTool(new Brush(canvasState.canvas, canvasState.socket, canvasState.sessionId));
          setInstr(1);
        }}/>
      <button 
        className={"toolbar__btn rect" + (instr === 2 ? " active" : "")}
        title='Прямокутник'
        onClick={(e) => {
          toolState.setTool(new Rect(canvasState.canvas, canvasState.socket, canvasState.sessionId));
          setInstr(2);
        }}/>
      <button 
        className={"toolbar__btn circle " + (instr === 3 ? " active" : "")}
        title='Круг'
        onClick={(e) => {
          toolState.setTool(new Circle(canvasState.canvas, canvasState.socket, canvasState.sessionId));
          setInstr(3);
        }}/>
      <button 
        className={"toolbar__btn eraser " + (instr === 4 ? " active" : "")}
        title='Стирачка' 
        onClick={(e) => {
          toolState.setTool(new Eraser(canvasState.canvas, canvasState.socket, canvasState.sessionId));
          setInstr(4);
        }}/>
      <button 
        className={"toolbar__btn line " + (instr === 5 ? " active" : "")}
        title='Пряма лінія' 
        onClick={(e) => {
          toolState.setTool(new Line(canvasState.canvas, canvasState.socket, canvasState.sessionId));
          setInstr(5);
        }}/>
      <button
        className={"toolbar__btn clear " + (instr === 6 ? " active" : "")}
        title='Очистка'
        onClick={(e) => {
          toolState.setTool(new Clear(canvasState.canvas, canvasState.socket, canvasState.sessionId));
          setInstr(6);
        }} />
      <input 
        onChange={e => changeColor(e)}
        className='toolbar__btn' type={'color'} 
        title='Колір заливки'
        style={{marginLeft:10}} />
      <button 
        onClick={e => canvasState.undo()}
        className='toolbar__btn undo' 
        title='Назад'
      />
      <button 
      onClick={e => canvasState.redo()}
        className='toolbar__btn redo'
        title='Вперед'
      />
      <button 
        className='toolbar__btn save'
        title='Зберегти' 
      />
    </div>
  );
}

export default Toolbar;
