

const USERS_KEY = 'az_users';
const CURRENT_USER_KEY = 'az_current_user';

const loginBtn = document.getElementById('loginBtn');
const registerBtn = document.getElementById('registerBtn');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const loginError = document.getElementById('loginError');

if (loginBtn && registerBtn && loginForm && registerForm) {
  loginBtn.addEventListener('click', () => {
    loginBtn.classList.add('active');
    registerBtn.classList.remove('active');
    loginForm.classList.add('active');
    registerForm.classList.remove('active');
    if (loginError) loginError.textContent = '';
  });

  registerBtn.addEventListener('click', () => {
    registerBtn.classList.add('active');
    loginBtn.classList.remove('active');
    registerForm.classList.add('active');
    loginForm.classList.remove('active');
    if (loginError) loginError.textContent = '';
  });
}

const regForm   = document.getElementById('registerForm');
const regUser   = document.getElementById('regUser');
const regEmail  = document.getElementById('regEmail');
const regPass   = document.getElementById('regPass');
const regConfirm= document.getElementById('regConfirm');
const successMsg= document.getElementById('successMsg');

function loadUsers() {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}
function saveUsers(list) {
  localStorage.setItem(USERS_KEY, JSON.stringify(list));
}

function showRegError(inputEl, msg) {
  const errBox = inputEl?.nextElementSibling;
  if (errBox && errBox.classList.contains('error')) {
    errBox.textContent = msg || '';
  }
  if (msg) {
    inputEl.classList.add('invalid');
  } else {
    inputEl.classList.remove('invalid');
  }
}


if (regForm) {
  regForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (successMsg) successMsg.hidden = true;

    let ok = true;
    const usernameVal = (regUser?.value || '').trim();
    const emailVal    = (regEmail?.value || '').trim();
    const passVal     = (regPass?.value || '').trim();
    const confirmVal  = (regConfirm?.value || '').trim();


    if (!usernameVal || usernameVal.length < 3) {
      ok = false;
      showRegError(regUser, 'Username must be at least 3 characters');
    } else showRegError(regUser, '');

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal);
    if (!emailValid) {
      ok = false;
      showRegError(regEmail, 'Enter a valid email address');
    } else showRegError(regEmail, '');

    const passComplex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/.test(passVal);
    if (!passComplex) {
      ok = false;
      showRegError(
        regPass,
        'Min 6 chars, must include letters and numbers'
      );
    } else showRegError(regPass, '');

    if (!confirmVal || confirmVal !== passVal) {
      ok = false;
      showRegError(regConfirm, 'Passwords do not match');
    } else showRegError(regConfirm, '');

    const users = loadUsers();
    if (users.some(u => u.username === usernameVal)) {
      ok = false;
      showRegError(regUser, 'This username is already taken');
    }
    if (users.some(u => u.email === emailVal)) {
      ok = false;
      showRegError(regEmail, 'This email is already registered');
    }

    if (!ok) return;

    users.push({
      username: usernameVal,
      email: emailVal,
      password: passVal   
    });
    saveUsers(users);

    regForm.reset();
    if (successMsg) successMsg.hidden = false;
  });
}

if (loginForm) {
  const loginUser = document.getElementById('loginUser');
  const loginPassEl = document.getElementById('loginPass');

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (loginError) loginError.textContent = '';

    const loginVal = (loginUser?.value || '').trim();
    const passVal  = (loginPassEl?.value || '').trim();

    if (!loginVal || !passVal) {
      if (loginError) loginError.textContent = 'Fill in both fields';
      return;
    }

    const users = loadUsers();
    const found = users.find(
      u =>
        (u.username === loginVal || u.email === loginVal) &&
        u.password === passVal
    );

    if (!found) {
      if (loginError) loginError.textContent = 'Wrong login or password';
      return;
    }

    localStorage.setItem(
      CURRENT_USER_KEY,
      JSON.stringify({ username: found.username, email: found.email })
    );

    window.location.href = 'profile.html';
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const shopNowButton = document.getElementById('shopNowBtn');
  const messageEl = document.getElementById('message'); 

  if (!shopNowButton || !messageEl) return;

  
  const originalText = messageEl.innerHTML.trim();
  let showingOffer = false;

  shopNowButton.addEventListener('click', (e) => {
    e.preventDefault();

    if (!showingOffer) {
      messageEl.innerHTML =
        "Special Offer! 💖 Use code <b>LOVE10</b> at checkout for <b>10% OFF</b> today!";
      messageEl.style.color = '#ff79c6';
      messageEl.style.fontWeight = '500';
      showingOffer = true;
    } else {
      messageEl.innerHTML = originalText;
      messageEl.style.color = '';
      messageEl.style.fontWeight = '';
      showingOffer = false;
    }
  });
});


