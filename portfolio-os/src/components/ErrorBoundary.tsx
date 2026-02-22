import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { LuTriangleAlert } from 'react-icons/lu';

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRestart = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen w-screen flex-col items-center justify-center bg-gray-900 text-white p-4">
          <div className="glass-panel p-8 rounded-2xl flex flex-col items-center max-w-md text-center border border-white/10 bg-black/40 backdrop-blur-xl">
            <div className="mb-4 text-amber-500">
              <LuTriangleAlert size={64} />
            </div>
            <h1 className="text-2xl font-bold mb-2">System Error</h1>
            <p className="text-gray-400 mb-6">
              The system encountered an unexpected error and needs to restart.
            </p>
            {import.meta.env.DEV && this.state.error && (
              <div className="w-full mb-6 p-4 bg-black/50 rounded-lg text-left overflow-auto max-h-40 text-xs font-mono text-red-300 border border-red-900/30">
                {this.state.error.toString()}
              </div>
            )}
            <div className="flex gap-4">
              <button
                onClick={this.handleRestart}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium shadow-lg shadow-blue-900/20"
              >
                Restart System
              </button>
              <a
                href="https://github.com/yourusername/portfolio-os/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors font-medium border border-white/10"
              >
                Report Bug
              </a>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
