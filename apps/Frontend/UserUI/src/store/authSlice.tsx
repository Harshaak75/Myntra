import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Userdata {
    email: string | null,
    user_id: string | null,
}

const initialState: Userdata  = {
    email: null,
    user_id: null
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers:{
        setEmail:(state, actions: PayloadAction<{email: string | null}>) =>{
            state.email = actions.payload.email;
        },
        setUserid:(state, actions) =>{
            state.user_id = actions.payload.user_id;
        },
        logOut:(state) =>{
            state.email = null;
            state.user_id = null;
        }
    }
})


export const {setEmail, setUserid, logOut} = authSlice.actions;
export const authReducer = authSlice.reducer;