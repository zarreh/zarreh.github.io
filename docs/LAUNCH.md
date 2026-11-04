# Launch checklist — redesign v3

The new site lives on the `redesign/v3` branch. Nothing changes on zarreh.ai until it is merged
and the Pages source is switched.

## 1. Review before merging

- [ ] Read every page in a preview build (`npm run build && npm run preview`), especially the
      copy written for you: homepage, About, Advisory (bios), Work with me, Speaking, and the two
      essays in `src/content/posts/`.
- [ ] Confirm the facts flagged in the redesign notes (publication statuses, PipeLearner wording,
      RxFlow / Claim agent metrics, "In the lab" projects being public).
- [ ] Check that your employer's outside-activity / disclosure policy covers the _Work with me_
      and _Advisory_ pages.
- [ ] Optional: add `public/resume/Ali-Zarreh-Resume.pdf` (a phone-free version).

## 2. Configure

- [ ] Repository variables (Settings → Secrets and variables → Actions → Variables):
      `PUBLIC_BOOKING_URL`, `PUBLIC_WEB3FORMS_KEY` (and later `PUBLIC_ASK_API_URL`).
- [ ] Web3Forms: create a free access key for `ali@zarreh.ai` at web3forms.com.
- [ ] Cal.com (or Calendly): create a 30-minute "Intro call" event and copy its link.

## 3. Cut over

1. Tag the old site so it is easy to return to:
   ```bash
   git checkout main && git pull
   git tag legacy-v1 && git push origin legacy-v1
   ```
2. Open a pull request from `redesign/v3` to `main`, wait for CI to pass, and merge.
3. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
4. Watch the _Deploy site_ workflow. When it finishes, confirm **Settings → Pages** still shows
   the custom domain `zarreh.ai` with _Enforce HTTPS_ enabled.

## 4. Verify (about 10 minutes)

- [ ] https://zarreh.ai/ and https://www.zarreh.ai/ load the new site over HTTPS.
- [ ] Old links redirect: `/projects_credit_decisioning.html`, `/experiences.html`, `/about.html`.
- [ ] Project docs still load: `/credit_decisioning/`, `/cohort_risk_lab/`,
      `/clinical_care_navigator/`, `/trade_sureillance_agent/`.
- [ ] Live demos still load (`credit.zarreh.ai`, `cohort-risk.zarreh.ai`, …).
- [ ] Search (press `/`), theme toggle, contact form and booking link work.
- [ ] Google Analytics → Realtime shows your visit.
- [ ] Google Search Console: submit `https://zarreh.ai/sitemap-index.xml` and request indexing for `/`.
- [ ] Update the website link on LinkedIn, GitHub and Google Scholar if needed.

## Rollback

1. On `main`: `git revert -m 1 <merge-commit> && git push` — this restores the old HTML files.
2. **Settings → Pages → Source: Deploy from a branch → `main` / `(root)`.**

The `legacy-v1` tag also preserves the exact old site if you ever need it again.

## Later: the "Ask my portfolio" assistant

Follow [services/ask-api/README.md](../services/ask-api/README.md) to deploy the API on the VPS at
`ask.zarreh.ai`, then set the `PUBLIC_ASK_API_URL` variable and re-run _Deploy site_. Until then
the widget is not rendered at all.
