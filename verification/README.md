# Verification Scripts

This directory contains Playwright scripts to verify the functionality of the Portfolio OS application.

## Prerequisites

- Node.js & npm installed
- Python 3.12+ installed
- Playwright installed (`pip install playwright`)
- Playwright browsers installed (`playwright install`)

## Running the Verification

Ensure the development server is running:

```bash
cd portfolio-os
npm run dev
```

Then run the scripts from the root directory:

```bash
# Verify Desktop Boot & Interactions
python3 verification/verify_boot_desktop.py

# Verify Mobile Interactions
python3 verification/verify_mobile.py

# Verify App Functionality (Desktop)
python3 verification/verify_apps.py

# Verify Responsive Layouts
python3 verification/verify_responsive.py
```
