---
name: Admin Auth Pattern
description: How admin authentication works in CaterMarket
---

JWT-based auth. Token stored in localStorage key `auth-token`. AdminGuard component redirects non-authenticated users to /login.

Register endpoint (`POST /api/register`) always creates users with role='user'. To get an admin user: register, then run `psql $DATABASE_URL -c "UPDATE users SET role='admin' WHERE email='...' RETURNING id,email,role;"`.

The auth middleware checks JWT role field — since role is embedded at login time, you must re-login after the DB role update to get a token with role='admin'.

**Why:** No admin promotion endpoint exists in the API; direct DB update is the only path.
