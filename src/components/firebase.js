import { initializeApp } from "firebase/app";
import {
    GoogleAuthProvider,
    getAuth,
    signInWithPopup,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    sendPasswordResetEmail,
    signOut,
} from "firebase/auth";
import {
    getFirestore,
    query,
    getDocs,
    collection,
    where,
    updateDoc,
    setDoc,
    doc
} from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDN0GkXuXGKelBt_zPxs0F-6k5hOpzncKE",
    authDomain: "hard-5e427.firebaseapp.com",
    projectId: "hard-5e427",
    storageBucket: "hard-5e427.appspot.com",
    messagingSenderId: "633233532595",
    appId: "1:633233532595:web:3d6a3641cf105fcec672c6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

const getUserDocs = (uid) => {
    const q = query(collection(db, "users"), where("uid", "==", uid));
    const docs = getDocs(q);
    console.log(docs);
}

const addNewPlayer = async (uid, newDisplayName) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
    displayName: newDisplayName
    });
    // const usersRef = doc(collection(db, "users"), where("uid", "==", uid));
    // setDoc(usersRef, { displayName: playerName }, { merge: true });
}

const updatePlayerData = async (uid, newScore, date) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
    score: newScore,
    lastDate: date
    });
    console.log(userRef, userRef.id, newScore, date)
}

const resetUser = async (uid, previousAttempts ) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
    score: 0,
    displayName: "false",
    attemptsFailed: previousAttempts + 1
    });
}

const getPlayers = async () => {
    let currentPlayers = [];
    let inactivePlayers = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
        if(doc.data().displayName !== "false") {
            // console.log(doc.id, " => ", doc.data());
            currentPlayers.push(doc.data());
        } else {
            inactivePlayers.push(doc.data())
        }
    });
    const allPlayers = {
        active: currentPlayers,
        inactive: inactivePlayers
    }
    return allPlayers;
}

// Authenticate user with google
const signInWithGoogle = async () => {
    try {
        const res = await signInWithPopup(auth, googleProvider);
        const user = res.user;
        const q = query(collection(db, "users"), where("uid", "==", user.uid));
        const docs = await getDocs(q);
        console.log(user)
        if (docs.docs.length === 0) {
            await setDoc(doc(db, "users", user.uid), {
                score: 0,
                startDate: new Date(),
                lastDate: '',
                dayOne: '',
                uid: user.uid,
                name: user.displayName,
                authProvider: "google",
                email: user.email,
                displayName: 'false',
                attemptsFailed: 0
            });
            return user;
        } else {
            console.log('YOU ALREADY EXIST')
            return user;
            // Logged in modal or something
        }
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

// authenticate via email x password
const logInWithEmailAndPassword = async (email, password) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
    ;
}

// Register new user with email x password
const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db, "users", user.uid), {
            uid: user.uid,
            name,
            lastDate: '',
            authProvider: "local",
            email,
            score: 0,
            startDate: new Date(),
            dayOne: '',
            displayName: 'false',
            attemptsFailed: 0
        });
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

// send password reset link
const sendPasswordReset = async (email) => {
    try {
        await sendPasswordResetEmail(auth, email);
        alert("Password reset link sent!");
    } catch (err) {
        console.error(err);
        alert(err.message);
    }
};

// Logg out user
const logout = () => {
    signOut(auth);
};

export {
    auth,
    db,
    storage,
    ref,
    signInWithGoogle,
    logInWithEmailAndPassword,
    registerWithEmailAndPassword,
    sendPasswordReset,
    logout,
    addNewPlayer,
    getPlayers,
    updatePlayerData,
    resetUser,
    getUserDocs,
    getDownloadURL

};