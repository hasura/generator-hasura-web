Working with Hasura
===================

Hasura imposes 3 constraints:
1. API Gateway for serving HTML
2. API Gateway for serving static assets
3. X-Hasura-User-Id and X-Hasura-Role headers

Variables
=========
Serving an admin application. Eg : radmin
Serving an HTML application. (No URL prefixes)

Recommended architecture
========================
Development:
- Local only
- Simulate Hasura, by adding hasura-middleware
- Connect to other services that are required directly or via hauthy

Production:
- Disable Hasura middleware
- Configure happiconf.json
- Ready to go


