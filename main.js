// ---------- Login / Register toggle ----------
const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');

if (loginBtn && registerBtn && loginForm && registerForm) {
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
}

// ---------- Register form validation ----------
const regEmail = document.getElementById('regEmail');
const regPass = document.getElementById('regPass');
const regConfirm = document.getElementById('regConfirm');
const regForm = document.getElementById('registerForm');
const successMsg = document.getElementById('successMsg');

if (regForm) {
  function showError(input, message) {
    const small = input.parentElement.querySelector('.error');
    if (small) small.textContent = message;
    if (message) input.classList.add('invalid');
    else input.classList.remove('invalid');
  }

  regForm.addEventListener('submit', function (e) {
    e.preventDefault();
    if (successMsg) successMsg.hidden = true;

    let valid = true;

    const emailVal = regEmail.value.trim();
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    if (!emailValid) {
      showError(regEmail, 'Enter a valid email address');
      valid = false;
    } else showError(regEmail, '');

    const passVal = regPass.value.trim();
    if (passVal.length < 6) {
      showError(regPass, 'Password must be at least 6 characters');
      valid = false;
    } else showError(regPass, '');

    if (regConfirm.value.trim() !== passVal || regConfirm.value === '') {
      showError(regConfirm, 'Passwords do not match');
      valid = false;
    } else showError(regConfirm, '');

    if (!valid) return;
    regForm.reset();
    if (successMsg) successMsg.hidden = false;
  });
}

// ---------- Simple background toggle ----------
let isPink = false;
function toggleBackgroundColor() {
  document.body.style.backgroundColor = isPink ? 'white' : '#FFD8F0';
  isPink = !isPink;
}

// ---------- Popup open/close ----------
const openBtn = document.getElementById('openBtn');
const popupForm = document.getElementById('popupForm');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');

if (openBtn && popupForm && overlay && closeBtn) {
  openBtn.onclick = () => {
    popupForm.style.display = 'flex';
    overlay.style.display = 'flex';
  };
  closeBtn.onclick = overlay.onclick = () => {
    popupForm.style.display = 'none';
    overlay.style.display = 'none';
  };
}

// ---------- Footer clock ----------
window.addEventListener("load", () => {
  const footerDate = document.getElementById("currentDateTimeFooter");
  if (footerDate) {
    function displayCurrentDateTime() {
      const now = new Date();
      const formatted = now.toLocaleString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false
      });
      footerDate.textContent = formatted;
    }
    displayCurrentDateTime();
    setInterval(displayCurrentDateTime, 1000);
  }
});

// ---------- Home: Shop now message toggle ----------
document.addEventListener('DOMContentLoaded', function() {
  const shopNowButton = document.getElementById('shopNowBtn');
  const messageElement = document.getElementById('message');

  if (shopNowButton && messageElement) {
    shopNowButton.addEventListener('click', function(event) {
      event.preventDefault();
      const orig = "Our store is created to help you express your feelings and give happiness to dear women. Every gift here is filled with love, tenderness, and care.";
      if (messageElement.textContent === orig) {
        messageElement.innerHTML = "Special Offer:<br>Get 20% off on your first purchase,<br>use code 'PRETTYWOMEN'!";
      } else {
        messageElement.innerHTML = orig;
      }
    });
  }
});

// ---------- Add to cart (mini total) ----------
document.addEventListener("DOMContentLoaded", () => {
  const cart = [];
  const cartButtons = document.querySelectorAll(".cart-btn");
  const totalDisplayContainer = document.getElementById("cartTotal");
  const totalAmountEl =
    document.getElementById("cartAmount") ||
    (totalDisplayContainer && totalDisplayContainer.querySelector("b"));

  if (cartButtons.length > 0 && totalAmountEl) {
    cartButtons.forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();

        const productBox = e.target.closest(".box");
        const name = productBox?.querySelector("h3")?.textContent || "Unknown";
        const priceText = productBox?.querySelector(".price")?.textContent || "$12";
        const price = parseFloat(priceText.replace(/[^0-9.]/g, "")) || 12;

        cart.push({ name, price });
        const total = cart.reduce((s, i) => s + i.price, 0);
        totalAmountEl.textContent = `$${total.toFixed(2)}`;
        e.target.textContent = "✓ Added!";
        e.target.style.backgroundColor = "#e84393";
        setTimeout(() => {
          e.target.textContent = "add to cart";
          e.target.style.backgroundColor = "";
        }, 900);
      });
    });
  }
});

