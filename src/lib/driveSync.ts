import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, User, signOut } from 'firebase/auth';
import firebaseConfig from '../../firebase-applet-config.json';
import { exportCacheForBackup, importCacheFromBackup } from './translationCache';

let app;
try {
  app = initializeApp(firebaseConfig);
} catch (e) {
  console.warn("Firebase app already initialized", e);
}
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive.file');

let isSigningIn = false;
export let cachedAccessToken: string | null = null;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (cachedAccessToken) {
        if (onAuthSuccess) onAuthSuccess(user, cachedAccessToken);
      } else if (!isSigningIn) {
        cachedAccessToken = null;
        if (onAuthFailure) onAuthFailure();
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    if (!credential?.accessToken) {
      throw new Error('Failed to get access token from Firebase Auth');
    }

    cachedAccessToken = credential.accessToken;
    return { user: result.user, accessToken: cachedAccessToken };
  } catch (error: any) {
    console.error('Sign in error:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

// Drive APIs
const DRIVE_FILENAME = 'quranic_arabic_backup.json';

export const backupToDrive = async () => {
    if (!cachedAccessToken) throw new Error("No access token");
    const data = exportCacheForBackup();
    const fileContent = new Blob([data], { type: 'application/json' });
    
    // Check if it exists
    const query = encodeURIComponent(`name='${DRIVE_FILENAME}' and trashed=false`);
    let res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}`, {
        headers: { Authorization: `Bearer ${cachedAccessToken}` }
    });
    const result = await res.json();
    let fileId = result.files && result.files.length > 0 ? result.files[0].id : null;
    
    const metadata = {
        name: DRIVE_FILENAME,
        mimeType: 'application/json'
    };
    
    const form = new FormData();
    form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
    form.append('file', fileContent);
    
    let url = 'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart';
    let method = 'POST';
    if (fileId) {
        url = `https://www.googleapis.com/upload/drive/v3/files/${fileId}?uploadType=multipart`;
        method = 'PATCH';
    }
    
    const uploadRes = await fetch(url, {
        method,
        headers: { Authorization: `Bearer ${cachedAccessToken}` },
        body: form
    });
    
    if (!uploadRes.ok) {
        throw new Error("Upload failed");
    }
    return true;
}

export const restoreFromDrive = async () => {
    const confirmed = window.confirm(
       `Are you sure you want to restore from Drive? This will overwrite existing locally cached translations with the backup data.`
    );
    if (!confirmed) return false;

    if (!cachedAccessToken) throw new Error("No access token");
    const query = encodeURIComponent(`name='${DRIVE_FILENAME}' and trashed=false`);
    let res = await fetch(`https://www.googleapis.com/drive/v3/files?q=${query}`, {
        headers: { Authorization: `Bearer ${cachedAccessToken}` }
    });
    const result = await res.json();
    if (!result.files || result.files.length === 0) {
        throw new Error("No backup found on Drive");
    }
    
    const fileId = result.files[0].id;
    const downloadRes = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
        headers: { Authorization: `Bearer ${cachedAccessToken}` }
    });
    
    if (!downloadRes.ok) throw new Error("Download failed");
    const textData = await downloadRes.text();
    const success = importCacheFromBackup(textData);
    if (!success) {
        throw new Error("Import failed");
    }
    return true;
}
