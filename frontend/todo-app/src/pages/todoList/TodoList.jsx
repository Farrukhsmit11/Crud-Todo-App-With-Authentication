import React, { useState } from 'react'
import "./TodoList.css"
import { MdEdit } from "react-icons/md";
import { Button, Form, Input, message, Spin } from "antd"
import { PlusOutlined } from "@ant-design/icons"
import { CiEdit } from "react-icons/ci";
import { FiTrash2 } from "react-icons/fi";
import { CiLogout } from "react-icons/ci";
import { useNavigate } from "react-router-dom"

export const getUrl = () => {
  const isProduction = window.location.href.includes("https")
  const baseUrl = isProduction ?
    "https://crud-todo-app-three.vercel.app"
    : "http://localhost:3000"
  return baseUrl
}

const TodoList = () => {

  const [form] = Form.useForm();
  const [todos, setTodos] = useState([])
  const [inputValue, setInputValue] = useState("");
  const [editText, setEditText] = useState("");
  const [editId, setEditId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const navigate = useNavigate()

  return (
    <div className="todo-container">
      <div className="todo-card">
        <div className="header">

          <div className="logout-main">
            <Button
              onClick={() => navigate("/login")}
              icon={<CiLogout />}
              className='logout-btn'
            >Logout</Button>
          </div>
          <h1 className="todo-title">Todo App</h1>
          <p className='todo-description'>Organize your tasks. Stay productive!</p>
        </div>

        <Form
          // onFinish={addTodo}
          layout='vertical'
          form={form}
          className='todo-form'
        >
          <Form.Item
          >
            <Input
              type="text"
              placeholder="What’s on your mind today?"
              prefix={<CiEdit className='add-task-input-icon' />}
              className="todo-input"
              onChange={(e) => setInputValue(e.target.value)}
              value={inputValue}
              name='title'
            />
          </Form.Item>

          <Button
            icon={<PlusOutlined />}
            className="add-task-btn"
            htmlType='submit'
            disabled={!inputValue}
          >
            Add Task
          </Button>

          {/* {IsLoading ? (
            <Spin size="medium" tip="Loading, please wait..." />
          ) : ( */}
          {/* <ul className='list-group'>
              {/* {todos?.map((todo, index) => {
                return (
                  <>
                    <div key={index} className="list-parent"
                    >
                      {editId === todo._id ? (
                        <>
                          <Input
                            className='edit-todo-input'
                            onChange={(e) => setEditText(e.target.value)}
                            placeholder='Edit Todo'
                            defaultValue={todo.title}
                          ></Input>
                          <Button
                            disabled={!editText}
                            onClick={() => {
                              setEditText("")
                              setEditId(null)
                              editTodo(todo._id)
                            }}
                            className='save-btn'>Save</Button>
                        </>
                      ) : (
                        <li className='list-item'>{todo.title}
                          <div className="buttons-main">
                            <Button
                              icon={<MdEdit />}
                              onClick={() => {
                                setEditId(todo._id)
                              }}
                              className='edit-btn'
                            ></Button>

                            <Button
                              icon={<FiTrash2 size={18} />}
                              className='delete-btn'
                              onClick={() => deleteTodo()}
                            ></Button>
                          </div>
                        </li>
                      )}
                    </div>
                  </>
                )
              })} */}
          {/* </ul>  */}
        </Form>
      </div>
    </div >

  )
}

export default TodoList