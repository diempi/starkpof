import { useState, useEffect } from "react";

const clientId = process.env.SPOTIFY_CLIENT_ID; // Your Spotify Client ID
const redirectUri = process.env.SPOTIFY_REDIRECT_URI; // Redirect URI
const scopes = "user-read-private user-read-email user-top-read"; // Scopes for Spotify API access

function generateCodeVerifier(length: number) {
  let text = "";
  const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeChallenge(codeVerifier: string) {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return btoa(String.fromCharCode(...new Uint8Array(digest)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function getAccessToken(clientId: string, code: string): Promise<string> {
  const verifier = localStorage.getItem("verifier");

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("grant_type", "authorization_code");
  params.append("code", code);
  params.append("redirect_uri", redirectUri || "");
  params.append("code_verifier", verifier || "");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: params.toString(),
  });

  const { access_token } = await response.json();
  return access_token;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [topArtist, setTopArtist] = useState<any>(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get("code");

    if (!code) {
      const verifier = generateCodeVerifier(128);
      generateCodeChallenge(verifier).then((challenge) => {
        localStorage.setItem("verifier", verifier);
        const authUrl = new URL("https://accounts.spotify.com/authorize");
        authUrl.searchParams.append("client_id", clientId as string);
        authUrl.searchParams.append("response_type", "code");
        authUrl.searchParams.append("redirect_uri", redirectUri as string);
        authUrl.searchParams.append("scope", scopes as string); 
        authUrl.searchParams.append("code_challenge_method", "S256");
        authUrl.searchParams.append("code_challenge", challenge);

        window.location.href = authUrl.toString();
      });
    } else {
      getAccessToken(clientId as string, code).then((accessToken) => {
        // Fetch user profile
        fetch("https://api.spotify.com/v1/me", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then((data) => setProfile(data));

        // Fetch top artist
        fetch("https://api.spotify.com/v1/me/top/artists?limit=1", {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
          .then((res) => res.json())
          .then((data) => setTopArtist(data.items[0]));
      });
    }
  }, []);

  if (!profile || !topArtist) return <div>Loading...</div>;

  return (
    <div>
      <h1>Display your Spotify profile data</h1>
      <section id="profile">
        <h2>
          Logged in as <span id="displayName">{profile.display_name}</span>
        </h2>
        {profile.images?.[0] && (
          <img
            id="avatar"
            src={profile.images[0].url}
            alt={`${profile.display_name}'s avatar`}
            width="200"
            height="200"
          />
        )}
        <ul>
          <li>
            Top Artist: <span id="artist-name">{topArtist.name}</span>
          </li>
          <li>
            <img
              id="artist-image"
              src={topArtist.images?.[0]?.url}
              alt={`${topArtist.name}'s image`}
              width="200"
              height="200"
            />
          </li>
        </ul>
      </section>
    </div>
  );
}