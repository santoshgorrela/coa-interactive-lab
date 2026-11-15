import { getApp, getApps, initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  User,
} from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';

export const GOOGLE_DOCS_SCOPES = [
  'https://www.googleapis.com/auth/documents',
  'https://www.googleapis.com/auth/drive.file',
] as const;

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

// Strictly in-memory OAuth access token cache (never persisted to browser storage)
let cachedAccessToken: string | null = null;

export interface GoogleDocsAuthSnapshot {
  user: User | null;
  hasAccessToken: boolean;
}

export function getAccessToken(): string | null {
  return cachedAccessToken;
}

export function clearAccessToken(): void {
  cachedAccessToken = null;
}

export function subscribeAuthState(
  listener: (snapshot: GoogleDocsAuthSnapshot) => void,
): () => void {
  return onAuthStateChanged(auth, (user) => {
    if (!user) {
      cachedAccessToken = null;
    }
    listener({
      user,
      hasAccessToken: Boolean(user && cachedAccessToken),
    });
  });
}

export async function signInWithGoogleDocs(): Promise<GoogleDocsAuthSnapshot> {
  const provider = new GoogleAuthProvider();
  for (const scope of GOOGLE_DOCS_SCOPES) {
    provider.addScope(scope);
  }
  provider.setCustomParameters({
    prompt: 'consent',
    include_granted_scopes: 'true',
  });

  const result = await signInWithPopup(auth, provider);
  const credential = GoogleAuthProvider.credentialFromResult(result);
  const accessToken = credential?.accessToken ?? null;

  if (!accessToken) {
    throw new Error('Google authorization completed without an access token. Please try signing in again.');
  }

  cachedAccessToken = accessToken;
  return {
    user: result.user,
    hasAccessToken: true,
  };
}

export async function signOutGoogleDocs(): Promise<void> {
  cachedAccessToken = null;
  await signOut(auth);
}
