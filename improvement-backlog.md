# Improvement Backlog

Top ten high-level improvements for the portfolio website, identified 2026-06-12. Roughly ordered by impact.

1. **Shared layout / templating** — The navbar, head, and footer are copy-pasted across 13 HTML files, so every site-wide change means editing every page (as the June 2026 overhaul demonstrated). Adopt a templating system (e.g., EJS partials, already natural with Express) or a static build step.

2. **Image optimization** — `public/images/Zach.jpg` is 16 MB, by far the heaviest thing on the site. Resize/compress images (WebP/AVIF), and replace the 116 KB JPEG favicon with properly sized .ico/PNG variants plus an apple-touch icon.

3. **Project demos** — Every project detail page's Demo section is still an empty placeholder. Adding short videos or screenshot galleries is the single biggest content win for showing off actual work.

4. **SEO & social metadata** — No page has a meta description, Open Graph/Twitter card tags, sitemap.xml, or robots.txt. Links shared on LinkedIn/social currently render with no preview, which matters for a job-seeking portfolio.

5. **Automated CI/CD** — Deployment is a manual docker build → ECR push → SSH-and-restart sequence. A GitHub Actions pipeline that builds, pushes, and deploys on push to main would remove the toil and the room for error.

6. **Custom 404 and error handling** — Unknown routes fall through to Express's bare default response. Add a styled 404 page and a catch-all error handler.

7. **Accessibility & motion preferences** — Audit the vivid title colors for contrast, add alt text/aria labels where missing, and respect `prefers-reduced-motion` for the hero flip ticker and bouncing scroll arrow.

8. **Server hardening & performance** — The Express app serves everything with no compression, no cache headers for static assets, and no security headers. Add `compression`, `helmet`, and sensible Cache-Control values.

9. **Basic tests & monitoring** — `npm test` is a stub and nothing watches the live site. Add smoke tests (all routes return 200), a health-check endpoint, and simple uptime monitoring.

10. **Resolve the Contact page** — `contact.html` has sat unlinked and "in development" since 2025. Either finish it (e.g., a working contact form) and add it to the navbar, or remove it in favor of the landing page's Contact card.