// ---------- Night mode ----------
window.addEventListener("DOMContentLoaded", () => {
  const themeBtn = document.getElementById("themeBtn");
  const body = document.body;
  const THEME_KEY = "theme";

  if (!themeBtn) return;

  function applyTheme(mode) {
    const isDark = mode === "dark";
    body.classList.toggle("dark-mode", isDark);
    themeBtn.textContent = isDark ? "☀️ Day Mode" : "🌙 Night Mode";
  }

  let saved = localStorage.getItem(THEME_KEY);
  if (!saved) {
    saved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  applyTheme(saved);

  themeBtn.addEventListener("click", () => {
    const newMode = body.classList.contains("dark-mode") ? "light" : "dark";
    localStorage.setItem(THEME_KEY, newMode);
    applyTheme(newMode);
  });
});

// ---------- Navbar keyboard navigation ----------
const menuItems = document.querySelectorAll('.nav-item');
let currentIndex = 0;

function updateFocus() {
  menuItems.forEach(item => item.classList.remove('focused'));
  if (!menuItems.length) return;
  menuItems[currentIndex].classList.add('focused');
  const a = menuItems[currentIndex].querySelector('a');
  if (a) a.focus();
}

document.addEventListener('keydown', function(event) {
  if (!menuItems.length) return;
  if (event.key === 'ArrowRight') {
    currentIndex = (currentIndex + 1) % menuItems.length;
    updateFocus();
  } else if (event.key === 'ArrowLeft') {
    currentIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    updateFocus();
  }
});
updateFocus();

// ---------- Popup open/close (selectors exist?) ----------
const openBtn2 = document.querySelector('#openBtn');
const closeBtn2 = document.querySelector('#closeBtn');
const overlay2 = document.querySelector('#overlay');
const popup2 = document.querySelector('#popupForm');
if (openBtn2 && closeBtn2 && overlay2 && popup2) {
  openBtn2.addEventListener('click', () => { popup2.style.display = 'block'; overlay2.style.display = 'block'; });
  closeBtn2.addEventListener('click', () => { popup2.style.display = 'none'; overlay2.style.display = 'none'; });
  overlay2.addEventListener('click', () => { popup2.style.display = 'none'; overlay2.style.display = 'none'; });
}

// ---------- Star rating ----------
const allStar = document.querySelectorAll('.rating .star');
const ratingValue = document.querySelector('.rating input');
if (allStar.length && ratingValue) {
  allStar.forEach((item, idx) => {
    item.addEventListener('click', function () {
      let click = 0;
      ratingValue.value = idx + 1;

      allStar.forEach(i => {
        i.classList.replace('bxs-star', 'bx-star');
        i.classList.remove('active');
      });

      for (let i = 0; i <= idx; i++) {
        allStar[i].classList.replace('bx-star', 'bxs-star');
        allStar[i].classList.add('active');
      }
      for (let i = idx + 1; i < allStar.length; i++) {
        allStar[i].style.setProperty('--i', click);
        click++;
      }
    });
  });
}

// ---------- Contact form (safe) ----------
const contactFormEl = document.getElementById('contactForm');
if (contactFormEl) {
  contactFormEl.addEventListener('submit', function(event) {
    event.preventDefault();

    document.querySelectorAll('.error').forEach(message => message.remove());

    const name = document.getElementById('name')?.value || "";
    const email = document.getElementById('email')?.value || "";
    const phoneEl = document.getElementById('phone');
    const message = document.getElementById('message')?.value || "";

    let isValid = true;

    const namePattern = /^[A-Za-z\s]+$/;
    if (!name.trim() || !namePattern.test(name)) {
      isValid = false;
      showError('name', 'Please enter a valid name (letters only, no numbers).');
    }

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(email)) {
      isValid = false;
      showError('email', 'Please enter a valid email.');
    }

    if (phoneEl) {
      const phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
      const phoneErr = document.getElementById('phoneError');
      if (!phonePattern.test(phoneEl.value)) {
        isValid = false;
        if (phoneErr) phoneErr.style.display = 'inline';
      } else {
        if (phoneErr) phoneErr.style.display = 'none';
      }
    }

    if (!message.trim()) {
      isValid = false;
      showError('message', 'Message is required.');
    }

    if (isValid) {
      alert('Form submitted successfully!');
    } else {
      alert('Complete everything, it\'s important!');
    }
  });

  const phoneEl = document.getElementById('phone');
  if (phoneEl) {
    phoneEl.addEventListener('input', function(event) {
      let phoneInput = event.target.value.replace(/[^\d+]/g, '');
      if (phoneInput.length > 1 && phoneInput.charAt(0) === '+') {
        phoneInput = phoneInput.replace(/^(\+7)(\d{3})(\d{3})(\d{2})(\d{2})$/, '$1($2)$3-$4-$5');
      }
      event.target.value = phoneInput;
    });
  }
}

