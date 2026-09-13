import { createSlice } from "@reduxjs/toolkit"
import { getProfile, handleLogin } from "./authThunk"

const initialState = {
    user: {},
    isLoggedIn: false,
    loginLoading: false,
    signUpLoading: false,
    loading: false,
    error: null,
    getProfileLoading: false
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(handleLogin.pending, (state) => {
                state.loginLoading = true
            })

            .addCase(handleLogin.fulfilled, (state, action) => {
                state.loginLoading = false
                state.user = action.payload.user
                state.isLoggedIn = true
            })

            .addCase(handleLogin.rejected, (state) => {
                state.loginLoading = false
            }),

            builder
                .addCase(getProfile.pending, (state) => {
                    state.getProfileLoading = true
                })

                .addCase(getProfile.fulfilled, (state) => {
                    state.isLoggedIn = true
                })

                .addCase(getProfile.rejected, (state) => {
                    state.getProfileLoading = false
                })
    }
})

export default authSlice.reducer