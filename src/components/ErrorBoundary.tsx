import { Component, type ErrorInfo, type ReactNode } from 'react'

type Props = { children: ReactNode; title?: string }
type State = { error: Error | null }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="flex min-h-[50vh] items-center justify-center px-4 py-16">
          <div className="max-w-md rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-8 text-center">
            <p className="font-display text-lg font-semibold text-white">
              {this.props.title ?? 'Something went wrong'}
            </p>
            <p className="mt-2 text-sm text-fog">
              {this.state.error.message || 'An unexpected error occurred.'}
            </p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="btn-primary mt-6 !min-h-11"
            >
              Reload page
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
