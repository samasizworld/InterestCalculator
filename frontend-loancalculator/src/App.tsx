import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
// import Navbar from "./components/Navbar"

const App = () => {
  const navigate = useNavigate();
  useEffect(() => {
    if (location.pathname == '/') {
      navigate('/members');
    }
  }, [])
  return (
    <>
      {/* <Navbar></Navbar> */}
      <Outlet></Outlet>
    </>
  )
}

export default App
