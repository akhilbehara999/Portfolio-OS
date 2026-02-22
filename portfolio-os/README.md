# PortfolioOS

![PortfolioOS Banner](/public/pwa-512x512.png)

A web-based Operating System simulation that serves as an interactive portfolio. Built with React, TypeScript, and Vite, it offers a unique desktop experience with window management, a taskbar, and functional applications.

![Screenshot Placeholder](https://via.placeholder.com/1200x630.png?text=PortfolioOS+Screenshot)

[**Live Demo**](https://your-demo-url.com)

## ✨ Features

- [x] **Desktop Environment**: Draggable windows, taskbar, start menu, and desktop icons.
- [x] **Window Management**: Minimize, maximize, close, and z-index handling.
- [x] **File System**: Virtual file system with file explorer and file associations.
- [x] **Terminal**: Functional terminal with command history and file system commands.
- [x] **PWA Support**: Installable as a Progressive Web App with offline capabilities.
- [x] **Responsive Design**: Adapts to mobile and desktop screens.
- [x] **Theme Engine**: Dark/Light mode support and dynamic theming.
- [x] **Custom Applications**: Built-in apps for About, Projects, Skills, and more.

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-443E38?style=for-the-badge&logo=react&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/portfolio-os.git
   cd portfolio-os
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🎨 Customization

This portfolio is designed to be easily customizable. All content is driven by a central configuration file.

See [CUSTOMIZATION.md](./CUSTOMIZATION.md) for detailed instructions on how to:
- Update your personal information
- Add your projects and skills
- Change themes and wallpapers
- Deploy to your preferred platform

## 📂 Project Structure

```
src/
├── apps/           # Application components (Terminal, Explorer, etc.)
├── assets/         # Static assets (images, icons)
├── components/     # Shared UI components
├── config/         # Configuration files (Portfolio data, App registry)
├── core/           # Core OS logic (Window manager, File system)
├── hooks/          # Custom React hooks
├── services/       # Services (Event bus, Storage)
├── shell/          # Desktop shell components (Taskbar, Desktop)
├── store/          # Zustand state stores
├── styles/         # Global styles and Tailwind config
├── types/          # TypeScript type definitions
└── utils/          # Utility functions
```

## ⚡ Performance Targets

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 100
- **SEO**: 90+
- **Bundle Size**: < 500KB (Gzipped initial load)

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature`.
3. Make your changes and commit them: `git commit -m 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature`.
5. Submit a pull request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
