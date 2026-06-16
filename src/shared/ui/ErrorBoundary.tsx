"use client";

import { Component, ReactNode } from "react";
import { GuineaPigMascotIcon } from "./icons";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div role="alert" className="min-h-screen flex items-center justify-center bg-page px-4">
          <div className="text-center max-w-sm">
            <GuineaPigMascotIcon className="w-28 h-28 mb-4 block mx-auto" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              앗, 문제가 발생했어요
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              {this.state.error?.message ?? "예기치 못한 오류가 발생했습니다."}
            </p>
            <button
              onClick={this.handleReset}
              className="rounded-xl bg-brand px-6 py-2 text-sm font-semibold text-white hover:bg-brand-hover transition-colors cursor-pointer"
            >
              다시 시도하기
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
