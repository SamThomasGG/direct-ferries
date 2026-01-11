# Ferry Searcher

## Setup

At the root run `turbo i` to install all dependencies.

Then create your `.env` file in both the frontend and backend from the example.

Run `turbo build && turbo start` to start both apps.

Open `http://localhost:3000` to start.


## Tech Stack Choice

Turborepo - monorepo
Bun - instead of node/pnpm/vitest due to its increased speed
Biome - instead of ES Lint and Prettier due to its increased speed

### Frontend

- Next JS
- Tailwind
- Shadcn
- Zod
- i18n


### Backend

- Nest JS
- Prisma
- Zod
- SQLLite
- Swagger - go to localhost:5000/api to see swagger docs


## Missing features / future improvements

- Caching BE - I've added a simple in memory cache for the backend. Work for this simple example but would be better with redis
- Caching FE - Currently, 'revalidation:false' on the frontend which causes the api fetches to be permanently cached. Fine for this example when the data is static, but would need to implement a revalidateTag or similar webhook handler if the data changed
- Fetch translations from BE as well so they could be managed by content editors (ps translations were ai generated)
- Currency - assumed to be GBP. But should probably update with the locale switcher as well
- Port names - in the fetch to get the ports would be good to include the port name as well as the code for better UX.
- Date selector - could block all dates in the past, or only show dates with available options.
- E2E test - ran out of time but should have added in some simple playwright tests.
- Setup the frontend search to save the query to the url so that it is shareable
- Shared versioned package with zod schemas to be used on backend and frontend
- Dockerfile and compose - not needed if only deploying locally, can use `turbo build && turbo start` to have the same effect.
- UI - could be improved