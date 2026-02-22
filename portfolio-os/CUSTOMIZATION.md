# Customization Guide

This guide will walk you through the steps to personalize PortfolioOS with your own information, projects, and assets.

## Step 1: Update Portfolio Data

All personal information, projects, skills, and experience are stored in a single configuration file: `src/config/portfolio-data.ts`.

1. Open `src/config/portfolio-data.ts`.
2. Locate the `PORTFOLIO_DATA` object.
3. Update the fields with your own details:
   - **personal**: Name, title, bio, location, and social links.
   - **skills**: List of technical skills with proficiency levels.
   - **education**: Your academic background.
   - **projects**: Showcased projects with descriptions, links, and tech stacks.
   - **experience**: Professional work history.
   - **certifications**: Certificates and awards.
   - **contact**: Contact information and availability status.

## Step 2: Replace Assets

### Avatar
1. Place your profile picture in `src/assets/`.
2. Update the `avatar` path in `src/config/portfolio-data.ts` (e.g., `/assets/my-avatar.jpg`).

### Resume
1. Save your resume as a PDF file in `public/`.
2. Ensure the filename matches what is linked in your components or configuration (if applicable).

### Project Images
1. Add screenshots or images for your projects to `public/assets/projects/` or `src/assets/projects/`.
2. Update the `image` paths in the `projects` array within `portfolio-data.ts`.

## Step 3: Social Links

Update the `socials` array in `portfolio-data.ts` with your profile URLs. Supported platforms include:
- GitHub
- LinkedIn
- Twitter (X)
- Email (mailto:)

## Step 4: Theme Customization (Optional)

PortfolioOS supports dynamic theming. To customize the look and feel:

1. Navigate to `src/config/themes.ts` (if available) or `src/styles/globals.css`.
2. Modify the CSS variables or theme configuration objects to change colors, fonts, and spacing.
3. The default wallpapers can be replaced by adding new images to `src/assets/wallpapers/` and updating the wallpaper registry in `src/config/wallpaper.config.ts`.

## Step 5: Deploy

Once you have customized the content:

1. Run `npm run build` to generate the production build.
2. Deploy the `dist/` folder to your preferred hosting provider (Netlify, Vercel, GitHub Pages).

### Netlify / Vercel
- Connect your repository.
- Set the build command to `npm run build`.
- Set the publish directory to `dist`.

Enjoy your new PortfolioOS!
