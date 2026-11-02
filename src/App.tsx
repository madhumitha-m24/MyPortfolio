import Scene from './components/Scene'
import Preloader from './components/Preloader'
import Navbar from './components/Navbar'
import CustomCursor from './components/CustomCursor'
import './App.css'

function App() {
  return (
    <>
      <Preloader />
      <CustomCursor />
      <Navbar />
      <Scene />
    </>
  )
}

export default App
