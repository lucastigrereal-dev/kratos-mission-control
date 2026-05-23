import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import KratosVisualShell from './KratosVisualShell';

describe('KratosVisualShell', () => {
  it('renders all 5 zones', () => {
    render(
      <KratosVisualShell
        topHud={<span>HUD</span>}
        sidebar={<span>Side</span>}
        rightRail={<span>Rail</span>}
        bottomDock={<span>Dock</span>}
      >
        <span>Main</span>
      </KratosVisualShell>
    );

    expect(screen.getByText('HUD')).toBeInTheDocument();
    expect(screen.getByText('Side')).toBeInTheDocument();
    expect(screen.getByText('Rail')).toBeInTheDocument();
    expect(screen.getByText('Dock')).toBeInTheDocument();
    expect(screen.getByText('Main')).toBeInTheDocument();
  });

  it('renders shell className', () => {
    const { container } = render(
      <KratosVisualShell
        topHud={<span />}
        sidebar={<span />}
        rightRail={<span />}
        bottomDock={<span />}
      >
        <span />
      </KratosVisualShell>
    );
    expect(container.querySelector('.kr-shell')).toBeInTheDocument();
  });
});
