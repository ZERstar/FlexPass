import React from 'react';

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in the child component tree
 *
 * This component catches errors during rendering, in lifecycle methods,
 * and in constructors of the whole tree below them.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // You can also log the error to an error reporting service here
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render() {
    if (this.state.hasError) {
      // Fallback UI
      return (
        <div className="min-h-screen bg-[#1a1a2e] flex items-center justify-center p-8">
          <div className="max-w-2xl w-full bg-[#242333] rounded-xl p-8 shadow-2xl">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-4xl font-bold text-white mb-4">
                Oops! Something went wrong
              </h1>
              <p className="text-xl text-gray-300 mb-6">
                We're sorry for the inconvenience. The application encountered an unexpected error.
              </p>

              {process.env.NODE_ENV === 'development' && this.state.error && (
                <div className="bg-red-900 bg-opacity-20 border border-red-500 rounded-lg p-4 mb-6 text-left">
                  <p className="text-red-400 font-mono text-sm mb-2">
                    <strong>Error:</strong> {this.state.error.toString()}
                  </p>
                  {this.state.errorInfo && (
                    <details className="text-red-300 font-mono text-xs">
                      <summary className="cursor-pointer mb-2">Stack Trace</summary>
                      <pre className="whitespace-pre-wrap overflow-auto max-h-64">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div className="flex gap-4 justify-center">
                <button
                  onClick={this.handleReset}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-gray-700 text-white rounded-lg font-semibold hover:bg-gray-600 transition-all"
                >
                  Go Home
                </button>
              </div>

              <p className="text-gray-400 text-sm mt-6">
                If this problem persists, please contact support.
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
