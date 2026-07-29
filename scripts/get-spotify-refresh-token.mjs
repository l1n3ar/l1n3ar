// One-time helper: run `npm run spotify:auth`, authorize in the browser tab it
// prints, then copy the refresh token it logs into .env.local as
// SPOTIFY_REFRESH_TOKEN. Requires SPOTIFY_CLIENT_ID/SPOTIFY_CLIENT_SECRET to
// already be set (in .env.local or the shell environment), and the redirect URI
// below added to the app's settings in the Spotify Developer Dashboard.
import { createServer } from 'node:http';
import { readFileSync, existsSync } from 'node:fs';

const PORT = 8888;
const REDIRECT_URI = `http://127.0.0.1:${PORT}/callback`;
const SCOPES = ['user-read-currently-playing', 'user-read-recently-played'].join(' ');

function loadEnvLocal() {
  const path = new URL('../.env.local', import.meta.url);
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const match = line.match(/^([\w.-]+)\s*=\s*(.*)\s*$/);
    if (match && !(match[1] in process.env)) process.env[match[1]] = match[2];
  }
}
loadEnvLocal();

const clientId = process.env.SPOTIFY_CLIENT_ID;
const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;

if (!clientId || !clientSecret) {
  console.error('Set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local first.');
  process.exit(1);
}

const authorizeUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
  client_id: clientId,
  response_type: 'code',
  redirect_uri: REDIRECT_URI,
  scope: SCOPES,
})}`;

console.log('\nMake sure this exact redirect URI is registered on your Spotify app:');
console.log(`  ${REDIRECT_URI}\n`);
console.log('Open this URL and authorize:');
console.log(`  ${authorizeUrl}\n`);

const server = createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI);
  if (url.pathname !== '/callback') {
    res.writeHead(404).end();
    return;
  }

  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');
  if (error || !code) {
    res.writeHead(400, { 'Content-Type': 'text/plain' }).end(`Authorization failed: ${error ?? 'no code returned'}`);
    console.error(`Authorization failed: ${error ?? 'no code returned'}`);
    server.close();
    return;
  }

  const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
    },
    body: new URLSearchParams({ grant_type: 'authorization_code', code, redirect_uri: REDIRECT_URI }),
  });
  const tokenData = await tokenResponse.json();

  if (!tokenResponse.ok || !tokenData.refresh_token) {
    res.writeHead(500, { 'Content-Type': 'text/plain' }).end('Could not exchange code for a refresh token — check the terminal.');
    console.error('Token exchange failed:', tokenData);
    server.close();
    return;
  }

  res.writeHead(200, { 'Content-Type': 'text/plain' }).end('Done — you can close this tab. Refresh token printed in the terminal.');
  console.log('\nAdd this to .env.local:');
  console.log(`SPOTIFY_REFRESH_TOKEN=${tokenData.refresh_token}\n`);
  server.close();
});

server.listen(PORT);
