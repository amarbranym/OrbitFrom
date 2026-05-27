#!/bin/bash

set -e

if [ -f "apps/api/.env" ]; then
  echo "apps/api/.env exists. ✅"
else
  echo "Creating apps/api/.env from example…"
  cp apps/api/.env.example apps/api/.env
fi

if [ -f "apps/web/.env" ]; then
  echo "apps/web/.env exists. ✅"
else
  echo "Creating apps/web/.env from example…"
  cp apps/web/.env.example apps/web/.env
fi

echo "Edit apps/api/.env (database, SESSION_SECRET) before running pnpm db:migrate && pnpm dev"
