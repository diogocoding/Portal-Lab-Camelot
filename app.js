// ATENÇÃO: COLE AQUI A CONFIGURAÇÃO DO SEU PROJETO FIREBASE
const firebaseConfig = {
  apiKey: "AIzaSyBIyv3d26V2EIxqBSHl8Jo9M4_wV2-WKrU",
  authDomain: "lab-camelot-mvp.firebaseapp.com",
  projectId: "lab-camelot-mvp",
  storageBucket: "lab-camelot-mvp.firebasestorage.app",
  messagingSenderId: "508671276021",
  appId: "1:508671276021:web:2619c181030441b9b026bc",
};

// Inicializa o Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// --- LÓGICA DE AUTENTICAÇÃO E UI ---

const navbar = document.getElementById("navbar");
const welcomeMessage = document.getElementById("welcome-message");

auth.onAuthStateChanged(async (user) => {
  if (user) {
    // Usuário está logado
    const userDoc = await db.collection("users").doc(user.uid).get();
    const userName = userDoc.exists ? userDoc.data().name : user.email;

    // Atualiza a UI para usuário logado
    if (navbar && window.location.pathname.includes("index.html")) {
      navbar.innerHTML = `
                <div class="logo">Lab Camelot</div>
                <nav class="nav-links">
                    <a href="dashboard.html" class="nav-login">Meu Painel</a>
                    <button id="logout-button-main" class="btn-header">Sair</button>
                </nav>
            `;
      document
        .getElementById("logout-button-main")
        .addEventListener("click", () => auth.signOut());
    }

    if (welcomeMessage) {
      welcomeMessage.textContent = `Bem-vindo(a) de volta, ${userName}!`;
    }

    // Se o usuário logado tentar acessar login/signup, redireciona para o dashboard
    if (
      window.location.pathname.includes("login.html") ||
      window.location.pathname.includes("signup.html")
    ) {
      window.location.href = "dashboard.html";
    }
  } else {
    // Usuário não está logado
    // Se o usuário tentar acessar o dashboard, redireciona para o login
    if (window.location.pathname.includes("dashboard.html")) {
      window.location.href = "login.html";
    }
  }
});

// --- LÓGICA DAS PÁGINAS ---

// Página de Cadastro (signup.html)
const signupForm = document.getElementById("signup-form");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    const errorMessage = document.getElementById("error-message");

    try {
      const userCredential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      // Salva o nome do usuário no Firestore
      await db.collection("users").doc(userCredential.user.uid).set({
        name: name,
        email: email,
      });
      window.location.href = "dashboard.html";
    } catch (error) {
      errorMessage.textContent = "Erro: " + error.message;
    }
  });
}

// Página de Login (login.html)
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    const errorMessage = document.getElementById("error-message");

    try {
      await auth.signInWithEmailAndPassword(email, password);
      window.location.href = "dashboard.html";
    } catch (error) {
      errorMessage.textContent = "E-mail ou senha inválidos.";
    }
  });
}

// Botão de Logout (dashboard.html)
const logoutButton = document.getElementById("logout-button");
if (logoutButton) {
  logoutButton.addEventListener("click", () => {
    auth.signOut().then(() => {
      window.location.href = "index.html";
    });
  });
}
