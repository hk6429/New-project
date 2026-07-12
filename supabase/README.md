# Supabase schema and security checks

Migrations are ordered so a blank Supabase project can replay the complete
application schema. Apply them with the Supabase migration runner in filename
order. Do not run only the latest hardening migration.

The regression script is intentionally transactional and leaves no fixtures:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 \
  -f supabase/tests/001_security_regression.sql
```

Use a privileged database connection for the structural assertions. The script
switches to `authenticated` and supplies a synthetic JWT subject when checking
the attacker view. A successful run ends with `ROLLBACK` and exit status 0.

Before production, repeat these checks against a disposable database restored
from the exact migration chain. Never run destructive migration experiments on
the production project.