let isPink = false;
function toggleBackgroundColor() {
  document.body.style.backgroundColor = isPink ? 'white' : '#FFD8F0';
  isPink = !isPink;
}

const backgroundColors = ['#D7BFDC', '#FFD8F0', '#ADD8E6', '#98FB98', '#FFFACD', '#FFB6C1', 'white'];
let colorIndex = 0;
function toggleBackgroundColorCycle() {
  document.body.style.backgroundColor = backgroundColors[colorIndex];
  colorIndex = (colorIndex + 1) % backgroundColors.length;
}

document.addEventListener('DOMContentLoaded', () => {
  const cart = [];

  const cartButtons = document.querySelectorAll('.cart-btn');
  const totalAmountEl =
    document.getElementById('cartAmount') ||
    document.querySelector('#cartTotal b');

  if (cartButtons.length && totalAmountEl) {
    cartButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();

        const productBox = e.target.closest('.box');
        const name =
          productBox?.querySelector('h3')?.textContent?.trim() || 'Unknown';
        const priceText =
          productBox?.querySelector('.price')?.textContent || '$12';
        const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 12;

        cart.push({ name, price });
        const total = cart.reduce((sum, item) => sum + item.price, 0);

        totalAmountEl.textContent = `$${total.toFixed(2)}`;

        btn.textContent = '✓ Added!';
        btn.style.backgroundColor = '#e84393';
        setTimeout(() => {
          btn.textContent = 'add to cart';
          btn.style.backgroundColor = '';
        }, 900);
      });
    });
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const themeBtn = document.getElementById('themeBtn');
  const body = document.body;
  const THEME_KEY = 'theme';

  if (!themeBtn) return;

  function applyTheme(mode) {
    const isDark = mode === 'dark';
    body.classList.toggle('dark-mode', isDark);
    themeBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Night Mode';
  }

  let saved = localStorage.getItem(THEME_KEY);
  if (!saved) {
    saved = window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  applyTheme(saved);

  themeBtn.addEventListener('click', () => {
    const newMode = body.classList.contains('dark-mode') ? 'light' : 'dark';
    localStorage.setItem(THEME_KEY, newMode);
    applyTheme(newMode);
  });
});

const menuItems = document.querySelectorAll('.nav-item');
let navCurrentIndex = 0;

function updateNavFocus() {
  menuItems.forEach((item) => item.classList.remove('focused'));
  if (!menuItems.length) return;
  menuItems[navCurrentIndex].classList.add('focused');
  const link = menuItems[navCurrentIndex].querySelector('a');
  if (link) link.focus();
}
if (menuItems.length) {
  document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
      navCurrentIndex = (navCurrentIndex + 1) % menuItems.length;
      updateNavFocus();
    } else if (event.key === 'ArrowLeft') {
      navCurrentIndex =
        (navCurrentIndex - 1 + menuItems.length) % menuItems.length;
      updateNavFocus();
    }
  });
  updateNavFocus();
}

