#!/bin/sh
# Script para aguardar o PostgreSQL estar pronto

set -e

host="$1"
shift
cmd="$@"

until PGPASSWORD=$DB_PASSWORD psql -h "$host" -U "$DB_USER" -d "$DB_NAME" -c '\q'; do
  >&2 echo "PostgreSQL está indisponível - aguardando..."
  sleep 1
done

>&2 echo "PostgreSQL está pronto - executando comando"
exec $cmd

