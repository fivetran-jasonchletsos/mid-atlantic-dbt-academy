# dbt Academy — Mid-Atlantic SE Team

A hands-on, session-by-session refresher on how this team actually builds the dbt layer of an
ODI demo: bronze/silver/gold on top of a live Fivetran sync, dbt Wizard for AI-assisted model
authoring, and the two ways a demo gets delivered (live warehouse vs. self-contained CI). This
assumes prior basic dbt training and existing Fivetran + dbt Cloud accounts — it picks up where
that training left off, grounded in how our own ODI demo repos are actually built.

No build step. Open `index.html` in a browser, or serve the folder with anything static
(e.g. `python3 -m http.server`), or view it live via GitHub Pages.

## What's here

- Six one-hour sessions: a dbt Cloud refresher, the bronze/silver/gold pattern, connecting
  Fivetran's MDLS destination to dbt, dbt Wizard, the CI/CD and demo-narrative patterns, and a
  flagship session that builds one real business question end-to-end.
- Two bonus deep-dives: the content rules that make a demo booth-ready, and a live-demo
  troubleshooting checklist.
- A **Wizard Console** — a scripted replay of a real dbt Wizard session (search, describe,
  lineage, warehouse sampling, compile-preview, then materialize) for two example business
  questions.
- A cheat sheet: layer naming, dbt build commands, dbt Wizard tool reference, the Fivetran-to-dbt
  data flow, and common live-demo failure modes.

Built with Claude Code.