(function initPopup() {
  const openBtn = document.querySelector('#openBtn');
  const closeBtn = document.querySelector('#closeBtn');
  const overlay = document.querySelector('#overlay');
  const popup = document.querySelector('#popupForm');
  const submitBtn = document.querySelector('#submitBtn');

  function openPopup() {
    if (!popup || !overlay) return;
    popup.style.display = 'block';
    overlay.style.display = 'block';
  }
  function closePopup() {
    if (!popup || !overlay) return;
    popup.style.display = 'none';
    overlay.style.display = 'none';
  }

  if (openBtn && overlay && popup) {
    openBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openPopup();
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault();
      closePopup();
    });
  }

  if (overlay) {
    overlay.addEventListener('click', closePopup);
  }


  const allStar = document.querySelectorAll('.rating .star');
  const ratingValueInput = document.querySelector('.rating input');
  if (allStar.length && ratingValueInput) {
    allStar.forEach((star, idx) => {
      star.addEventListener('click', () => {
        ratingValueInput.value = String(idx + 1);

        allStar.forEach((s, i) => {
          if (i <= idx) {
            s.classList.remove('bx-star');
            s.classList.add('bxs-star', 'active');
          } else {
            s.classList.remove('bxs-star', 'active');
            s.classList.add('bx-star');
          }
        });
      });
    });
  }

  if (submitBtn) {
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      const nameVal =
        document.getElementById('popupName')?.value.trim() || '';
      const emailVal =
        document.getElementById('popupEmail')?.value.trim() || '';
      const ratingVal =
        document.querySelector('.rating input')?.value || '';

      if (!nameVal || !emailVal || !ratingVal) {
        alert('Please fill all fields and pick stars ⭐');
        return;
      }

      alert('Thank you for your feedback! 💖');

      const nameInput = document.getElementById('popupName');
      const emailInput = document.getElementById('popupEmail');
      if (nameInput) nameInput.value = '';
      if (emailInput) emailInput.value = '';
      if (ratingValueInput) ratingValueInput.value = '';

      closePopup();
    });
  }
})();


const contactFormEl = document.getElementById('contactForm');
if (contactFormEl) {
  contactFormEl.addEventListener('submit', (event) => {
    event.preventDefault();

    contactFormEl.querySelectorAll('.error').forEach((m) => {
      m.textContent = '';
    });

    const nameInput = contactFormEl.querySelector('#name');
    const emailInput = contactFormEl.querySelector('#email');
    const phoneInput = contactFormEl.querySelector('#phone');
    const msgInput = contactFormEl.querySelector('#message');

    let isValid = true;

    const nameVal = (nameInput?.value || '').trim();
    const namePattern = /^[A-Za-z\s]+$/;
    if (!nameVal || !namePattern.test(nameVal)) {
      isValid = false;
      setInlineError('name', 'Please enter a valid name (letters only, no numbers).');
    }

    const emailVal = (emailInput?.value || '').trim();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(emailVal)) {
      isValid = false;
      setInlineError('email', 'Please enter a valid email.');
    }

    if (phoneInput) {
      const phoneErr = contactFormEl.querySelector('#phoneError');
      const phonePattern = /^\+7\(\d{3}\)\d{3}-\d{2}-\d{2}$/;
      if (!phonePattern.test(phoneInput.value)) {
        isValid = false;
        if (phoneErr) phoneErr.style.display = 'inline';
      } else {
        if (phoneErr) phoneErr.style.display = 'none';
      }
    }

    const msgVal = (msgInput?.value || '').trim();
    if (!msgVal) {
      isValid = false;
      setInlineError('message', 'Message is required.');
    }

    if (!isValid) return;

    alert('Your message was sent. Thank you!');
    contactFormEl.reset();
  });

  const phoneInput = contactFormEl.querySelector('#phone');
  if (phoneInput) {
    phoneInput.addEventListener('input', (event) => {
      let digits = event.target.value.replace(/[^\d+]/g, '');

      const match = digits.match(/^(\+7)?(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2}).*$/);
      if (match) {
        const [, plus7, p1, p2, p3, p4] = match;
        let formatted = '';
        if (plus7) formatted += plus7;
        if (p1) formatted += '(' + p1;
        if (p1 && p1.length === 3) formatted += ')';
        if (p2) formatted += p2;
        if (p2 && p2.length === 3) formatted += '-';
        if (p3) formatted += p3;
        if (p3 && p3.length === 2) formatted += '-';
        if (p4) formatted += p4;
        event.target.value = formatted;
      } else {
        event.target.value = digits;
      }
    });
  }

  function setInlineError(inputId, text) {
    const field = contactFormEl.querySelector('#' + inputId);
    if (!field) return;
    let err = field.parentElement.querySelector('.error');
    if (!err) {
      err = document.createElement('small');
      err.className = 'error';
      field.parentElement.appendChild(err);
    }
    err.textContent = text;
  }
}

