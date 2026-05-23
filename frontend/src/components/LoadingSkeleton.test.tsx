import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingSkeleton from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders 3 text skeletons by default', () => {
    const { container } = render(<LoadingSkeleton />);
    const items = container.querySelectorAll('.kr-skeleton-text');
    expect(items.length).toBe(3);
  });

  it('renders specified count', () => {
    const { container } = render(<LoadingSkeleton count={5} />);
    expect(container.querySelectorAll('.kr-skeleton').length).toBe(5);
  });

  it('renders title type', () => {
    const { container } = render(<LoadingSkeleton type="title" count={1} />);
    expect(container.querySelector('.kr-skeleton-title')).toBeInTheDocument();
  });

  it('renders card type', () => {
    const { container } = render(<LoadingSkeleton type="card" count={2} />);
    expect(container.querySelectorAll('.kr-skeleton-card').length).toBe(2);
  });

  it('last text item has 40% width', () => {
    const { container } = render(<LoadingSkeleton type="text" count={2} />);
    const last = container.querySelectorAll('.kr-skeleton-text')[1];
    expect(last.style.width).toBe('40%');
  });
});
