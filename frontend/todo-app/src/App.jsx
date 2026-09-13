import { useDispatch, useSelector } from 'react-redux'
import './App.css'
import AppRoutes from './routes/AppRoutes'
import AuthRoutes from './routes/AuthRoutes'
import Loader from './components/loader/Loader'
import { useEffect } from 'react'
import { TOKEN } from "./utils/constant"
import { getProfile } from './store/features/auth/authThunk'

function App() {

  const { loading, isLoggedIn } = useSelector((state) => state.auth)
  console.log("LOADING:", loading)
  console.log("IS LOGGED IN:", isLoggedIn)

  const dispatch = useDispatch()

  useEffect(() => {
    const token = localStorage.getItem(TOKEN)
    if (token) {
      dispatch(getProfile())
    }
  }, [])

  if (loading) {
    return <Loader />
  }

  if (!isLoggedIn) {
    return <AuthRoutes />
  }

  if (isLoggedIn) {
    return <AppRoutes />
  }

  return (
    <>

    </>
  )
}

export default App