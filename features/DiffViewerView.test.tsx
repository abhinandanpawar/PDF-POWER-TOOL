import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DiffViewerView from './DiffViewerView';
import React from 'react';

// Mock the react-diff-viewer-continued library
vi.mock('react-diff-viewer-continued', () => ({
  __esModule: true,
  default: ({ oldValue, newValue }: { oldValue: string; newValue: string }) => (
    <div>
      <div>{oldValue}</div>
      <div>{newValue}</div>
    </div>
  ),
}));

describe('DiffViewerView', () => {
  it('renders correctly', () => {
    render(<DiffViewerView onBack={() => {}} />);
    expect(screen.getByText('Visual Diff Viewer')).toBeInTheDocument();
    expect(screen.getByText('Compare two text files to see the differences.')).toBeInTheDocument();
    expect(screen.getByLabelText('Original Text')).toBeInTheDocument();
    expect(screen.getByLabelText('New Text')).toBeInTheDocument();
  });
});
