import { configureStore } from "@reduxjs/toolkit";
// import authReducer from './reducers/auth'
import payReducer from './reducers/pay'
import buttonReducer from './reducers/pay'


const store = configureStore({
    reducer: {
        // auth: authReducer,
        pay: payReducer,
        button: buttonReducer
    }
})

// Infer the RootState and AppDispatch types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
export default store;