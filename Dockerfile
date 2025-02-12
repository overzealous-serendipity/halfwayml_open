# # Base node image
# FROM node:18-alpine AS base
# RUN apk add --no-cache libc6-compat openssl
# WORKDIR /app

# # Dependencies stage
# FROM base AS deps
# # Copy package files
# COPY package.json package-lock.json* ./
# # Install dependencies
# RUN npm ci

# # Builder stage
# FROM base AS builder
# WORKDIR /app
# COPY --from=deps /app/node_modules ./node_modules
# COPY . .

# # Set up environment variables for build
# ARG DATABASE_URL
# ENV DATABASE_URL=$DATABASE_URL
# ARG NEXT_PUBLIC_BASE_URL
# ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# # Generate Prisma Client
# RUN npx prisma generate

# # Build application
# RUN npm run build

# # Runner stage
# FROM base AS runner
# WORKDIR /app

# # Set environment variables
# ENV NODE_ENV=production
# ENV NEXT_TELEMETRY_DISABLED 1

# # Create non-root user
# RUN addgroup --system --gid 1001 nodejs && \
#     adduser --system --uid 1001 nextjs

# # Create start script first
# RUN echo '#!/bin/sh\nnpx prisma migrate deploy\nnode server.js' > start.sh && \
#     chmod +x start.sh

# # Copy necessary files from builder and set ownership
# COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
# COPY --from=builder --chown=nextjs:nodejs /app/public ./public
# COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
# COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
# COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
# COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
# COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

# # Set ownership of start script after creation
# RUN chown nextjs:nodejs start.sh

# # Switch to non-root user after all operations requiring root are done
# USER nextjs

# # Expose port
# EXPOSE 3000

# # Set the entrypoint
# ENTRYPOINT ["./start.sh"]

# Base node image
FROM node:18-alpine AS base
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Dependencies stage
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# Builder stage
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set up environment variables for build
ARG DATABASE_URL
ENV DATABASE_URL=$DATABASE_URL
ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

# Generate Prisma Client and build
RUN npx prisma generate
RUN npm run build

# Runner stage
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED 1

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder --chown=nextjs:nodejs /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs
EXPOSE 3000

# Run migrations and start server
CMD npx prisma migrate deploy && node server.js