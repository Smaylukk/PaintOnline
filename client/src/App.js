import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import "./styles/app.scss"
import tools from "./tools/tools";

function App() {
  const app = () => {
    return(
      <div className="app">
        <Toolbar />
        <SettingBar />
        <Canvas />
      </div>
    )
  }
  const id = tools.getNewId();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`f${id}`} />}/>
        <Route path="/:id" element = {app()}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
