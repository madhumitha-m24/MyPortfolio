import Scene from './components/Scene'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import ECEBackground from './components/ece-background/ECEBackground'
import './App.css'

function App() {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <ECEBackground />
      <Navbar />
      <Scene />
    </>
  )
}


export default App
