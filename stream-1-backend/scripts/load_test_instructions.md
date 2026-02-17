Load Testing Instructions
-------------------------

This project includes a simple guidance file for running load tests against
the API. Running load tests requires a running instance of the backend and a
database with seeded data.

Recommended tools:
- autocannon (npm) — lightweight HTTP load tester
- wrk or hey — native binaries that are commonly available

Example using `autocannon` (install globally or in the project):

```bash
# start the server in one terminal
cd stream-1-backend
PORT=3000 npm run dev

# in another terminal, run autocannon for 30s with 50 connections
npx autocannon -c 50 -d 30 http://localhost:3000/trends?user_id=00000000-0000-0000-0000-000000000001
```

If you want a repeatable Node-based harness, consider adding `autocannon` as
a dev dependency and using a short script that warms up, runs the test, and
records p95/latency numbers.

Note: Running load tests against your local machine will be CPU/IO bound and
may not reflect production performance characteristics. For reliable
benchmarks, run against a staging environment mirroring production resources.
