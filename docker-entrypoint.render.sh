#!/bin/sh
set -e

echo "Running DB migrations"
npx prisma migrate deploy
npx prisma db seed

exec "$@"
