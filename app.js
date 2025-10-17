// CÓDIGO ATUALIZADO E FINAL DO APP.JS - USE ESTE

document.addEventListener('DOMContentLoaded', () => {

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

    const navbar = document.getElementById('navbar');
    const welcomeMessage = document.getElementById('welcome-message');

    auth.onAuthStateChanged(async (user) => {
        if (user) {
            // Usuário está logado
            const userDoc = await db.collection('users').doc(user.uid).get();
            const userName = userDoc.exists ? userDoc.data().name : user.email;

            // Atualiza a UI para usuário logado
            if (navbar && (window.location.pathname === '/' || window.location.pathname.includes('index.html'))) {
                navbar.innerHTML = `
                    <div class="logo">Lab Camelot</div>
                    <nav class="nav-links">
                        <a href="dashboard.html" class="nav-login">Meu Painel</a>
                        <button id="logout-button-main" class="btn-header">Sair</button>
                    </nav>
                `;
                document.getElementById('logout-button-main').addEventListener('click', () => auth.signOut());
            }
            
            if (welcomeMessage) {
                welcomeMessage.textContent = `Bem-vindo(a) de volta, ${userName}!`;
            }

            if (window.location.pathname.includes('login.html') || window.location.pathname.includes('signup.html')) {
                window.location.replace('dashboard.html');
            }

        } else {
            // Usuário não está logado
            if (window.location.pathname.includes('dashboard.html')) {
                window.location.replace('login.html');
            }
        }
    });

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

            try {
                const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                await db.collection('users').doc(userCredential.user.uid).set({
                    name: name,
                    email: email
                });
                window.location.replace('dashboard.html');
            } catch (error) {
                errorMessage.textContent = 'Erro ao criar conta. Verifique os dados ou tente um e-mail diferente.';
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

            try {
                await auth.signInWithEmailAndPassword(email, password);
                window.location.replace('dashboard.html');
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

}); // Fim do DOMContentLoaded