function displayCurrentDateTime() {
  const target = document.getElementById('currentDateTimeFooter');
  if (!target) return;

  const now = new Date();
  const formatted = now.toLocaleString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  target.innerText = formatted;
}

const showTimeBtn = document.getElementById('showTimeButton');
if (showTimeBtn) {
  showTimeBtn.addEventListener('click', () => {
    showTimeBtn.style.display = 'none';
    displayCurrentDateTime();
    setInterval(displayCurrentDateTime, 1000);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const input =
    document.getElementById('searchInput') ||
    document.getElementById('productSearch');
  const highlightBtn = document.getElementById('highlightBtn');
  const suggestBox = document.getElementById('searchSuggest');

  if (!input) return;

  const productSections = Array.from(
    document.querySelectorAll('section.products')
  );

  function getAllCards() {
    return productSections.flatMap((section) =>
      Array.from(section.querySelectorAll('.box, .card, .product-card'))
    );
  }

  function filterCards(query) {
    const words = query
      .toLowerCase()
      .split(/\s+/)
      .filter(Boolean);

    productSections.forEach((section) => {
      let visibleCount = 0;
      section
        .querySelectorAll('.box, .card, .product-card')
        .forEach((card) => {
          const text = card.textContent.toLowerCase();
          const ok = !words.length || words.every((w) => text.includes(w));
          card.style.display = ok ? '' : 'none';
          if (ok) visibleCount++;
        });
      section.style.display = visibleCount ? '' : 'none';
    });
  }

  const productNames = Array.from(
    new Set(
      getAllCards()
        .map((c) => {
          const title =
            c.querySelector('h3, .card-title')?.textContent?.trim() || '';
          return title;
        })
        .filter(Boolean)
    )
  );

  function renderSuggest(query) {
    if (!suggestBox) return;
    suggestBox.innerHTML = '';

    const q = query.trim().toLowerCase();
    if (!q) {
      suggestBox.style.display = 'none';
      return;
    }

    const matches = productNames
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 6);

    if (!matches.length) {
      suggestBox.style.display = 'none';
      return;
    }

    suggestBox.style.display = 'block';

    matches.forEach((name) => {
      const li = document.createElement('li');
      li.className = 'list-group-item suggest-item';
      li.style.cursor = 'pointer';
      li.textContent = name;

      li.addEventListener('click', () => {
        input.value = name;
        suggestBox.style.display = 'none';
        filterCards(name);
        clearHighlights();
        doHighlight(name);
      });

      suggestBox.appendChild(li);
    });
  }

  input.addEventListener('input', () => {
    const q = input.value.trim();
    filterCards(q);
    renderSuggest(q);
  });

  function escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function clearHighlights() {
    productSections.forEach((section) => {
      section.querySelectorAll('mark.hl').forEach((mark) => {
        const textNode = document.createTextNode(mark.textContent);
        mark.replaceWith(textNode);
        if (textNode.parentElement && textNode.parentElement.normalize) {
          textNode.parentElement.normalize();
        }
      });
    });
  }

  function doHighlight(q) {
    if (!q) return;
    const re = new RegExp(escapeRegex(q), 'gi');

    productSections.forEach((section) => {
      const walker = document.createTreeWalker(
        section,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode(node) {
            const p = node.parentElement?.tagName;
            if (!p) return NodeFilter.FILTER_REJECT;
            if (['SCRIPT', 'STYLE', 'MARK'].includes(p)) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        }
      );

      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);

      nodes.forEach((node) => {
        const text = node.nodeValue;
        if (!re.test(text)) {
          re.lastIndex = 0;
          return;
        }
        re.lastIndex = 0;

        const frag = document.createDocumentFragment();
        let lastIndex = 0;
        let match;
        while ((match = re.exec(text))) {
          if (match.index > lastIndex) {
            frag.appendChild(
              document.createTextNode(text.slice(lastIndex, match.index))
            );
          }
          const mark = document.createElement('mark');
          mark.className = 'hl';
          mark.textContent = match[0];
          frag.appendChild(mark);

          lastIndex = match.index + match[0].length;
        }
        if (lastIndex < text.length) {
          frag.appendChild(
            document.createTextNode(text.slice(lastIndex))
          );
        }

        node.parentNode.replaceChild(frag, node);
      });
    });
  }

  if (highlightBtn) {
    highlightBtn.addEventListener('click', () => {
      const q = input.value.trim();
      clearHighlights();
      doHighlight(q);
    });
  }
});

