#!/bin/sh
# vim:sw=4:ts=4:et
# set -e
# chmod +x ~/app/wait-for-it.sh
# /app/wait-for-it.sh db:3306
chown -R 999:0 "/.npm"
npx prisma migrate reset --force
exec npm run dev