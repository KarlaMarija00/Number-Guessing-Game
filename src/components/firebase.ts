import { initializeApp } from 'firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, getDoc } from 'firebase/firestore';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA4ZVhA7IhTNpZ_FX8sYWeSTbm95TL3ms8",
  authDomain: "number-guessing-game-3b9da.firebaseapp.com",
  projectId: "number-guessing-game-3b9da",
  storageBucket: "number-guessing-game-3b9da.appspot.com",
  messagingSenderId: "1017523749582",
  appId: "1:1017523749582:web:25b728680f4c01d512c69f",
  measurementId: "G-LJJTMF9YR8"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Get the authentication module
const auth = getAuth(app);

// Get the Firestore module
const db = getFirestore(app);

// Default initial high score value
const defaultInitialHighScore = 0;

// Create a new user with email and password
const createUser = async (email: string, password: string) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Set the initial high score and best time when creating a new user document
    const userRef = doc(collection(db, 'users'), user.uid);
    await setDoc(userRef, { highScore: defaultInitialHighScore, bestTime: 0, email: email }, { merge: true });

    return userCredential;
  } catch (error) {
    throw error;
  }
};

const signInUser = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const updateHighScore = async (uid: string, newHighScore: number) => {
  const userRef = doc(collection(db, 'users'), uid);

  try {
    const userDocSnap = await getDoc(userRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      const existingHighScore = userData.highScore;

      // Update the high score only if the new score is higher
      if (newHighScore > existingHighScore) {
        await setDoc(userRef, { highScore: newHighScore }, { merge: true });
        console.log('High score updated in Firestore');
      }
    }
  } catch (error) {
    console.error('Error updating high score in Firestore:', error);
    throw error;
  }
};

const getUserProfile = async (userId: string) => {
  const userDocRef = doc(db, 'users', userId); // Assuming 'users' is your collection name
  const userDocSnap = await getDoc(userDocRef);

  console.log(userId);

  if (userDocSnap.exists()) {
    return userDocSnap.data();
  } else {
    return null;
  }
};

const getUserEmail = () => {
  const user = auth.currentUser;
  return user ? user.email : null;
};

export { auth, createUser, signInUser, getUserProfile, db, getUserEmail };