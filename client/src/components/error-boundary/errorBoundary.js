import React, { Component, Fragment } from 'react';
import ErrorIndicator from "../error-indicator";

class ErrorBoundary extends Component {
    state = {
        hasError: false
    }

    componentDidCatch(err) {
        this.setState({hasError: true})
    }

    render() {
        return(
            <Fragment>
                {
                    this.state.hasError ? <ErrorIndicator/> : this.props.children
                }
            </Fragment>
        )
    }
}

export default ErrorBoundary;