function textFromElement(el) {
  if (!el) return '';
  if ('value' in el) return el.value;
  if (el.getAttribute && el.getAttribute('contenteditable') === 'true') {
    return el.innerText || el.textContent || '';
  }
  return el.innerText || el.textContent || '';
}

document.addEventListener('click', async (e) => {
  const btn = e.target.closest('.copy-btn');
  if (!btn) return;

  const selector = btn.dataset.copy || btn.dataset.target;
  const el = selector ? document.querySelector(selector) : null;
  const text = textFromElement(el);

  const originalBtnText = btn.textContent;

  async function setTemp(msg) {
    btn.textContent = msg;
    setTimeout(() => {
      btn.textContent = originalBtnText;
    }, 1200);
  }

  if (!text) {
    return setTemp('No text');
  }

  try {
    await navigator.clipboard.writeText(text);
    return setTemp('✔ Copied!');
  } catch (_) {
    try {
      if (el && 'select' in el) {
        const active = document.activeElement;
        el.focus();
        el.select();
        document.execCommand('copy');
        if (active && active.focus) active.focus();
      } else if (el) {
        const range = document.createRange();
        range.selectNodeContents(el);
        const sel = window.getSelection();
        sel.removeAllRanges();
        sel.addRange(range);
        document.execCommand('copy');
        sel.removeAllRanges();
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      return setTemp('✔ Copied!');
    } catch (err) {
      console.error(err);
      return setTemp('Failed');
    }
  }
});

(function initScrollProgress() {
  const bar = document.getElementById('progress-bar');
  if (!bar) return;

  function updateBar() {
    const scrollTop =
      window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight;
    const winHeight = window.innerHeight;
    const percent = (scrollTop / (docHeight - winHeight)) * 100;
    bar.style.width = percent + '%';
  }

  window.addEventListener('scroll', updateBar);
  window.addEventListener('resize', updateBar);
  updateBar();
})();

(function lazyLoadImages() {
  const imgs = Array.from(
    document.querySelectorAll('img.lazy[data-src]')
  );
  if (!imgs.length) return;

  function markLoaded(img) {
    img.classList.add('lazy-loaded');
    img.removeAttribute('data-src');
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const img = entry.target;
          img.src = img.dataset.src;
          img.addEventListener(
            'load',
            () => markLoaded(img),
            { once: true }
          );
          obs.unobserve(img);
        });
      },
      { rootMargin: '200px 0px' }
    );

    imgs.forEach((img) => io.observe(img));
    return;
  }

  let pending = imgs.slice();

  function loadVisible() {
    const limit =
      window.scrollY + window.innerHeight + 200;
    pending = pending.filter((img) => {
      if (!img.dataset.src) return false;
      const rect = img.getBoundingClientRect();
      const top = rect.top + window.scrollY;
      if (top < limit) {
        img.src = img.dataset.src;
        img.addEventListener(
          'load',
          () => markLoaded(img),
          { once: true }
        );
        return false;
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
  loadVisible();
})();

document.addEventListener('DOMContentLoaded', () => {
  const colorBtn = document.getElementById('colorCycleBtn');
  if (!colorBtn) return;

  const backgroundColors = [
    '#D7BFDC',
    '#FFD8F0',
    '#ADD8E6',
    '#98FB98',
    '#FFFACD',
    '#FFB6C1',
    'white'
  ];

  let colorIndex = 0;

  colorBtn.addEventListener('click', () => {
    document.body.style.backgroundColor = backgroundColors[colorIndex];
    colorIndex = (colorIndex + 1) % backgroundColors.length;
  });
});

(function initStatCounters() {
  const counters = document.querySelectorAll('.count');
  if (!counters.length) return;
  let animated = false;

  function animateCounters() {
    if (animated) return;
    animated = true;
    $('.count').each(function () {
      const $this = $(this);
      const target = parseInt($this.attr('data-count'), 10) || 0;

      $({ numberValue: 0 }).animate(
        { numberValue: target },
        {
          duration: 2000,
          easing: 'swing',
          step: function (now) {
            $this.text(Math.floor(now));
          },
          complete: function () {
            $this.text(target);
          }
        }
      );
    });
  }
  if ('IntersectionObserver' in window) {
    const section = document.querySelector('.icons-container');
    if (!section) {
      animateCounters();
      return;
    }

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
          obs.disconnect();
        }
      });
    }, {
      threshold: 0.2
    });

    observer.observe(section);
  } else {
    animateCounters();
  }
})();

