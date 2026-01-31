# IPODS - Immersive Machine Shop Website

A high-performance, immersive, and responsive website designed for a modern machine shop. The design features a dark, industrial theme (Black, Yellow, Blue) with embedded video backgrounds, inspired by high-end manufacturing portfolios.

**Live Demo:** (Link to be added after deployment)

## Technologies Used

*   **HTML5:** Semantic markup for structure and accessibility.
*   **CSS3:** Custom styling with flexbox, grid, animations, and media queries. No external CSS frameworks were used (pure CSS).
*   **JavaScript (Vanilla):** Minimal script for the responsive mobile navigation toggle.
*   **Lucide Icons:** Modern, lightweight SVG icons.
*   **Netlify:** Configuration ready for static hosting.

## Project Structure

```
/
├── index.html          # Home page
├── services.html       # Services page
├── about.html          # About Us page
├── contact.html        # Contact page
├── css/
│   └── style.css       # Main stylesheet
├── assets/             # Video and image assets
│   ├── hero-bg.mp4
│   ├── processing.mp4
│   ├── machining.mp4
│   └── *.vtt           # Accessibility tracks for videos
└── netlify.toml        # Netlify configuration
```

## Features

1.  **Immersive Video Backgrounds:** High-quality video loops in hero sections for a dynamic visual experience.
2.  **Multi-Page Architecture:** Distinct pages for Home, Services, About, and Contact for better SEO and organization.
3.  **Responsive Design:** Fully optimized for desktops, tablets, and mobile devices.
4.  **Dark Mode Theme:** sophisticated color palette (Black, Electric Blue, Industrial Yellow).
5.  **Accessibility:** Semantic HTML, video captions/descriptions (.vtt), and aria labels.
6.  **Contact Form:** Styled form ready for integration with backend services or Netlify Forms.

## How to Run Locally

You don't need a build server or node modules. This is a pure static site.

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Open the project:**
    Navigate to the folder and open `index.html` in your web browser.
    
    *OR* for a better experience (to handle video loading properly), use a simple local server:
    
    ```bash
    # Python 3
    python3 -m http.server
    
    # Node.js (http-server)
    npx http-server .
    ```

## Deployment

This project is ready for **Netlify**.

1.  Drag and drop the project folder into your Netlify dashboard.
2.  *OR* Connect your Git repository to Netlify. The `netlify.toml` file will handle the configuration automatically.

## License

[MIT License](LICENSE)
