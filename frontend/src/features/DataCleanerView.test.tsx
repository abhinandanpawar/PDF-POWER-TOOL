import { render, screen, fireEvent } from '../src/tests/test-utils';
import { describe, it, expect } from 'vitest';
import DataCleanerView from './DataCleanerView';
import React from 'react';

describe('DataCleanerView', () => {
  it('renders correctly', () => {
    render(<DataCleanerView onBack={() => {}} />);
    expect(screen.getByText('Data Cleaner')).toBeInTheDocument();
    expect(screen.getByText('Clean and transform your text data.')).toBeInTheDocument();
    expect(screen.getByLabelText('Input')).toBeInTheDocument();
    expect(screen.getByLabelText('Output')).toBeInTheDocument();
  });

  it('trims leading/trailing whitespace', () => {
    render(<DataCleanerView onBack={() => {}} />);
    const input = screen.getByLabelText('Input');
    const output = screen.getByLabelText('Output');
    const trimButton = screen.getByRole('button', { name: 'Trim Lines' });

    fireEvent.change(input, { target: { value: '  line1  \n  line2  ' } });
    fireEvent.click(trimButton);

    expect(output).toHaveValue('line1\nline2');
  });

  it('removes duplicate lines, ignoring leading/trailing whitespace', () => {
    render(<DataCleanerView onBack={() => {}} />);
    const input = screen.getByLabelText('Input');
    const output = screen.getByLabelText('Output');
    const removeDuplicatesButton = screen.getByRole('button', { name: 'Remove Duplicate Lines' });

    fireEvent.change(input, { target: { value: '  line1  \nline1\n  line2' } });
    fireEvent.click(removeDuplicatesButton);

    // The bug is that '  line1  ' and 'line1' are treated as different.
    // The corrected implementation should trim lines before comparing them.
    // However, the current implementation doesn't join the lines back correctly after trimming for uniqueness.
    // Let's expect the buggy output first to confirm the test fails as expected.
    // The buggy output would be '  line1  \nline1\n  line2' because Set would see them as unique.
    // The desired output is 'line1\nline2'.
    // Let's write the test for the desired output.
    expect(output).toHaveValue('line1\nline2');
  });
});