const orderForm = document.getElementById('orderForm');
if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const buyerName    = orderForm.querySelector('input[placeholder="Write your name"]');
    const buyerPhone   = orderForm.querySelector('input[placeholder="+7 (000) 000-00-00"]');

    const receiverName = orderForm.querySelector('input[placeholder="Имя получателя"]');
    const receiverPhone= orderForm.querySelectorAll('input[placeholder="+7 (000) 000-00-00"]')[1];
    const address      = orderForm.querySelector('input[placeholder="Адрес, подъезд, квартира"]');
    const dateField    = orderForm.querySelector('#date');

    if (
      !buyerName.value.trim() ||
      !buyerPhone.value.trim() ||
      !receiverName.value.trim() ||
      !receiverPhone.value.trim() ||
      !address.value.trim() ||
      !dateField.value
    ) {
      alert('Please fill in all required fields.');
      return;
    }

    alert('Your order has been accepted! 💐 We will contact you to confirm.');
    orderForm.reset();
  });
}

function showToast(msg) {
  const toastBox = document.getElementById('toast');
  if (!toastBox) return;

  toastBox.textContent = msg;
  toastBox.style.display = 'block';
  toastBox.className = 'alert alert-dark shadow position-fixed bottom-0 end-0 m-3';
  toastBox.style.zIndex = '9999';
  toastBox.style.minWidth = '200px';
  toastBox.style.maxWidth = '260px';
  toastBox.style.fontSize = '14px';
  toastBox.style.padding = '10px 14px';
  toastBox.style.opacity = '1';

  setTimeout(() => {
    toastBox.style.transition = 'opacity .4s';
    toastBox.style.opacity = '0';

    setTimeout(() => {
      toastBox.style.display = 'none';
      toastBox.style.transition = '';
      toastBox.style.opacity = '';
    }, 400);
  }, 1500);
}


const FAVORITES_KEY = 'az_favorites';
const CART_KEY      = 'az_cart';

function loadList(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
}

function getProductFromBox(box) {
  if (!box) return null;

  const title = box.querySelector('.content h3')?.textContent.trim() || 'Product';
  const priceText = box.querySelector('.content .price')?.textContent || '$0';
  const price = parseFloat(priceText.replace(/[^0-9.]/g, '')) || 0;
  const img = box.querySelector('.image img')?.getAttribute('src') || '';

  const id = title + '|' + img; 

  return { id, title, price, img };
}

