#!/bin/sh
set -eu

echo "Running Prisma migrate deploy..."
npx prisma migrate deploy --schema apps/api/prisma/schema.prisma

echo "Starting GYAM..."
exec node apps/api/dist/index.js
