let popup = document.getElementById('loginModal');
let loginLink = document.getElementById('loginLink');
let closeBtn = document.getElementById('closeModal');
let form = document.getElementById('loginForm');
let title = document.getElementById('modalTitle');
let emailInput = document.getElementById('email');
let passwordInput = document.getElementById('password');
let confirmInput = document.getElementById('confirmPassword');
let confirmGroup = document.getElementById('confirmGroup');
let emailError = document.getElementById('emailError');
let passwordError = document.getElementById('passwordError');
let confirmError = document.getElementById('confirmError');
let successMsg = document.getElementById('loginSuccess');
let submitBtn = document.getElementById('submitBtn');
let switchText = document.getElementById('switchText');
let switchMode = document.getElementById('switchMode');


let savedEmail = localStorage.getItem('savedEmail') || '';
let savedPassword = localStorage.getItem('savedPassword') || '';
let loggedIn = localStorage.getItem('loggedIn') === 'true';
let mode = 'login';


if (loggedIn === true) {
  loginLink.textContent = 'Logout';          
}

function clearMessages() {
  emailError.textContent = '';
  passwordError.textContent = '';
  confirmError.textContent = '';
  successMsg.textContent = '';
}

function showLoginMode() {
  mode = 'login';
  clearMessages();
  form.reset();
  title.textContent = 'Login';
  submitBtn.textContent = 'Log In';
  confirmGroup.style.display = 'none';
  switchText.textContent = 'No account yet?';
  switchMode.textContent = 'Sign Up';
}

function showSignUpMode() {
  mode = 'signup';
  clearMessages();
  form.reset();
  title.textContent = 'Sign Up';
  submitBtn.textContent = 'Create Account';
  confirmGroup.style.display = 'block';
  switchText.textContent = 'Already have an account?';
  switchMode.textContent = 'Log In';
}

function closePopup() {
  popup.style.display = 'none';
  showLoginMode();
}

loginLink.addEventListener('click', function (e) {
  e.preventDefault();
  if (loggedIn === true) {
    
    let userName = localStorage.getItem('userName');
    let sure = confirm('The account ' + userName + ' is logging out.');

    if (sure === true) {
      loggedIn = false;
      localStorage.setItem('loggedIn', 'false');
      loginLink.textContent = 'Login';
    }
  } else {
    showLoginMode();
    popup.style.display = 'flex';
  }
});

switchMode.addEventListener('click', function (e) {
  e.preventDefault();
  if (mode === 'login') {
    showSignUpMode();
  } else {
    showLoginMode();
  }
});

closeBtn.addEventListener('click', function () {
  closePopup();
});

form.addEventListener('submit', function (e) {
  e.preventDefault();
  clearMessages();

  let email = emailInput.value.trim();
  let password = passwordInput.value;
  let confirmPass = confirmInput.value;
  let ok = true;

  if (email === '') {
    emailError.textContent = 'Email is required.';
    ok = false;
  } else if (email.includes('@') === false) {
    emailError.textContent = 'Email must contain @.';
    ok = false;
  } else if (email.includes('.') === false) {
    emailError.textContent = 'Email must contain a dot (.).';
    ok = false;
  }

  if (password === '') {
    passwordError.textContent = 'Password is required.';
    ok = false;
  } else if (password.length < 6) {
    passwordError.textContent = 'Password must be at least 6 characters.';
    ok = false;
  }

  if (mode === 'signup' && ok === true && password !== confirmPass) {
    confirmError.textContent = 'Passwords do not match.';
    ok = false;
  }

  if (ok === true) {
    if (mode === 'signup') {
      savedEmail = email;
      savedPassword = password;
      localStorage.setItem('savedEmail', email);
      localStorage.setItem('savedPassword', password);
      showLoginMode();
      successMsg.textContent = 'Account created! You can now log in.';
    } else {
      if (email !== savedEmail) {
        emailError.textContent = 'No account found. Please sign up first.';
      } else if (password !== savedPassword) {
        passwordError.textContent = 'Incorrect password.';
      } else {
        loggedIn = true;
        successMsg.textContent = 'Login successful!';
        let name = email.split('@')[0];
        loginLink.textContent = 'Logout';    
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userName', name);   
        setTimeout(closePopup, 1200);
      }
    }
  }
});
