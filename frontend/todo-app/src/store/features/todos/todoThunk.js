import { createAsyncThunk } from "@reduxjs/toolkit"
import { get, post } from "../../../utils/constant"
import { put } from "../../../utils/apiMethods"

export const getTodos = createAsyncThunk(
    "/todos/getTodos",
    async (_, { rejectWithValue }) => {
        try {
            const response = await get("/todos")
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const addTodo = createAsyncThunk(
    "/todos/addTodo",
    async ({ title }, { rejectWithValue }) => {
        try {
            await post("/add-todos", {
                title
            }).unwrap()
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const deleteTodo = createAsyncThunk(
    "/todos/deleteTodo",
    async (_, { rejectWithValue }) => {
        try {
            const deleteTodo = await delete ("/delete-todos")
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const editTodo = createAsyncThunk(
    "todos/editTodo",
    async ({ title }) => {
        try {
            const res = await put("/edit-todos", {
                title
            })

            getTodos()
            
        } catch (error) {
        }
    },
)