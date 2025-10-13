// Переключение вкладок Login / Register
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

loginBtn.onclick = () => {
  loginBtn.classList.add('active');
  registerBtn.classList.remove('active');
  loginForm.classList.add('active');
  registerForm.classList.remove('active');
};

registerBtn.onclick = () => {
  registerBtn.classList.add('active');
  loginBtn.classList.remove('active');
  registerForm.classList.add('active');
  loginForm.classList.remove('active');
};

// --- Валидация Register формы ---
const regEmail = document.getElementById('regEmail');
const regPass = document.getElementById('regPass');
const regConfirm = document.getElementById('regConfirm');
const regForm = document.getElementById('registerForm');
const successMsg = document.getElementById('successMsg');

function showError(input, message) {
  // ищем ближайший <small class="error"> в той же форме
  const small = input.parentElement.querySelector('.error');
  if (small) small.textContent = message;
  if (message) {
    input.classList.add('invalid');
  } else {
    input.classList.remove('invalid');
  }
}

regForm.addEventListener('submit', function(e) {
  e.preventDefault(); // блокируем отправку
  successMsg.hidden = true;

  let valid = true;

  // EMAIL
  const emailVal = regEmail.value.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
  if (!emailValid) {
    showError(regEmail, 'Enter a valid email address');
    valid = false;
  } else showError(regEmail, '');

  // PASSWORD
  const passVal = regPass.value.trim();
  if (passVal.length < 6) {
    showError(regPass, 'Password must be at least 6 characters');
    valid = false;
  } else showError(regPass, '');

  // CONFIRM PASSWORD
  if (regConfirm.value.trim() !== passVal || regConfirm.value === '') {
    showError(regConfirm, 'Passwords do not match');
    valid = false;
  } else showError(regConfirm, '');

  // если ошибки есть — не показываем success
  if (!valid) return;

  // если всё ок
  regForm.reset();
  successMsg.hidden = false;
});