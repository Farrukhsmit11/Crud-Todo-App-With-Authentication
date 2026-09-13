import { Formik } from 'formik'
import { useState } from 'react'
import { Form as AntForm, Button, Input } from "antd"
import "./SignUp.css"
import { useNavigate } from "react-router-dom"
import { useDispatch } from 'react-redux'
import { handleSignUp } from '../../../store/features/auth/authThunk'

const SignUp = () => {

    const [form] = AntForm.useForm()
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const initialValues = {
        name: "",
        email: "",
        password: ""
    }

    const navigate = useNavigate();

    const dispatch = useDispatch()

    const handleSubmit = async () => {
        try {
            await dispatch(handleSignUp({
                name,
                email,
                password
            })).unwrap()
        } catch (error) {
            console.error("Error while Creating User", error)
        }
    }

    return (
        <div className='auth-container'>
            <div className="auth-card">
                <h1 className='auth-title'>Sign Up</h1>

                <Formik
                    initialValues={initialValues}
                >
                    {({
                        handleBlur,
                        values,
                        errors,
                        touched
                    }) => (
                        <AntForm
                            layout='vertical'
                            form={form}
                            onFinish={handleSubmit}
                            method='POST'
                            action="/signup"
                        >
                            <AntForm.Item
                                label={<span className='form-label'>Name</span>}

                            >
                                <Input
                                    onChange={(e) => setName(e.target.value)}
                                    onBlur={handleBlur}
                                    value={name}
                                    className='form-input'
                                    placeholder='Enter Name'
                                    name='name'
                                ></Input>
                            </AntForm.Item>

                            <AntForm.Item
                                label={<span className='form-label'>Email</span>}
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
                                <Input
                                    onChange={(e) => setPassword(e.target.value)}
                                    onBlur={handleBlur}
                                    value={password}
                                    className='form-input'
                                    placeholder='Enter Password'
                                    name='password'
                                ></Input>
                            </AntForm.Item>

                            <div className="signup-card-footer">
                                <Button
                                    onClick={() => handleSubmit()}
                                    type='primary'
                                    htmlType='submit'
                                    className='submit-btn'
                                >Sign Up</Button>

                                <Button
                                    onClick={() => navigate("/")}
                                    type='primary'
                                    className='submit-btn-black'
                                >Log in</Button>
                            </div>
                        </AntForm>
                    )
                    }
                </Formik>
            </div>
        </div>
    )
}

export default SignUp