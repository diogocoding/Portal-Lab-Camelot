// CÓDIGO FINAL E CORRIGIDO DO APP.JS - USE ESTE

// ATENÇÃO: COLE AQUI A CONFIGURAÇÃO DO SEU PROJETO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBIyv3d26V2EIxqBSHl8Jo9M4_wV2-WKrU",
  authDomain: "lab-camelot-mvp.firebaseapp.com",
  projectId: "lab-camelot-mvp",
  storageBucket: "lab-camelot-mvp.firebasestorage.app",
  messagingSenderId: "508671276021",
  appId: "1:508671276021:web:2619c181030441b9b026bc"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- LÓGICA DE AUTENTICAÇÃO E UI ---

const handleAuthState = async (user) => {
    if (user) {
        // Usuário está logado
        const currentPage = window.location.pathname;
        if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
            window.location.replace('dashboard.html');
            return;
        }

        const userDoc = await db.collection('users').doc(user.uid).get();
        const userName = userDoc.exists ? userDoc.data().name : user.email;

        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            welcomeMessage.textContent = `Bem-vindo(a) de volta, ${userName}!`;
        }

    } else {
        // Usuário não está logado
        if (window.location.pathname.includes('dashboard.html')) {
            window.location.replace('login.html');
        }
    }
};

auth.onAuthStateChanged(handleAuthState);

// --- LÓGICA DAS PÁGINAS ---

// Página de Cadastro (signup.html)
const signupForm = document.getElementById('signup-form');
if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = ''; // Limpa erros anteriores

        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(userCredential.user.uid).set({
                name: name,
                email: email
            });
            // O onAuthStateChanged vai cuidar do redirecionamento
        } catch (error) {
            errorMessage.textContent = 'Erro: Verifique os dados ou tente um e-mail diferente.';
        }
    });
}

// Página de Login (login.html)
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        const errorMessage = document.getElementById('error-message');
        errorMessage.textContent = ''; // Limpa erros anteriores

        try {
            await auth.signInWithEmailAndPassword(email, password);
            // O onAuthStateChanged vai cuidar do redirecionamento
        } catch (error) {
            errorMessage.textContent = 'E-mail ou senha inválidos.';
        }
    });
}

// Botão de Logout (dashboard.html)
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.replace('index.html');
        });
    });
}

