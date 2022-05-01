import Canvas from "./components/Canvas";
import SettingBar from "./components/SettingBar";
import Toolbar from "./components/Toolbar";
import {BrowserRouter, Routes, Route, Navigate} from 'react-router-dom'
import "./styles/app.scss"

function App() {
  const app = () => {
    return(
      <>
        <Toolbar />
        <SettingBar />
        <Canvas />
      </>
    )
  }

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<Navigate to={`f${(+new Date).toString(16)}`} />}/>
          <Route path="/:id" element = {app()}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
