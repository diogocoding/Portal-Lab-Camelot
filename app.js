// CÓDIGO FINAL E DEFINITIVO DO APP.JS - VERSÃO COM PERSISTÊNCIA EXPLÍCITA

const firebaseConfig = {
  apiKey: "AIzaSyBIyv3d26V2EIxqBSHl8Jo9M4_wV2-WKrU",
  authDomain: "lab-camelot-mvp.firebaseapp.com",
  projectId: "lab-camelot-mvp",
  storageBucket: "lab-camelot-mvp.appspot.com",
  messagingSenderId: "508671276021",
  appId: "1:508671276021:web:2619c181030441b9b026bc"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- LÓGICA DE AUTENTICAÇÃO E REDIRECIONAMENTO ---

auth.onAuthStateChanged(async (user) => {
    const currentPage = window.location.pathname;

    if (user) {
        if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
            window.location.replace('home.html');
            return;
        }

        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userName = userDoc.exists ? userDoc.data().name : user.email;
            welcomeMessage.textContent = `Bem-vindo(a), ${userName}!`;
        }

    } else {
        if (currentPage.includes('home.html')) {
            window.location.replace('login.html');
        }
    }
});

// --- LÓGICA DOS FORMULÁRIOS ---

const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = '';

        try {
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(userCredential.user.uid).set({ name: name, email: email });
        } catch (error) {
            errorMessage.textContent = 'Erro: Verifique os dados ou o e-mail já está em uso.';
        }
    });
}

const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = '';

        try {
            await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            await auth.signInWithEmailAndPassword(email, password);
        } catch (error) {
            errorMessage.textContent = 'E-mail ou senha inválidos.';
        }
    });
}

const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.replace('index.html');
        });
    });
}