// ---------- Extra background colors cycler ----------
const backgroundColors = ['#D7BFDC', '#FFD8F0', '#ADD8E6', '#98FB98', '#FFFACD', '#FFB6C1', 'white'];
let colorIndex = 0;
function toggleBackgroundColorCycle() {
  document.body.style.backgroundColor = backgroundColors[colorIndex];
  colorIndex = (colorIndex + 1) % backgroundColors.length;
}

// ---------- Optional "show time" button (safe) ----------
function displayCurrentDateTime() {
  let currentDate = new Date();
  let formattedDate = currentDate.toLocaleString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true
  });
  const el = document.getElementById('currentDateTimeFooter');
  if (el) el.innerText = formattedDate;
}
const showTimeBtn = document.getElementById('showTimeButton');
if (showTimeBtn) {
  showTimeBtn.addEventListener('click', function() {
    showTimeBtn.style.display = 'none';
    displayCurrentDateTime();
    setInterval(displayCurrentDateTime, 1000);
  });
}

// === Products: Search + Highlight (все секции) ===
window.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput") || document.getElementById("productSearch");
  const highlightBtn = document.getElementById("highlightBtn");
  const suggest = document.getElementById("searchSuggest");
  if (!input) return;

  // все секции товаров и все карточки
  const sections = Array.from(document.querySelectorAll("section.products"));
  const cards = sections.flatMap(s => Array.from(s.querySelectorAll(".box, .card, .product-card")));

  // фильтр + скрытие пустых секций
  function filterCards(q) {
    const needles = q.toLowerCase().split(/\s+/).filter(Boolean);
    sections.forEach(section => {
      let visible = 0;
      section.querySelectorAll(".box, .card, .product-card").forEach(card => {
        const ok = !needles.length || needles.every(n => card.textContent.toLowerCase().includes(n));
        card.style.display = ok ? "" : "none";
        if (ok) visible++;
      });
      section.style.display = visible ? "" : "none";
    });
  }

  // подсказки из заголовков
  const names = Array.from(new Set(
    cards.map(c => (c.querySelector("h3, .card-title")?.textContent || "").trim()).filter(Boolean)
  ));

  function renderSuggest(q){
    if (!suggest) return;
    suggest.innerHTML = "";
    q = q.trim().toLowerCase();
    if (!q) { suggest.style.display = "none"; return; }
    const items = names.filter(n => n.toLowerCase().includes(q)).slice(0,6);
    if (!items.length) { suggest.style.display = "none"; return; }
    suggest.style.display = "block";
    items.forEach(n=>{
      const li = document.createElement("li");
      li.className = "list-group-item suggest-item";
      li.style.cursor = "pointer";
      li.textContent = n;
      li.addEventListener("click", ()=>{
        input.value = n;
        suggest.style.display = "none";
        filterCards(n);
        clearHighlights();
        doHighlight(n);
      });
      suggest.appendChild(li);
    });
  }

  input.addEventListener("input", () => {
    const q = input.value.trim();
    filterCards(q);
    renderSuggest(q);
  });

  // ===== подсветка по ВСЕМ секциям =====
  const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  function clearHighlights(){
    sections.forEach(root => {
      root.querySelectorAll("mark.hl").forEach(mark => {
        const t = document.createTextNode(mark.textContent);
        mark.replaceWith(t);
        t.parentElement?.normalize?.();
      });
    });
  }

  function doHighlight(q){
    if (!q) return;
    const re = new RegExp(esc(q), "gi");
    sections.forEach(root => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
        acceptNode(node){
          if (!node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
          const p = node.parentElement?.tagName;
          return (p && !["SCRIPT","STYLE","MARK"].includes(p))
            ? NodeFilter.FILTER_ACCEPT
            : NodeFilter.FILTER_REJECT;
        }
      });
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach(node => {
        const text = node.nodeValue;
        if (!re.test(text)) return;
        re.lastIndex = 0;

        const frag = document.createDocumentFragment();
        let last = 0, m;
        while ((m = re.exec(text))) {
          if (m.index > last) frag.appendChild(document.createTextNode(text.slice(last, m.index)));
          const mark = document.createElement("mark");
          mark.className = "hl";
          mark.textContent = m[0];
          frag.appendChild(mark);
          last = m.index + m[0].length;
        }
        if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      });
    });
  }

  if (highlightBtn){
    highlightBtn.addEventListener("click", ()=>{
      const q = input.value.trim();
      clearHighlights();
      doHighlight(q);
    });
  }
});
// ---- Copy to Clipboard (универсальный) ----
function _textFrom(el) {
  if (!el) return "";
  if ("value" in el) return el.value;                    // input/textarea
  if (el.getAttribute && el.getAttribute("contenteditable") === "true") {
    return el.innerText || el.textContent || "";
  }
  return el.innerText || el.textContent || "";
}

