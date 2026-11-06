# zarreh.ai

Personal site of **Ali Zarreh, Ph.D.** — hands-on AI engineer, AI solution architect and data
scientist; educator and board advisor.
Positioning: *hands-on AI leadership, from problem to production* — trustworthy AI, built directly
with the customer teams who use it, in any industry.

The homepage leads with public evidence (a qualitative production summary and the open portfolio),
then offers three engagement paths:

| Path                          | Lands on              | What they find                                      |
| ----------------------------- | --------------------- | --------------------------------------------------- |
| Design & build solutions      | `/advisory/#projects` | Engagement types, how we'd work together, FAQ       |
| Evaluate & improve AI systems | `/advisory/#review`   | Evaluation & guardrails review                      |
| Board & advisory              | `/advisory/#advisory` | Advisory formats, current seat, value areas         |

`/advisory/` ("Advisory & consulting") is the single page for projects, consulting and advisory;
every other call to action is "Contact me" (`/contact/`).

`/students/` explains the course-materials area for the programs Ali teaches and links to
`/students/login/`. The sign-in form is a placeholder: it sends and stores nothing and is excluded
from search and the sitemap. A static site cannot protect files, so real student access needs an
identity provider (e.g. Auth0, Clerk or Cloudflare Access) with the materials hosted behind it.

Employer project names and figures are kept off the homepage. The `/work/` library shows
enterprise, teaching and advisory tiles alongside the public case studies. Each H-E-B project has
its own page at `/work/enterprise/<id>/`, generated from `src/data/experience.ts`, and appears as a
full card on `/experience/`. Teaching tiles link to the official program pages; the Experience page
shows each program's main topics and skills. Everything in `src/data/experience.ts` is also
published in `/ask/corpus.json` — leave out projections, unreleased roadmap items and findings that
read as criticism of the employer.

## Stack

