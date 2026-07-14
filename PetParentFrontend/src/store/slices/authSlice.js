import { createSlice } from "@reduxjs/toolkit";

const authslice = createSlice({
    name:'auth',
    initialState:{
        token:null,
        isActive:null,
        role:null,
        user:null,
        
    },
    reducers:{
        userAuth:(state,action)=>{
            state.isActive=action.payload.isActive;
            state.role = action.payload.role;
            state.user = action.payload.user;
        },
        resetToken:(state,action)=>{
      
            state.token = action.payload;
        }
    }
})

export const {userAuth,resetToken} = authslice.actions;
export default authslice.reducer;