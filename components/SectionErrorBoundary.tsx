"use client";

import { Component, type ReactNode } from "react";

interface SectionErrorBoundaryProps {
  children: ReactNode;
  label: string;
}

interface SectionErrorBoundaryState {
  hasError: boolean;
}

/**
 * SectionErrorBoundary
 * ---------------------
 * Wraps an individual page section so that if it throws during render or
 * a lifecycle method, only THAT section disappears — the rest of the page
 * (and any sections after it) keep rendering normally. Without this, an
 * uncaught error in one client component can blank out everything below
 * it in the tree, which is hard to diagnose from the outside since the
 * page just looks "cut short" with no visible error.
 */
export class SectionErrorBoundary extends Component<
  SectionErrorBoundaryProps,
  SectionErrorBoundaryState
> {
  constructor(props: SectionErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error(`[SectionErrorBoundary] "${this.props.label}" failed:`, error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            padding: "60px 24px",
            textAlign: "center",
            color: "rgba(245, 241, 234, 0.5)",
            fontSize: "13px",
          }}
        >
          This section ({this.props.label}) couldn&apos;t load. Check the
          browser console for details.
        </div>
      );
    }
    return this.props.children;
  }
}
