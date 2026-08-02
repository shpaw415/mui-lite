# Frame Master Template: MDX Documentation Site

A modern, high-performance starter template for building documentation sites with MDX, React, and Tailwind CSS, Ready for CDN.

![Frame Master Template](https://img.shields.io/badge/Frame%20Master-Template-blueviolet)
![React](https://img.shields.io/badge/React-19-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.1-38bdf8)
![Bun](https://img.shields.io/badge/Bun-1.3-black)

## 🚀 Features

- **MDX Support**: Write documentation in Markdown with embedded React components
- **React 19**: The latest version of React for building interactive UIs
- **Tailwind CSS**: Utility-first CSS framework with Typography plugin
- **Pre-built Components**: Ready-to-use Header and Footer components
- **Site Configuration**: Centralized config file for easy customization
- **Frame Master**: Integrated workflow for seamless development
- **Bun**: Lightning-fast JavaScript runtime and package manager
- **TypeScript**: Type-safe development for better code quality

## 📁 Project Structure

```
src/
├── site.config.ts      # ⚙️ Site configuration (name, links, nav, etc.)
├── shell.tsx           # HTML shell wrapper
├── common.ts           # Shared utilities
├── components/
│   ├── index.ts        # Components barrel export
│   ├── Header.tsx      # Site header with navigation
│   └── Footer.tsx      # Site footer with links
└── pages/
    ├── layout.tsx      # Page layout wrapper
    └── index.mdx       # Home page
static/
├── style.css           # Compiled Tailwind CSS
├── tailwind.css        # Tailwind source
└── favicon.svg         # Site favicon
```

## 🛠️ Getting Started

### Prerequisites

- [Bun](https://bun.sh) (v1.3 or later)

### Installation

1. **Clone the repository (or use the template):**

   ```bash
   git clone <your-repo-url>
   cd <your-project-directory>
   ```

2. **Install dependencies:**

   ```bash
   bun install
   ```

3. **Initialize Frame Master:**

   ```bash
   bun frame-master init
   ```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
bun run dev
```

### Build for Production

```bash
bun run build
```

## ⚙️ Configuration

### Site Configuration (`src/site.config.ts`)

The main configuration file for your documentation site. Update these values to customize your site:

```typescript
export const siteConfig = {
  // Site name displayed in header and title
  name: "My Documentation",

  // Site description for SEO
  description: "Documentation site built with Frame Master",

  // Author information
  author: {
    name: "Your Name",
    url: "https://github.com/yourusername",
  },

  // Social links (leave empty to hide)
  links: {
    github: "https://github.com/yourusername/your-repo",
    twitter: "https://twitter.com/yourusername",
    discord: "",
  },

  // Navigation items
  nav: [
    { label: "Home", href: "/" },
    { label: "Docs", href: "/docs" },
    { label: "Blog", href: "/blog" },
  ],

  // Footer sections
  footer: {
    sections: [
      {
        title: "Documentation",
        links: [
          { label: "Getting Started", href: "/docs/getting-started" },
          // ...
        ],
      },
    ],
    copyright: "© 2025 Your Project. All rights reserved.",
  },
};
```

## 📝 Writing Documentation

### Creating Pages

Add `.mdx` files in the `src/pages` directory:

```
src/pages/
├── index.mdx           # / (home)
├── about.mdx           # /about
├── docs/
│   ├── index.mdx       # /docs
│   ├── getting-started.mdx  # /docs/getting-started
│   └── api/
│       └── index.mdx   # /docs/api
```

### Using Components in MDX

Import and use React components directly in your MDX files:

```mdx
import { Alert } from "../components/Alert";

# My Page

<Alert type="info">This is an informational alert!</Alert>

Regular markdown content continues here...
```

### Creating Custom Components

Add new components in `src/components/`:

```tsx
// src/components/Alert.tsx
export function Alert({ type, children }) {
  return <div className={`alert alert-${type}`}>{children}</div>;
}
```

Export from the barrel file:

```typescript
// src/components/index.ts
export { Alert } from "./Alert";
```

## 🚀 Deployment

### Cloudflare Pages

1. Push your code to GitHub
2. Connect your repository to Cloudflare Pages
3. Set build command: `bun run build`
4. Set output directory: `.frame-master/build`

### Manual Deployment

```bash
bun run build
# Deploy the .frame-master/build directory to your hosting provider
```

## 📜 License

MIT License - feel free to use this template for any project!
