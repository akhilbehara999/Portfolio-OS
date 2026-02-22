import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TerminalApp from '../../apps/terminal/TerminalApp';
import { useAppStore } from '../../store/app.store';
import { useThemeStore } from '../../store/theme.store';
import { useOSStore } from '../../store/os.store';

// Mocks
vi.mock('../../store/app.store');
vi.mock('../../store/theme.store');
vi.mock('../../store/os.store');
vi.mock('../../core/file-system/virtual-fs', () => ({
  virtualFs: {
    getNodeByPath: vi.fn(),
    getNode: vi.fn(),
  }
}));

// Setup default mock values
const mockLaunchApp = vi.fn();
const mockSetTheme = vi.fn();
const mockSetWallpaper = vi.fn();

beforeEach(() => {
  vi.restoreAllMocks();

  (useAppStore as any).mockReturnValue({
    launchApp: mockLaunchApp,
  });

  (useThemeStore as any).mockReturnValue({
    setTheme: mockSetTheme,
    setWallpaper: mockSetWallpaper,
    currentTheme: { name: 'Default' },
  });

  // Also need getState for theme store as it is used directly in some places
  (useThemeStore as any).getState = () => ({
    currentTheme: { name: 'Default' },
  });

  (useOSStore as any).mockReturnValue({
    uptime: 100,
    deviceMode: 'desktop',
  });
});

describe('TerminalApp', () => {
  it('renders prompt and banner', () => {
    render(<TerminalApp />);
    expect(screen.getByText(/Welcome to PortfolioOS Terminal/i)).toBeInTheDocument();
    expect(screen.getByText('visitor@portfolio-os:/home/user$')).toBeInTheDocument();
  });

  it('handles help command', async () => {
    const user = userEvent.setup();
    render(<TerminalApp />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'help{enter}');

    expect(screen.getByText('available commands', { exact: false })).toBeInTheDocument();
    expect(screen.getByText('about')).toBeInTheDocument(); // part of help output
  });

  it('handles about command', async () => {
    const user = userEvent.setup();
    render(<TerminalApp />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'about{enter}');

    // Assuming PORTFOLIO_DATA is imported and used, we look for some text.
    // Since we didn't mock PORTFOLIO_DATA, it uses the real one.
    // We should expect some text from it.
    // Ideally we should mock PORTFOLIO_DATA too but it's a constant.
    // Let's just check if it adds response type.

    // We can check if "Hello! I'm" appears.
    expect(screen.getByText(/Hello! I'm/i)).toBeInTheDocument();
  });

  it('handles unknown command', async () => {
    const user = userEvent.setup();
    render(<TerminalApp />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'invalid_cmd{enter}');

    expect(screen.getByText(/Command not found: invalid_cmd/i)).toBeInTheDocument();
  });

  it('handles clear command', async () => {
    const user = userEvent.setup();
    render(<TerminalApp />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'help{enter}');
    expect(screen.getByText('about')).toBeInTheDocument();

    await user.type(input, 'clear{enter}');

    // help output should be gone
    // queryByText returns null if not found
    expect(screen.queryByText('about')).not.toBeInTheDocument();
  });
});
