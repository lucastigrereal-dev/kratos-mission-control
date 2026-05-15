import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders title', () => {
    render(<EmptyState title="Nada aqui" />);
    expect(screen.getByText('Nada aqui')).toBeInTheDocument();
  });

  it('renders description when provided', () => {
    render(<EmptyState title="Vazio" description="Nenhum item ainda" />);
    expect(screen.getByText('Nenhum item ainda')).toBeInTheDocument();
  });

  it('renders action button when actionLabel and onAction provided', () => {
    const onAction = vi.fn();
    render(<EmptyState title="Vazio" actionLabel="Criar" onAction={onAction} />);
    expect(screen.getByText('Criar')).toBeInTheDocument();
  });

  it('calls onAction when button clicked', async () => {
    const onAction = vi.fn();
    render(<EmptyState title="Vazio" actionLabel="Criar" onAction={onAction} />);
    await userEvent.setup().click(screen.getByText('Criar'));
    expect(onAction).toHaveBeenCalledOnce();
  });

  it('does not render button without onAction', () => {
    render(<EmptyState title="Vazio" actionLabel="Criar" />);
    expect(screen.queryByText('Criar')).not.toBeInTheDocument();
  });

  it('renders default icon', () => {
    render(<EmptyState title="Teste" />);
    expect(screen.getByText('◇')).toBeInTheDocument();
  });
});
