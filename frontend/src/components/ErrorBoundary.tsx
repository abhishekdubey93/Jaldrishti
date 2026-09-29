import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
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
    console.error('JalDrishti React ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[300px] my-6 p-6 bg-white rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-full">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {this.props.fallbackTitle || 'Unable to load screen'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
              An error occurred while rendering weather data. Please check your backend connection or tap below to refresh.
            </p>
          </div>
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition flex items-center space-x-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry / Refresh</span>
            </button>
            <a
              href="/"
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl text-xs font-bold hover:bg-slate-200 transition flex items-center space-x-1.5"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Go Home</span>
            </a>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
