import { createAsyncThunk } from "@reduxjs/toolkit";
import { get, post } from "../../../utils/apiMethods"
import { TOKEN } from "../../../utils/constant";

export const handleSignUp = createAsyncThunk(
    "/auth/signUp",
    async ({ name, email, password }, { rejectWithValue }) => {
        try {
            const data = await post("/signup", {
                name,
                email,
                password
            })
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const handleLogin = createAsyncThunk(
    "/auth/login",
    async ({ email, password }, { rejectWithValue, dispatch }) => {
        try {
            const response = await post("/login", {
                email,
                password
            })
            localStorage.setItem(TOKEN, response?.data?.token)
            dispatch(getProfile())
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)

export const getProfile = createAsyncThunk(
    "/auth/getProfile",
    async (_, { rejectWithValue }) => {
        try {
            const data = await get("/get-profile")
        } catch (error) {
            return rejectWithValue(error.response?.data?.message)
        }
    }
)