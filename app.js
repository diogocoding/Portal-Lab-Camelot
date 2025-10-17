// CÓDIGO ATUALIZADO DO APP.JS PARA A NOVA HOME

// ATENÇÃO: COLE AQUI A CONFIGURAÇÃO DO SEU PROJETO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBIyv3d26V2EIxqBSHl8Jo9M4_wV2-WKrU",
  authDomain: "lab-camelot-mvp.firebaseapp.com",
  projectId: "lab-camelot-mvp",
  storageBucket: "lab-camelot-mvp.appspot.com",
  messagingSenderId: "508671276021",
  appId: "1:508671276021:web:2619c181030441b9b026bc"
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- LÓGICA DE AUTENTICAÇÃO E REDIRECIONAMENTO ---

auth.onAuthStateChanged(async (user) => {
    const currentPage = window.location.pathname;

    if (user) {
        // Se o usuário está logado, ele NUNCA deve ver as páginas de login ou signup.
        if (currentPage.includes('login.html') || currentPage.includes('signup.html')) {
            window.location.replace('home.html');
            return;
        }

        // Carrega os dados do usuário no painel
        const welcomeMessage = document.getElementById('welcome-message');
        if (welcomeMessage) {
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userName = userDoc.exists ? userDoc.data().name : user.email;
            welcomeMessage.textContent = `Bem-vindo(a), ${userName}!`;
        }

    } else {
        // Se o usuário NÃO está logado, ele NUNCA deve ver a home.
        if (currentPage.includes('home.html')) {
            window.location.replace('login.html');
        }
    }
});

// --- LÓGICA DOS FORMULÁRIOS ---

// Página de Cadastro (signup.html)
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
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            await db.collection('users').doc(userCredential.user.uid).set({ name: name, email: email });
            // O onAuthStateChanged vai cuidar do redirecionamento
        } catch (error) {
            errorMessage.textContent = 'Erro: Verifique os dados ou o e-mail já está em uso.';
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
        errorMessage.textContent = '';

        try {
            await auth.signInWithEmailAndPassword(email, password);
            // O onAuthStateChanged vai cuidar do redirecionamento
        } catch (error) {
            errorMessage.textContent = 'E-mail ou senha inválidos.';
        }
    });
}

// Botão de Logout (home.html)
const logoutButton = document.getElementById('logout-button');
if (logoutButton) {
    logoutButton.addEventListener('click', () => {
        auth.signOut().then(() => {
            window.location.replace('index.html');
        });
    });
}
