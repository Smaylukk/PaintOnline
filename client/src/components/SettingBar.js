import React from 'react';
import toolState from '../store/toolState';
import canvasState from '../store/canvasState';
import "../styles/toolbar.scss"

const SettingBar = () => {
  return (
    <div className='setting-bar'>
      <label htmlFor='line-width' >Товщина лінії</label>
      <input 
      onChange={e => toolState.setLineWidth(e.target.value)}
      id='line-width' 
      type='number' 
      style={{margin:'0 10px'}}
      min={1} max={50} defaultValue={1}/>

      <label htmlFor='stroke-color' >Колір лінії</label>
      <input
        onChange={e => toolState.setStrokeColor(e.target.value)}
        id='stroke-color'
        type='color'
        style={{ margin: '0 10px' }} />
        <span style={{marginLeft:'auto'}}>Користувач - {canvasState.username}</span>
    </div>
  );
};

export default SettingBar;