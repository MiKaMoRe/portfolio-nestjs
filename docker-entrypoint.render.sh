#!/bin/sh
set -e

DATABASE_URL="$DATABASE_URL" npx prisma migrate deploy && npx prisma db seed

exec "$@"