document.addEventListener('DOMContentLoaded', () => {
  let favorites = loadList(FAVORITES_KEY);
  let cart      = loadList(CART_KEY);

  const favButtons   = document.querySelectorAll('.fav-btn');
  const cartButtons  = document.querySelectorAll('.cart-btn');
  const shareButtons = document.querySelectorAll('.share-btn');

  const favCountEl  = document.getElementById('favCount');
  const cartCountEl = document.getElementById('cartCount');

  function updateCounters() {
    if (favCountEl)  favCountEl.textContent  = favorites.length;
    if (cartCountEl) {
      const totalQty = cart.reduce((sum, item) => sum + (item.qty || 1), 0);
      cartCountEl.textContent = totalQty;
    }
  }

  function setFavBtnState(btn, active) {
    if (active) {
      btn.classList.add('active-fav');
      btn.classList.remove('fa-heart');
      btn.classList.add('fa-check');
    } else {
      btn.classList.remove('active-fav');
      btn.classList.remove('fa-check');
      btn.classList.add('fa-heart');
    }
  }

  favButtons.forEach(btn => {
    const box = btn.closest('.box');
    const product = getProductFromBox(box);
    if (!product) return;

    if (favorites.some(p => p.id === product.id)) {
      setFavBtnState(btn, true);
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const index = favorites.findIndex(p => p.id === product.id);

      if (index === -1) {
        favorites.push(product);
        setFavBtnState(btn, true);
        showToast('The product added to favorites 💖');
      } else {
        favorites.splice(index, 1);
        setFavBtnState(btn, false);
        showToast('Removed from favorites');
      }

      saveList(FAVORITES_KEY, favorites);
      updateCounters();
    });
  });

  function setCartBtnState(btn, active) {
    if (active) {
      btn.dataset.incart = 'true';
      btn.innerHTML = '<i class="fas fa-check"></i> added';
    } else {
      btn.dataset.incart = 'false';
      btn.innerHTML = 'add to cart';
    }
  }

  cartButtons.forEach(btn => {
    const box = btn.closest('.box');
    const product = getProductFromBox(box);
    if (!product) return;

    const existing = cart.find(p => p.id === product.id);
    if (existing) {
      setCartBtnState(btn, true);
    }

    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const index = cart.findIndex(p => p.id === product.id);

      if (index === -1) {
        cart.push({ ...product, qty: 1 });
        setCartBtnState(btn, true);
        showToast('Item added to cart 🛍️');
      } else {
        cart.splice(index, 1);
        setCartBtnState(btn, false);
        showToast('Removed from cart');
      }

      saveList(CART_KEY, cart);
      updateCounters();
    });
  });

  shareButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      const isShared = btn.dataset.shared === 'true';

      if (!isShared) {
        btn.dataset.shared = 'true';
        btn.classList.remove('fa-share');
        btn.classList.add('fa-check');
        showToast('Forwarded 💗');
      } else {
        btn.dataset.shared = 'false';
        btn.classList.remove('fa-check');
        btn.classList.add('fa-share');
        showToast('Cancel sending');
      }
    });
  });

  const favPageContainer = document.getElementById('favoritesContainer');
  const favEmptyText     = document.getElementById('favoritesEmpty');

  if (favPageContainer) {
    if (!favorites.length) {
      if (favEmptyText) favEmptyText.style.display = 'block';
    } else {
      if (favEmptyText) favEmptyText.style.display = 'none';

      favorites.forEach(item => {
        const box = document.createElement('div');
        box.className = 'box';
        box.innerHTML = `
          <div class="image">
            <img src="${item.img}" alt="${item.title}">
          </div>
          <div class="content">
            <h3>${item.title}</h3>
            <div class="price">$${item.price.toFixed(2)}</div>
          </div>
          <div class="icons mt-2">
            <button class="btn btn-sm btn-outline-danger remove-fav">Remove</button>
            <button class="btn btn-sm btn-primary move-to-cart">Add to cart</button>
          </div>
        `;
        favPageContainer.appendChild(box);

        box.querySelector('.remove-fav').addEventListener('click', () => {
          favorites = favorites.filter(p => p.id !== item.id);
          saveList(FAVORITES_KEY, favorites);
          box.remove();
          updateCounters();
          if (!favorites.length && favEmptyText) favEmptyText.style.display = 'block';
        });

        box.querySelector('.move-to-cart').addEventListener('click', () => {
          if (!cart.find(p => p.id === item.id)) {
            cart.push({ ...item, qty: 1 });
            saveList(CART_KEY, cart);
            updateCounters();
            showToast('Item added to cart 🛍️');
          } else {
            showToast('Item already in cart');
          }
        });
      });
    }
  }

  const cartPageContainer = document.getElementById('cartContainer');
  const cartEmptyText     = document.getElementById('cartEmpty');
  const cartTotalEl       = document.getElementById('cartPageTotal');

  function renderCartPage() {
    if (!cartPageContainer) return;

    cartPageContainer.innerHTML = '';

    if (!cart.length) {
      if (cartEmptyText) cartEmptyText.style.display = 'block';
      if (cartTotalEl) cartTotalEl.textContent = '$0.00';
      return;
    }

    if (cartEmptyText) cartEmptyText.style.display = 'none';

    let total = 0;

    cart.forEach(item => {
      const qty = item.qty || 1;
      total += qty * item.price;

      const box = document.createElement('div');
      box.className = 'box';
      box.innerHTML = `
        <div class="image">
          <img src="${item.img}" alt="${item.title}">
        </div>
        <div class="content">
          <h3>${item.title}</h3>
          <div class="price">$${item.price.toFixed(2)} × ${qty}</div>
        </div>
        <div class="icons mt-2">
          <button class="btn btn-sm btn-outline-secondary dec-qty">-</button>
          <button class="btn btn-sm btn-outline-secondary inc-qty">+</button>
          <button class="btn btn-sm btn-outline-danger remove-cart">Remove</button>
        </div>
      `;
      cartPageContainer.appendChild(box);

      box.querySelector('.dec-qty').addEventListener('click', () => {
        if (item.qty > 1) {
          item.qty -= 1;
        } else {
          cart = cart.filter(p => p.id !== item.id);
        }
        saveList(CART_KEY, cart);
        renderCartPage();
        updateCounters();
      });

      box.querySelector('.inc-qty').addEventListener('click', () => {
        item.qty = (item.qty || 1) + 1;
        saveList(CART_KEY, cart);
        renderCartPage();
        updateCounters();
      });

      box.querySelector('.remove-cart').addEventListener('click', () => {
        cart = cart.filter(p => p.id !== item.id);
        saveList(CART_KEY, cart);
        renderCartPage();
        updateCounters();
      });
    });

    if (cartTotalEl) cartTotalEl.textContent = '$' + total.toFixed(2);
  }

  if (cartPageContainer) {
    renderCartPage();
  }

  updateCounters();
});

  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');

    question.addEventListener('click', () => {
      faqItems.forEach(el => {
        if (el !== item) el.classList.remove('active');
      });
      item.classList.toggle('active');
    });
  });

