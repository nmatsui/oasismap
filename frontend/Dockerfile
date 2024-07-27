# FROM node:20-slim AS build
FROM node:20.10.0 AS build

WORKDIR /app/frontend

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y tzdata

COPY --chown=node:node . .
RUN rm next.config.mjs && mv next.config.mjs.standalone next.config.mjs

ENV NODE_ENV=development
RUN npm ci

ENV NODE_ENV=production
RUN npm run build

USER node

FROM node:20-slim AS production

WORKDIR /app/frontend

RUN apt-get update && apt-get upgrade -y && \
    apt-get install -y tzdata tini curl && \
    rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production

COPY --chown=node:node --from=build /app/frontend/next.config.mjs .
COPY --chown=node:node --from=build /app/frontend/public ./public
COPY --chown=node:node --from=build /app/frontend/.next/static ./.next/static
COPY --chown=node:node --from=build /app/frontend/.next/standalone ./

EXPOSE 3000

USER node
ENTRYPOINT ["/usr/bin/tini", "--"]
CMD [ "node", "server.js" ]