document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".copy-btn");
  if (!btn) return;

  // Можно использовать data-copy или data-target
  const selector = btn.dataset.copy || btn.dataset.target;
  const el = selector ? document.querySelector(selector) : null;
  const text = _textFrom(el);

  const prev = btn.textContent;
  const setBack = () => setTimeout(() => (btn.textContent = prev), 1200);

  if (!text) {
    btn.textContent = "No text";
    return setBack();
  }

  // 1) Современный способ
  try {
    await navigator.clipboard.writeText(text);
    btn.textContent = "✔ Copied!";
    return setBack();
  } catch (_) {
    // 2) Fallback для старых движков
    try {
      if (el && "select" in el) {
        const active = document.activeElement;
        el.focus(); el.select();
        document.execCommand("copy");
        if (active && active.focus) active.focus();
      } else if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand("copy");
        sel.removeAllRanges();
      } else {
        // крайний случай: создаём временное поле
        const ta = document.createElement("textarea");
        ta.value = text;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }
      btn.textContent = "✔ Copied!";
    } catch (err) {
      console.error(err);
      btn.textContent = "Failed";
    } finally {
      setBack();
    }
  }
});
// === TASK 9: Lazy loading для изображений ===
(function lazyLoadImages(){
  const imgs = Array.from(document.querySelectorAll('img.lazy[data-src]'));
  if (!imgs.length) return;

  const markLoaded = (img) => {
    img.classList.add('lazy-loaded');
    img.removeAttribute('data-src');
  };

  // Современный способ
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const img = entry.target;
        img.src = img.dataset.src;
        img.addEventListener('load', () => markLoaded(img), { once: true });
        obs.unobserve(img);
      });
    }, { rootMargin: '200px 0px' }); // подгружаем чуть заранее

    imgs.forEach(img => io.observe(img));
    return;
  }

  // Фоллбэк для старых браузеров
  let pending = imgs.slice();
  function loadVisible() {
    const limit = window.scrollY + window.innerHeight + 200;
    pending = pending.filter(img => {
      if (!img.dataset.src) return false;
      const rect = img.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      if (top < limit) {
        img.src = img.dataset.src;
        img.addEventListener('load', () => markLoaded(img), { once: true });
        return false; // убираем из списка
      }
      return true;
    });
    if (!pending.length) {
      window.removeEventListener('scroll', loadVisible);
      window.removeEventListener('resize', loadVisible);
      window.removeEventListener('orientationchange', loadVisible);
    }
  }
  window.addEventListener('scroll', loadVisible);
  window.addEventListener('resize', loadVisible);
  window.addEventListener('orientationchange', loadVisible);
  loadVisible(); // первичный прогон
})();