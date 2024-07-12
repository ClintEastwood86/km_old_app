FROM node:20-alpine AS build
WORKDIR /opt/app
ADD *.json ./
RUN npm ci
ADD . .
ADD .env.production ./.env.local
RUN npm run build

FROM node:20-alpine
WORKDIR /opt/app
ADD *.json ./
RUN npm ci --omit=dev
COPY --from=build /opt/app/.next ./.next
COPY --from=build /opt/app/public ./public
COPY --from=build /opt/app/.env.production ./.env.local
ENV NODE_ENV production
CMD ["npm", "start"]
EXPOSE 3001
