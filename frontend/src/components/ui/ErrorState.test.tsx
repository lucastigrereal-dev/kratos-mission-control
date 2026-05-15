import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorState from './ErrorState';

describe('ErrorState', () => {
  it('renders title and error icon by default', () => {
    render(<ErrorState title="Algo deu errado" />);
    expect(screen.getByText('Algo deu errado')).toBeInTheDocument();
    expect(screen.getByText('⚠')).toBeInTheDocument();
  });

  it('renders warning severity with correct icon', () => {
    render(<ErrorState title="Atenção" severity="warning" />);
    expect(screen.getByText('⚡')).toBeInTheDocument();
  });

  it('renders info severity with correct icon', () => {
    render(<ErrorState title="Info" severity="info" />);
    expect(screen.getByText('ℹ')).toBeInTheDocument();
  });

  it('renders retry button when retryLabel and onRetry provided', () => {
    render(<ErrorState title="Erro" retryLabel="Tentar" onRetry={() => {}} />);
    expect(screen.getByText('Tentar')).toBeInTheDocument();
  });

  it('calls onRetry when button clicked', async () => {
    const onRetry = vi.fn();
    render(<ErrorState title="Erro" retryLabel="Tentar" onRetry={onRetry} />);
    await userEvent.setup().click(screen.getByText('Tentar'));
    expect(onRetry).toHaveBeenCalledOnce();
  });

  it('has alert role', () => {
    render(<ErrorState title="Erro" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<ErrorState title="Erro" description="Detalhes do erro" />);
    expect(screen.getByText('Detalhes do erro')).toBeInTheDocument();
  });
});
