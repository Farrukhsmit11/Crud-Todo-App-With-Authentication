import { Formik } from "formik"
import { validationSchema } from './Validation'
import { Form as AntForm, Button, Checkbox, Input } from "antd"
import "./Login.css"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import { useDispatch } from "react-redux"
import { handleLogin } from "../../../store/features/auth/authThunk"

const Login = () => {

  const [form] = AntForm.useForm();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const initialValues = {
    email: "",
    password: ""
  }

  const navigate = useNavigate();

  const dispatch = useDispatch()

  const loginUser = async () => {
    try {
      await dispatch(handleLogin({
        email,
        password
      })).unwrap()
      navigate("/todoList")
    } catch (error) {
      console.error("error while logging in", error)
    }
  }

  return (
    <div className='auth-container'>
      <div className="auth-card">
        <div className="auth-header">
          <h1 className='auth-title'>Login</h1>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
          >
            {({
              handleSubmit,
              handleChange,
              handleBlur,
              values,
              errors,
              touched
            }) => (
              <AntForm
                form={form}
                layout='vertical'
                onFinish={handleSubmit}
              >
                <AntForm.Item
                  label={<span className='form-label'> Email</span>}

                >
                  <Input
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleBlur}
                    value={email}
                    className='form-input'
                    placeholder='Enter Email'
                    name='email'
                  ></Input>
                </AntForm.Item>

                <AntForm.Item

                  label={<span className='form-label'>Password</span>}
                >
                  <Input.Password
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handleBlur}
                    value={password}
                    className='form-input'
                    placeholder='Enter password'
                    name='password'
                  ></Input.Password>
                </AntForm.Item>


                <div className="form-footer">
                  <Checkbox>Remember me</Checkbox>
                  <a
                    onClick={() => navigate("/forgotPassword")}
                    href='#'
                  >
                    Forgot Password?
                  </a>
                </div>

                <div className="btn-main">
                  <Button
                    onClick={() => {
                      loginUser()
                    }}
                    type='primary'
                    className='submit-btn'
                    htmlType='submit'
                  >Log In</Button>
                </div>


                <div className="auth-card-footer">
                  <span>Don,t have an account?

                    <a
                      href='#'
                      onClick={() => navigate("/signUp")}
                    >Sign Up</a>
                  </span>
                </div>
              </AntForm>
            )
            }
          </Formik>
        </div>
      </div>
    </div>
  )
}

export default Login