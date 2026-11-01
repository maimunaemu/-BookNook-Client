# BookNook — The Reading Atelier

A polished, community-powered independent-bookstore experience. Readers can discover books, lend titles from their own shelves, and keep track of the stories they borrow.

**Live website:** Not deployed yet.

## Stack

- Next.js App Router, React, TypeScript, and Tailwind CSS 4
- Better Auth with the MongoDB adapter, email/password authentication, Google OAuth, and the JWT plugin
- Express API with MongoDB and server-verified JWT authentication (see the separate `booknook-server` repository)
- Swiper for the home-page editorial slider; Sonner for accessible feedback; imgbb for optional cover uploads

## Features

- Responsive editorial storefront with three-slide hero, latest books, reading categories, and helpful empty/error/loading states
- Searchable, filterable collection and private book detail pages
- Account registration, email/password login, optional Google OAuth, persistent sessions, and protected reading-room pages
- Book upload/edit, ownership-checked deletion, and cover URL or imgbb image upload
- Borrow/return workflows with 14-day due dates and server-enforced inventory consistency
- Reader profile, custom 404 page, page metadata, and keyboard-friendly forms

## Local setup

Requirements: Node.js 20.9 or newer and npm. Start MongoDB Atlas or a local MongoDB replica set first. The client and API share the same database, and transaction support is required for borrow/return.

```powershell
npm install
Copy-Item .env.example .env.local
# Set the values in .env.local, then:
npm run dev
```

The website runs at `http://localhost:3000`; the companion API should run at `http://localhost:4000`. See the separate server repository's README for API setup.

Create a strong Better Auth secret (do not use the example placeholder) with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"
```

Run checks and a production build:

```powershell
npm run typecheck
npm run lint
npm run build
npm start
```

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_API_URL` | Yes | Express API origin; local default is `http://localhost:4000`. |
| `NEXT_PUBLIC_AUTH_URL` | Yes | Better Auth origin; local default is `http://localhost:3000`. |
| `MONGODB_URI` | Yes | MongoDB connection string used by Better Auth. Use the same database as the API. |
| `MONGODB_DB` | No | MongoDB database name; defaults to `booknook`. |
| `BETTER_AUTH_SECRET` | Yes | A private, randomly generated secret of at least 32 characters. Keep it identical across client instances and never expose it with a `NEXT_PUBLIC_` prefix. |
| `BETTER_AUTH_URL` | Yes | Better Auth base origin, e.g. `http://localhost:3000`. |
| `GOOGLE_CLIENT_ID` | For Google login | OAuth client ID from the Google Cloud project. |
| `GOOGLE_CLIENT_SECRET` | For Google login | OAuth client secret from the Google Cloud project. |
| `NEXT_PUBLIC_IMGBB_API_KEY` | For direct image upload | imgbb API key used by the browser for optional cover uploads. Request a key from [imgbb's API page](https://api.imgbb.com/), then put it in the client project's ignored `.env.local` file and restart Next.js. The `NEXT_PUBLIC_` prefix makes it visible to browsers; restrict/rotate it as appropriate. Users may also paste a hosted cover URL or leave the cover blank. |

For Google OAuth, set `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` in the **client project's server-side** `.env.local` file (or the client deployment's secret settings); do not use a `NEXT_PUBLIC_` prefix. In Google Cloud, configure the authorized redirect URI as `http://localhost:3000/api/auth/callback/google` locally and the equivalent HTTPS callback for production. Restart the Next.js server after changing environment settings. Registration and email/password sign-in work without Google credentials.

Do not commit `.env.local` or any other real environment file. `.env.example` contains placeholders only.

## API routes

The client talks to the separate Express service. Private calls include a short-lived Better Auth JWT in the `Authorization` header.

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/books` | Public newest-first catalog, search, and category filter |
| `GET` | `/books/:id` | Authenticated book details |
| `POST` | `/books` | Create a reader-owned book |
| `PATCH` | `/books/:id` | Update a book owned by the current reader |
| `DELETE` | `/books/:id` | Delete an owned book when it has no active borrow |
| `POST` | `/borrows` | Borrow a book; inventory is decremented transactionally |
| `GET` | `/borrows` | List the signed-in reader's active loans and due dates |
| `DELETE` | `/borrows/:id` | Return the reader's active loan and restore inventory |

See the server README for request rules, statuses, and the additional `/books/mine` and `/health` routes.

## Deployment

Deploy the Next.js app to Vercel or another Node-compatible host and deploy the Express service separately. Configure the environment variables on both hosts, use the same Atlas database and Better Auth secret, set the API's `CLIENT_ORIGIN` to the exact HTTPS client origin, and set both auth URL variables to the client origin. Add the production Google OAuth redirect URI and use a MongoDB replica-set deployment. No deployment has been configured for this project yet.
