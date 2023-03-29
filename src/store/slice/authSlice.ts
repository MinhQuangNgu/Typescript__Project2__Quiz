import { user } from './../../model/index';
import { createSlice ,PayloadAction} from "@reduxjs/toolkit";

interface initialState {
    user:user
}
const initialState : initialState = {
    user:{
        image:'',
    name:"",
    token:""
    }
}

const authSlice = createSlice({
    name:"auth",
    initialState,
    reducers:{
        isLogin: (state,action : PayloadAction<user>) => {
            state.user = action.payload;
        },
        isLogout:(state) => {
            state.user = {
                image:"",
                token:"",
                name:""
            };
        }
    }
})

export default authSlice.reducer;
export const {isLogin,isLogout} = authSlice.actions;
