import { render, screen, fireEvent } from '../tests/test-utils';
import { describe, it, expect, vi } from 'vitest';
import ConfigConverterView from './ConfigConverterView';
import React from 'react';

describe('ConfigConverterView', () => {
  it('renders correctly', () => {
    render(<ConfigConverterView onBack={() => {}} />);
    expect(screen.getByText('Config Converter')).toBeInTheDocument();
    expect(screen.getByText('Convert between different configuration file formats.')).toBeInTheDocument();
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
    expect(screen.getByLabelText('Input')).toBeInTheDocument();
    expect(screen.getByLabelText('Output')).toBeInTheDocument();
  });

  it('converts JSON to YAML', () => {
    render(<ConfigConverterView onBack={() => {}} />);
    const input = screen.getByLabelText('Input');
    const from = screen.getByLabelText('From');
    const to = screen.getByLabelText('To');
    const convertButton = screen.getByRole('button', { name: 'Convert' });
    const output = screen.getByLabelText('Output');

    fireEvent.change(from, { target: { value: 'json' } });
    fireEvent.change(to, { target: { value: 'yaml' } });
    fireEvent.change(input, { target: { value: '{"a": 1}' } });
    fireEvent.click(convertButton);

    expect(output).toHaveValue('a: 1\n');
  });
});
