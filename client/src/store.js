// Dependencies
import { createStore, applyMiddleware } from "redux"
import { thunk } from "redux-thunk"

// Reducer
import reducer from "./reducer"

// Store
const store = createStore(reducer, applyMiddleware(thunk));

