import React, { ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Slope Shield Uncaught Component Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  public override render() {
    if (this.state.hasError) {
      return (
        <div className="p-8 rounded-2xl bg-[#0E1A2C] border border-[#EF4444]/40 text-slate-100 shadow-2xl max-w-3xl mx-auto my-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-[#EF4444]/20 border border-[#EF4444]/40 text-[#EF4444]">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100 font-sans">
                {this.props.fallbackTitle || 'Component Render Recovery'}
              </h3>
              <p className="text-xs text-slate-400 font-mono-tech mt-0.5">
                The application intercepted a runtime exception and maintained container integrity.
              </p>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-[#07111F] border border-[#182B42] text-xs font-mono-tech text-rose-300 overflow-x-auto">
            {this.state.error?.message || 'Unknown runtime error'}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              onClick={this.handleReset}
              variant="primary"
              size="sm"
              icon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reload View
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
