# Clearspan

Public repo: [github.com/qangol/clearspan-tracker](https://github.com/qangol/clearspan-tracker)

Know whether a creative is still **cleared to run**.

Clearspan is a rights board for UGC and influencer content. Agencies and in-house teams usually track usage windows in a spreadsheet. That sheet is where ads keep running after the license ended.

This repo is a working v1: add assets, see Active / Expiring (14 days) / Expired, import and export CSV. Data stays in the browser (`localStorage`). No account, no backend.

> Companies do not buy empty GitHub repos. They buy a painful workflow with users. This is the wedge: **stop paid social from outliving the talent contract.**

## Who it is for

- Performance / SMM agencies juggling creator licenses across brands
- In-house growth teams that run Spark Ads / Partnership Ads / whitelisting
- Counsel who need a list of “what is still legal to put in the ad account”

## Features

- Asset record: creator, platforms (Meta, TikTok, YouTube, Telegram, web), usage (organic / paid / whitelisting), exclusive flag, contract URL, notes
- Traffic-light status from the end date
- Search and filters
- CSV import / export (`public/sample-assets.csv`)
- Demo book so the board is never empty on first open

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), then **Open the board**.

```bash
npm run build
npm start
```

## Deploy on Vercel

1. The code is already on GitHub: [qangol/clearspan-tracker](https://github.com/qangol/clearspan-tracker).
2. Open [vercel.com/new](https://vercel.com/new) and import that repo (you must be logged into Vercel with the same GitHub account).
3. Framework preset: **Next.js**. Leave build settings on defaults (`next build`).
4. Deploy. Paste the live URL at the top of this README when it exists.

No environment variables are required for v1.

## CSV columns

`name, creator, platforms, usage, startsAt, endsAt, exclusive, contractUrl, notes`

Platforms and usage are pipe-separated: `meta|tiktok`, `paid|organic`. Dates are `YYYY-MM-DD`.

## Как запустить

Нужны Node.js 20+ и npm.

```bash
npm install
npm run dev
```

Сайт откроется на `http://localhost:3000`. Данные живут только в этом браузере. Кнопка **Load demo** возвращает учебные активы.

Репозиторий уже публичный: https://github.com/qangol/clearspan-tracker  
Выкладка: Vercel → Import Git Repository → Deploy. Ключи и база не нужны.

## License

Apache License 2.0. See [LICENSE](LICENSE).
