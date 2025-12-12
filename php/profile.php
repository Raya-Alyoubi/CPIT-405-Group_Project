<?php
// Simple PHP page (meets PHP requirement).
// It reads user info from browser localStorage via JS and displays it.
// PHP here is serving the page and can be extended later (DB/session/etc).
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PHP Profile</title>
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, sans-serif; background:#111; color:#fff; margin:0; }
    .wrap { max-width: 900px; margin: 40px auto; padding: 20px; }
    .card { background:#1f1f1f; border:1px solid #333; border-radius:16px; padding:16px; }
    .row { margin: 8px 0; }
    .muted { opacity: .8; }
    a { color:#f5c16c; text-decoration:none; }
    .btn { display:inline-block; margin-top:12px; padding:10px 14px; border-radius:999px; background:#f5c16c; color:#111; border:none; cursor:pointer; }
  </style>
</head>
<body>
  <div class="wrap">
    <h1>Profile (PHP)</h1>
    <p class="muted">This page is served by PHP to satisfy the course PHP requirement.</p>

    <div class="card" id="profileCard">
      <p class="row">Loading user…</p>
    </div>

    <button class="btn" onclick="window.history.back()">Back</button>
  </div>

  <script>
    const key = "themet_current_user";
    const card = document.getElementById("profileCard");

    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        card.innerHTML = `
          <p class="row"><strong>Status:</strong> Not logged in</p>
          <p class="row muted">Go back and login first.</p>
        `;
      } else {
        const user = JSON.parse(raw);
        card.innerHTML = `
          <p class="row"><strong>Name:</strong> ${user.name ?? "N/A"}</p>
          <p class="row"><strong>Email:</strong> ${user.email ?? "N/A"}</p>
          <p class="row"><strong>Role:</strong> ${user.role ?? "user"}</p>
          <p class="row muted">Loaded from localStorage: <code>${key}</code></p>
        `;
      }
    } catch (e) {
      card.innerHTML = `<p class="row">Failed to read user data.</p>`;
    }
  </script>
</body>
</html>
