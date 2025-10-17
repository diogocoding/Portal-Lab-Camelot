// CÓDIGO FINAL E CORRIGIDO DO APP.JS - USE ESTE

// ATENÇÃO: COLE AQUI A CONFIGURAÇÃO DO SEU PROJETO FIREBASE
const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_AUTH_DOMAIN",
  projectId: "SEU_PROJECT_ID",
  storageBucket: "SEU_STORAGE_BUCKET",
  messagingSenderId: "SEU_MESSAGING_SENDER_ID",
  appId: "SEU_APP_ID"
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
