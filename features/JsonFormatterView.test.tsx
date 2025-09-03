import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import JsonFormatterView from './JsonFormatterView';
import React from 'react';

// Mock the useToasts hook
vi.mock('../hooks/useToasts', () => ({
  useToasts: () => ({
    addToast: vi.fn(),
  }),
}));

describe('JsonFormatterView', () => {
  it('renders correctly', () => {
    render(<JsonFormatterView onBack={() => {}} />);
    expect(screen.getByText('JSON Formatter')).toBeInTheDocument();
    expect(screen.getByText('Format or minify your JSON data.')).toBeInTheDocument();
    expect(screen.getByLabelText('JSON Input')).toBeInTheDocument();
    expect(screen.getByLabelText('Formatted JSON')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Format' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Minify' })).toBeInTheDocument();
  });

  it('formats JSON correctly', () => {
    render(<JsonFormatterView onBack={() => {}} />);
    const input = screen.getByLabelText('JSON Input');
    const formatButton = screen.getByRole('button', { name: 'Format' });
    const output = screen.getByLabelText('Formatted JSON');

    fireEvent.change(input, { target: { value: '{"a":1,"b":2}' } });
    fireEvent.click(formatButton);

    expect(output).toHaveValue(JSON.stringify({ a: 1, b: 2 }, null, 2));
  });

  it('minifies JSON correctly', () => {
    render(<JsonFormatterView onBack={() => {}} />);
    const input = screen.getByLabelText('JSON Input');
    const minifyButton = screen.getByRole('button', { name: 'Minify' });
    const output = screen.getByLabelText('Formatted JSON');

    fireEvent.change(input, { target: { value: '{\n  "a": 1,\n  "b": 2\n}' } });
    fireEvent.click(minifyButton);

    expect(output).toHaveValue(JSON.stringify({ a: 1, b: 2 }));
  });
});
