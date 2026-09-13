import { Route, Routes } from 'react-router-dom'
import { ChangePassword, ForgotPassword, Login, ResetPassword, SignUp } from '../pages'

const AuthRoutes = () => {
    return (
        <Routes>
            <Route path='/signUp' element={<SignUp />}></Route>
            <Route path='/' element={<Login />}></Route>
            <Route path='/forgotPassword' element={<ForgotPassword />}></Route>
            <Route path='/resetPassword/:token' element={<ResetPassword />}></Route>
            <Route path='/changePassword' element={<ChangePassword />}></Route>
        </Routes>
    )
}

export default AuthRoutes