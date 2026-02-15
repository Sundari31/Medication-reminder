import { 
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import type { User } from "firebase/auth";
import { auth } from "./firebaseConfig";

export const signup =  async (
  name: string,
  email: string,
  caretakerEmail: string,
  password: string
) => {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    caretakerEmail,
    password
  );

  await updateProfile(userCredential.user, {
    displayName: name,
  });

  return userCredential;
};

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const observeAuthState = (
  callback: (user: User | null) => void
) => {
  return onAuthStateChanged(auth, callback);
};
