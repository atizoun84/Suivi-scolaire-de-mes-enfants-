import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, set, onValue, update } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

const firebaseConfig = {
    apiKey: "AIzaSyBp8njwT-fV7G_hFcfUkX00Yp2F9G-Nh_g",
    authDomain: "suivi-scolaire-mes-enfants.firebaseapp.com",
    projectId: "suivi-scolaire-mes-enfants",
    databaseURL: "https://suivi-scolaire-mes-enfants-default-rtdb.europe-west1.firebasedatabase.app/",
    storageBucket: "suivi-scolaire-mes-enfants.firebasestorage.app",
    messagingSenderId: "626624466628",
    appId: "1:626624466628:web:9060dd23bc4067de624391"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Fonction pour sauvegarder vers le Cloud
export async function syncToCloud(path, data) {
    try {
        await set(ref(db, path), data);
        localStorage.setItem(`scofam_${path}`, JSON.stringify(data));
    } catch (error) {
        console.error("Erreur sync:", error);
    }
}

// Ecoute en temps réel
export function listenToCloud(path, callback) {
    const dbRef = ref(db, path);
    onValue(dbRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            localStorage.setItem(`scofam_${path}`, JSON.stringify(data));
            callback(data);
        }
    });
}

// Gestion du statut de connexion
const syncToast = document.getElementById('sync-status-toast');
const connectedRef = ref(db, ".info/connected");
onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
        syncToast.innerHTML = '<i class="bi bi-cloud-check-fill"></i> Synchronisé';
        syncToast.className = "sync-toast online";
    } else {
        syncToast.innerHTML = '<i class="bi bi-cloud-slash-fill"></i> Mode Hors-ligne';
        syncToast.className = "sync-toast offline";
    }
});
