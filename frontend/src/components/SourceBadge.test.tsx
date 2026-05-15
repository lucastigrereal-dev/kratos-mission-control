import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SourceBadge from './SourceBadge';

describe('SourceBadge', () => {
  it('renders "ao vivo" for live source', () => {
    render(<SourceBadge source="live" />);
    expect(screen.getByText('ao vivo')).toBeInTheDocument();
  });

  it('renders "cache" for cached source', () => {
    render(<SourceBadge source="cached" />);
    expect(screen.getByText('cache')).toBeInTheDocument();
  });

  it('renders "erro" for error source', () => {
    render(<SourceBadge source="error" />);
    expect(screen.getByText('erro')).toBeInTheDocument();
  });

  it('hides label in compact mode', () => {
    render(<SourceBadge source="live" compact />);
    expect(screen.queryByText('ao vivo')).not.toBeInTheDocument();
  });

  it('uses custom label when provided', () => {
    render(<SourceBadge source="live" label="custom" />);
    expect(screen.getByText('custom')).toBeInTheDocument();
  });

  it('renders with title attribute', () => {
    render(<SourceBadge source="live" />);
    expect(screen.getByTitle('Fonte dos dados: ao vivo')).toBeInTheDocument();
  });
});