(function loadGiftReviewsFromUnsplash() {
  const container = document.getElementById('giftReviews');
  if (!container) return; 


  const UNSPLASH_ACCESS_KEY = 'cyy2FNWB6kNSoKiSmdZVMRV9dGwHTb7kdAWzg3swNYM';

  const query = 'gift sweets accessories';

  const reviewTexts = [
'The perfect sweet gift for a loved one 🎁',
'Customers adore these gift sets 💕',
'A great option if you want something cute and delicious ✨',
'A very warm and cozy gift – just what you need for a special day 💝',
'A stylish accessory that will definitely be remembered 🎀',
'A delicate sweet surprise for those who appreciate care and attention 🌸'
  ];

  function getRandomReview() {
    const index = Math.floor(Math.random() * reviewTexts.length);
    return reviewTexts[index];
  }

  fetch(
    `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
      query
    )}&per_page=6&orientation=squarish&client_id=${UNSPLASH_ACCESS_KEY}`
  )
    .then(res => res.json())
    .then(data => {
      const photos = data.results || [];

      if (!photos.length) {
        container.innerHTML =
          '<p class="text-muted text-center">Отзывы пока недоступны.</p>';
        return;
      }

      container.innerHTML = '';

      photos.forEach(photo => {
        const col = document.createElement('div');
        col.className = 'col-12 col-md-6 col-lg-4';

        const altText =
          photo.alt_description || 'Gift idea — sweets & accessories';
        const author =
          (photo.user && photo.user.name) || 'Our happy customer';

        col.innerHTML = `
          <div class="card h-100 shadow-sm">
            <img 
              src="${photo.urls.small}" 
              class="card-img-top" 
              alt="${altText}"
              loading="lazy"
            >
            <div class="card-body">
              <p class="mb-2" style="font-size:0.9rem;">
                "${getRandomReview()}"
              </p>
              <p class="mb-0 text-muted" style="font-size:0.8rem;">
                Фото вдохновения: ${author}
              </p>
            </div>
          </div>
        `;

        container.appendChild(col);
      });
    })
    .catch(err => {
      console.error('Unsplash API error:', err);
      container.innerHTML =
        '<p class="text-muted text-center">Отзывы временно недоступны.</p>';
    });
})();