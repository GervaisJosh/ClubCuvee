import { jsx as _jsx } from "react/jsx-runtime";
import { Component } from "react";
class ErrorBoundary extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            hasError: false
        };
    }
    static getDerivedStateFromError(_) {
        return { hasError: true };
    }
    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
    }
    render() {
        if (this.state.hasError) {
            return _jsx("h1", { children: "Sorry.. there was an error" });
        }
        return this.props.children;
    }
}
export default ErrorBoundary;
