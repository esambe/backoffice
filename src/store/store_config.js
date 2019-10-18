import {createStore, applyMiddleware} from  "redux"
import thunkMuddleware from "redux-thunk"
import rootReducer from "../reducers"

const debugware=[]

//Lets add a redux logger if we are in development mode.
if(process.NODE_ENV !== "production"){
    const createLogger = require("redux-logger");
    debugware.push(createLogger({
        collapse:true
    }));
}

/**
 * Configures the store with middlewares and the root reducers and 
 * returns a fresh instance of it.
 * @param {object} initialState The initial state for the store
 */
export default function createApplicationStore(initialState){
    const store = createStore(
        rootReducer,
        initialState,
        applyMiddleware(thunkMuddleware, ...debugware)
    )

    return store;
}