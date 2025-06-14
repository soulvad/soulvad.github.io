import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyDkkbdkufiZKOp2AX-XtxXErICP3oeh-O0",
  authDomain: "shit-pet-project-dd8b6.firebaseapp.com",
  projectId: "shit-pet-project-dd8b6",
  storageBucket: "shit-pet-project-dd8b6.firebasestorage.app",
  messagingSenderId: "620981382496",
  appId: "1:620981382496:web:72a22f87d32254671b0205",
  measurementId: "G-GCQ5MPZSPH"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// Додаємо логування для відстеження помилок
auth.onAuthStateChanged((user) => {
  if (user) {
    console.log('Користувач увійшов:', user.email);
  } else {
    console.log('Користувач вийшов');
  }
});

export default app; 