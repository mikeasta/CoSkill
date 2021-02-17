// Dependencies
import React from 'react';
import { BrowserRouter as Router} from "react-router-dom";
import { Provider } from "react-redux";

// Components
import ErrorBoundary from "./components/error-boundary";
import Routes from "./components/routes";
import Header from "./components/header";

import store from "./store";

const App = () => {
    return  (
        <ErrorBoundary>
            <Provider store={store}>
                <Router>
                    <Header />
                    <Routes />
                </Router>
            </Provider>
        </ErrorBoundary>
    )
};

export default App;