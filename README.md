# Folix PDF Viewer

<p align="center">
  <strong>A lightweight, private PDF viewer that runs entirely in your browser.</strong>
  <br>
  A product by <a href="https://github.com/Yash29xd">FloppersBlop</a>.
  <br><br>
  <a href="https://yash29xd.github.io/folix/">Live Demo</a> ·
  <a href="https://github.com/Yash29xd/folix">Source Code</a>
</p>

---

## Overview

**Folix** is a modern, browser-based PDF viewer designed around privacy, performance, and simplicity.

It provides an extensive collection of document-reading, navigation, annotation, and document interaction tools through a clean, responsive interface.

Unlike traditional online PDF viewers that require documents to be uploaded to external servers, Folix processes locally opened documents directly in the browser. Your documents stay on your device rather than being sent to a Folix document-processing server.

Built and maintained by **FloppersBlop**, Folix is designed to make reading and working with PDF documents accessible without unnecessary complexity.

<details>
<summary>Quick Links</summary>

- [Live Application](https://yash29xd.github.io/folix/)
- [GitHub Repository](https://github.com/Yash29xd/folix)
- [About](https://yash29xd.github.io/folix/about.html)
- [FAQ](https://yash29xd.github.io/folix/faq.html)
- [Contact](https://yash29xd.github.io/folix/contact.html)
- [Privacy Policy](https://yash29xd.github.io/folix/privacy.html)

</details>

## Features

### 1. PDF Reading & Navigation

- **Continuous Scrolling:** Read documents through a seamless vertical scrolling experience.
- **Page Navigation:** Move between pages or jump directly to a specific page.
- **Page Thumbnails:** Browse visual previews of document pages through the sidebar.
- **Document Outline:** Navigate using the document's built-in bookmarks and outline.
- **Lazy Rendering:** Render pages as needed to reduce unnecessary processing.
- **Text Selection:** Select and interact with text inside PDF documents.
- **Two-Page View:** View two pages side by side.
- **Password Protection:** Open password-protected PDF documents.

### 2. Viewing & Display Controls

- **Flexible Zoom:** Adjust document magnification with configurable zoom limits.
- **Fit to Width:** Automatically scale pages to the available viewing width.
- **Fit to Height:** Adjust pages to fit the available viewing height.
- **Pinch-to-Zoom:** Zoom using touch gestures on compatible devices.
- **Page Rotation:** Rotate document pages for convenient viewing.
- **Dark Reading Mode:** Switch to a darker reading interface.
- **Spotlight Night Reading:** Use a focused reading spotlight to reduce surrounding screen brightness.
- **Fullscreen Mode:** Expand the viewer for a distraction-free experience.
- **Adaptive Toolbar:** Keep the toolbar pinned or allow it to auto-hide.

### 3. PDF Tools & Annotations

- **Document Search:** Find text within PDFs using `Ctrl + F`.
- **Notes:** Add notes to documents.
- **Annotation Tools:** Access document annotation functionality.
- **Digital Signatures:** Draw or type signatures and place them within documents.
- **Undo & Redo:** Reverse or restore supported editing actions.
- **Download:** Download documents directly to your device.
- **Print:** Print documents using the browser's native printing interface.

### 4. File Management

- **Drag & Drop:** Open PDF files by dropping them into the viewer.
- **Local File Access:** Select PDF documents directly from your device.
- **URL Loading:** Open remotely hosted PDFs using a URL parameter.
- **Share Integration:** Receive documents through supported operating system sharing interfaces.
- **File Handling:** Open PDFs directly with Folix on compatible browsers.

### 5. Privacy & Security

- No mandatory registration or account.
- No required document uploads.
- Browser-based PDF processing.
- Locally bundled third-party libraries.
- No dependency on external CDNs for core PDF libraries.
- Locally opened documents remain within the browser-based workflow.

### 6. Progressive Web App & Offline Support

- Installable as a Progressive Web App (PWA).
- Offline application access after initial asset caching.
- Web app manifest support.
- PDF file-handling integration on compatible browsers.
- Android share-target integration.
- Responsive interface for desktop and mobile devices.

---

## Screenshots & Demo

Experience Folix directly through the live application:

**[Open Folix PDF Viewer](https://yash29xd.github.io/folix/)**

---

## Project Structure

```text
folix/
│
├── index.html                 # Main PDF viewer application
├── app.js                     # Application logic and PDF functionality
├── config.js                  # Centralised application configuration
├── styles.css                 # Application styling and responsive layouts
│
├── about.html                 # About Folix
├── faq.html                   # Frequently asked questions
├── contact.html               # Contact information
├── privacy.html               # Privacy policy
├── terms.html                 # Terms of service
├── disclaimer.html            # Legal disclaimer
├── copyright.html             # Copyright information
│
├── sw.js                      # Service worker and offline caching
├── site.webmanifest           # PWA installation configuration
│
├── lib/
│   ├── pdf.js                 # PDF.js rendering library
│   ├── pdf-lib                # PDF manipulation library
│   └── licences/              # Third-party licences
│
├── assets/
│   ├── fonts/                 # Locally hosted fonts
│   ├── icons/                 # SVG interface icons
│   ├── icon.png               # Application icon
│   ├── branding.png           # Folix branding
│   ├── favicon-32.png         # Browser favicon
│   ├── apple-touch-icon.png   # Apple home screen icon
│   ├── icon-192.png           # PWA icon (192 × 192)
│   └── icon-512.png           # PWA icon (512 × 512)
│
├── LICENSE                    # Project licence
└── README.md                  # Project documentation
```

### Core Components

| Component | Description |
|---|---|
| `index.html` | Main application interface |
| `app.js` | PDF loading, rendering, navigation and application functionality |
| `config.js` | Application name, contact email, version and zoom settings |
| `styles.css` | Interface styling, themes and responsive layouts |
| `sw.js` | Offline caching and service worker functionality |
| `site.webmanifest` | Installation, file handling and share-target metadata |
| `lib/` | Bundled PDF libraries and licence files |
| `assets/` | Fonts, branding and interface icons |

---

## Getting Started

Folix is a static web application. It does not require a backend server, database, or complex build process for basic deployment.

### Requirements

- A modern web browser.
- JavaScript enabled.
- Python 3 (optional, for local development).
- Git (optional, for cloning the repository).

### 1. Clone the Repository

```bash
git clone https://github.com/Yash29xd/folix.git
cd folix
```

### 2. Run Locally

Start a local development server using Python:

```bash
python3 -m http.server 8000
```

Open the application:

```text
http://localhost:8000
```

Alternatively, you can open `index.html` directly, although using a local HTTP server is recommended because certain browser capabilities require a secure context.

---

## Deployment

Folix is designed to work with static hosting providers that support HTTPS.

### GitHub Pages

Folix is currently hosted using GitHub Pages.

**Live deployment:** https://yash29xd.github.io/folix/

To deploy your own version:

1. Fork or clone the repository.
2. Push your changes to the `main` branch.
3. Open repository Settings.
4. Navigate to **Pages**.
5. Select **Deploy from a branch**.
6. Choose `main` and `/ (root)`.
7. Save the configuration.

GitHub Pages will automatically publish the updated application.

### Other Hosting Platforms

Folix can also be deployed using compatible static hosting services, including:

- Cloudflare Pages
- Netlify
- Vercel
- Other HTTPS-enabled static web hosts

When deploying under a subdirectory, ensure asset references, navigation links, manifest paths, and service worker registration use compatible relative paths.

---

## Configuration

Application-wide settings are centralised in `config.js`.

The configuration includes:

| Setting | Purpose |
|---|---|
| Application Name | Product name displayed throughout the interface |
| Contact Email | Official support and enquiry address |
| Version | Current application version |
| Minimum Zoom | Lowest permitted zoom level |
| Maximum Zoom | Highest permitted zoom level |

Before publishing a customised deployment, review `config.js` and ensure the contact email and other application settings are correct.

---

## Opening PDFs Through URLs

Folix supports loading remotely hosted PDF documents through a URL parameter.

**Example:**

```text
https://yash29xd.github.io/folix/?file=https://example.com/document.pdf
```

This allows users to open remotely hosted PDF documents without manually downloading them first.

**CORS requirements:** The remote server must permit cross-origin requests from the Folix domain. If the required CORS headers are missing, the browser may block the request.

---

## PWA, Offline Support & File Handling

Folix includes Progressive Web App functionality to provide an application-like experience on supported platforms.

### Installation

The `site.webmanifest` file defines the application's metadata, icons, display configuration, and supported file-handling capabilities.

Depending on browser and operating system support, users can:

- Install Folix on their device.
- Launch it from their home screen.
- Open compatible PDF files directly with Folix.
- Share PDF documents through supported system sharing interfaces.

### Offline Functionality

The `sw.js` service worker manages application asset caching.

After the initial successful visit, the service worker caches the configured application files, allowing the application interface to load without an active internet connection.

**When adding or modifying files:**

1. Add newly introduced files to the `ASSETS` list in `sw.js`.
2. Update the `CACHE` version identifier.
3. Deploy the updated application.

Changing the cache version ensures that updated application assets can replace previously cached versions.

**Note:** Offline access to the application does not automatically guarantee access to remotely hosted PDF documents.

---

## Dependencies & Technologies

Folix uses locally bundled libraries to reduce external dependencies and avoid requiring CDN access for its core PDF functionality.

| Technology | Purpose |
|---|---|
| HTML5 | Application structure |
| CSS3 | Styling and responsive interface |
| JavaScript | Application logic and interactions |
| PDF.js | PDF parsing and rendering |
| pdf-lib | PDF document manipulation |
| Service Workers | Offline caching |
| Web App Manifest | PWA installation and file handling |
| SVG | Scalable interface icons |

### Third-Party Libraries

- [PDF.js](https://github.com/mozilla/pdf.js) by Mozilla.
- [pdf-lib](https://github.com/Hopding/pdf-lib).

Third-party libraries retain their respective licences and copyrights. Refer to the bundled licence files for details.

---

## Privacy

Privacy is a fundamental design principle of Folix.

The application is designed to process locally opened PDF documents within the user's browser rather than requiring them to be uploaded to a central document-processing server.

Folix follows these principles:

- No mandatory account creation.
- No required cloud storage.
- No required document uploads.
- Browser-based document processing.
- Locally bundled core dependencies.

For detailed information about data handling and privacy practices, read the [Privacy Policy](https://yash29xd.github.io/folix/privacy.html).

---

## Legal Information

- [About Folix](https://yash29xd.github.io/folix/about.html)
- [Frequently Asked Questions](https://yash29xd.github.io/folix/faq.html)
- [Contact](https://yash29xd.github.io/folix/contact.html)
- [Privacy Policy](https://yash29xd.github.io/folix/privacy.html)
- [Terms of Service](https://yash29xd.github.io/folix/terms.html)
- [Disclaimer](https://yash29xd.github.io/folix/disclaimer.html)
- [Copyright & Intellectual Property](https://yash29xd.github.io/folix/copyright.html)

---

## About FloppersBlop

Folix is developed and maintained by **FloppersBlop**, an independent technology brand focused on building software, digital products, and practical web-based tools.

Folix is part of the FloppersBlop product ecosystem.

- **Developer:** FloppersBlop
- **Project:** Folix PDF Viewer
- **Platform:** Web / Progressive Web App
- **Category:** Productivity / Document Management

GitHub: https://github.com/Yash29xd

---

## Credits & Acknowledgements

Folix uses open-source technologies and libraries that make its functionality possible.

Special thanks to:

- **Mozilla** for PDF.js.
- **pdf-lib contributors** for the PDF manipulation library.
- The open-source community for maintaining the technologies used throughout the project.

All third-party components remain subject to their respective licences.

---

## Contact & Support

For bug reports, technical issues, suggestions, or general enquiries, visit the [Folix Contact Page](https://yash29xd.github.io/folix/contact.html).

When reporting an issue, include:

- Your browser and device.
- Steps to reproduce the problem.
- Expected and actual behaviour.
- A sample PDF, only when it is safe to share.

Please do not send confidential documents.

---

## License

Folix is distributed under the **Apache License 2.0**.

See the [`LICENSE`](LICENSE) file for the complete licence terms.

---

<p align="center">
  <strong>FOLIX PDF VIEWER</strong>
  <br>
  Read. Annotate. Sign. Your documents stay yours.
  <br><br>
  <a href="https://yash29xd.github.io/folix/">Visit Folix</a>
  <br><br>
  A FloppersBlop Product
  <br>
  © FloppersBlop. All rights reserved.
</p>
