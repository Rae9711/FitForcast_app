# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Vite inlines these at build time — runtime env alone is not enough.
ARG VITE_API_BASE_URL=/api
ARG VITE_DEFAULT_USER_ID=00000000-0000-0000-0000-000000000001
ARG VITE_ENABLE_MOCK_DATA=false
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL \
    VITE_DEFAULT_USER_ID=$VITE_DEFAULT_USER_ID \
    VITE_ENABLE_MOCK_DATA=$VITE_ENABLE_MOCK_DATA

# Copy package files
COPY package*.json ./
COPY tsconfig*.json ./
COPY vite.config.ts ./
COPY tailwind.config.js ./
COPY postcss.config.js ./

# Install dependencies
RUN npm ci

# Copy source code
COPY index.html ./
COPY src ./src

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files to nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