- [Astro 5](https://astro.build) (static output) + TypeScript + MDX content collections
- Tailwind CSS v4 with CSS-variable design tokens, light/dark themes
- Pagefind (static search), `@astrojs/sitemap`, `@astrojs/rss`
- Build-time Open Graph images (satori + resvg)
- Playwright + axe for end-to-end and accessibility tests; Lighthouse CI budgets
- Optional **Ask my portfolio** assistant: FastAPI service in [`services/ask-api`](services/ask-api/README.md)
- Hosted on GitHub Pages, deployed by GitHub Actions

Astro 5 is used (rather than 6/7) because it supports Node 20, which keeps local development
simple; CI uses Node 22.

## Commands

A `Makefile` wraps the npm and uv commands so both halves of the repo share one entry point.
Run `make` to list every target.

| Shortcut         | What it does                                                        |
| ---------------- | ------------------------------------------------------------------- |
| `make install`   | Install site and API dependencies (`make browsers` once for tests)  |
| `make dev`       | Dev server at http://localhost:4321 with hot reload                 |
| `make preview`   | Production build, then serve it (search works here)                 |
| `make check`     | Type-check and verify formatting                                    |
| `make test`      | Build, then run Playwright e2e + axe accessibility tests            |
| `make ci`        | Everything CI runs except the link check and Lighthouse             |
| `make api-test`  | Lint and test the assistant API                                     |
| `make api-dev`   | Run the assistant locally against `dist/` (needs `OPENAI_API_KEY`)  |

The underlying npm scripts:

| Command                    | What it does                                                   |
| -------------------------- | -------------------------------------------------------------- |
| `npm install`              | Install dependencies                                           |
| `npm run dev`              | Dev server at http://localhost:4321 (search works only after a build) |
| `npm run build`            | Production build to `dist/` + Pagefind index                   |
| `npm run preview`          | Serve `dist/`                                                  |
| `npm run check`            | Type-check Astro, TS and content schemas                       |
| `npm run format`           | Prettier                                                       |
| `npm run test:install`     | One-time: install the Playwright browser                       |
| `npm test`                 | Playwright e2e + axe accessibility tests (against the build)   |
| `npm run capture:covers`   | Re-capture live-demo screenshots used as case-study covers     |
| `node scripts/generate-icons.mjs` | Regenerate favicons and app icons                       |

## Project structure

```
src/
  content/work/*.mdx       Case studies (one file each; schema in src/content.config.ts)
  content/posts/*.mdx      Writing
  data/profile.ts          Name, headline, links, credibility facts, availability — single source of truth
  data/experience.ts       Roles, H-E-B projects (one page each), education, skills
  data/offerings.ts        Services, advisory areas, talks, teaching programs (topics, skills, links), bios
  data/publications.ts     Publications (DOIs verified via Crossref)
  data/lab.ts              Unreleased agents and smaller open-source work
  data/redirects.ts        Old *.html URLs → new routes
  components/              UI components (mdx/ holds Flow and Callout for case studies)
  pages/                   Routes, plus rss.xml, og/*.png, ask/corpus.json and legacy redirects
services/ask-api/          Assistant API (Python) — deployed separately to the VPS
tests/                     Playwright specs
```

## Editing content

**Add a case study** — create `src/content/work/<slug>.mdx`. Copy the frontmatter from an existing
file; the schema validates domains, capabilities, links and metrics at build time. Use the
standard sections: *Why it exists · How it works (with a `<Flow>` diagram) · Results and honest
limits · Engineering decisions · Who it's for*. `<Flow>` and `<Callout>` are available without
imports. Put screenshots in `src/assets/images/work/` and reference them with `cover:`; projects
without one get a generated diagram cover.

**Add a post** — create `src/content/posts/<slug>.mdx` with `title`, `description`, `date`, `tags`
(and `canonical` if it was first published elsewhere). Set `draft: true` to hide it in production.

Writing is currently hidden until the first article is published: the existing posts are drafts
(visible only in `npm run dev`), and the Writing/RSS links are removed from the header and footer.
`/writing/` and `/rss.xml` still build with an empty state. To launch, publish a post without
`draft: true` and add `/writing/` back to `nav` in `src/components/Header.astro` and the footer
columns in `src/components/Footer.astro`.

**Change headline, links or availability** — edit `src/data/profile.ts`.

**Résumé download** — the full résumé (with phone number) is intentionally *not* in the repo.
To offer a download, add a phone-free version at `public/resume/Ali-Zarreh-Resume.pdf`; the site
detects it at build time. Without it, résumé links point to LinkedIn.

## Public build settings

All optional and safe to expose. Set them locally in a `.env` file, and for production as
repository **variables** (Settings → Secrets and variables → Actions → Variables):

| Variable               | Purpose                                                       |
| ---------------------- | ------------------------------------------------------------- |
| `PUBLIC_GA_ID`         | Google Analytics 4 ID (defaults to the existing `G-5GB5WB919N`) |
| `PUBLIC_BOOKING_URL`   | Cal.com / Calendly link; shows "Book a call" buttons          |
| `PUBLIC_WEB3FORMS_KEY` | Web3Forms access key; without it the contact form opens a pre-filled email |
| `PUBLIC_ASK_API_URL`   | e.g. `https://ask.zarreh.ai`; enables the assistant widget    |

Analytics only loads in production builds and is skipped under automated browsers. Conversion
events: `cta_click`, `audience_path`, `demo_click`, `docs_click`, `repo_click`, `resume_click`,
`book_call`, `email_click`, `contact_submit`, `bio_copy`, `press_download`, `ask_*`, `outbound_click`.

## Deployment

Pushing to `main` runs `.github/workflows/deploy.yml`, which builds the site and publishes it to
GitHub Pages. Every push and pull request runs `.github/workflows/ci.yml` (type check, formatting,
build, internal link check, Playwright + axe, Lighthouse budgets, and the assistant's tests).

See [docs/LAUNCH.md](docs/LAUNCH.md) for the one-time cutover from the old site.

Project documentation sites served at `zarreh.ai/<repo>/` (e.g. `/credit_decisioning/`) come
from those repositories' own GitHub Pages and keep working because this site stays on GitHub
Pages and never uses those paths.
