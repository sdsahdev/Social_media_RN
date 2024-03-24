import{createSlice} from '@reduxjs/toolkit'

const AuthSlice = createSlice({
    name: 'auth',
    initialState: {
        data: null,
    },
    reducers: {
        setAuthdata: (state, action) => {
            state.data = action.payload;
        },
        logout: (state) => {
            state.isAuthenticated = false
        }
    }
})

export const {setAuthdata} = AuthSlice.actions
export default AuthSlice.reducer