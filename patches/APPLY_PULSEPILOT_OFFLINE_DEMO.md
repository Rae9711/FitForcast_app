# Apply offline demo fix to PulsePilot_app

## Why login fails

The PulsePilot Vercel app calls `https://pulsepilot-app.onrender.com`, which is **suspended** (`503 Service Suspended`). That produces browser **Failed to fetch** on `/login`.

## Apply

```bash
git clone https://github.com/Rae9711/PulsePilot_app.git
cd PulsePilot_app
git checkout -b cursor/offline-demo-login-cb48
git apply /path/to/pulsepilot-offline-demo.patch
# or: curl -L <raw-patch-url> | git apply
git add -A
git commit -m "Enable offline demo login when Render API is suspended"
git push -u origin cursor/offline-demo-login-cb48
```

Then merge to `main` so Vercel redeploys **https://pulse-pilot-app.vercel.app/login**.

Note: old preview URLs like `pulse-pilot-qo7xn78ln-...vercel.app` are immutable; use production (or a new preview) after deploy.

## Demo accounts

- athena@example.com / password123
- boris@example.com / password123
- cora@example.com / password123
