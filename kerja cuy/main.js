/* ====== UTILITIES ====== */
function $(sel){return document.querySelector(sel)}
function $all(sel){return Array.from(document.querySelectorAll(sel))}

/* ====== YEAR REPLACERS ====== */
const years = [ 'year','year2','year3','year4','year5','year6','year7','year8' ];
years.forEach(id => {
  const el = document.getElementById(id);
  if(el) el.textContent = new Date().getFullYear();
});

/* ====== CART ====== */
function getCart(){ return JSON.parse(localStorage.getItem('cartItems')) || [] }
function saveCart(c){ localStorage.setItem('cartItems', JSON.stringify(c)) }

function addToCart(name, price){
  const cart = getCart();
  cart.push({ name, price: Number(price) });
  saveCart(cart);
  alert(`${name} ditambah ke troli!`);
}

/* Attach add-cart buttons if present on page */
$all('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.dataset.name;
    const price = btn.dataset.price;
    addToCart(name, price);
  });
});

/* Render cart (used in cart.html) */
function renderCartPage(){
  const container = $('#cartItems');
  const totalEl = $('#cartTotal');
  const thank = $('#thank');
  if(!container) return;
  const cart = getCart();
  container.innerHTML = '';
  if(cart.length === 0){
    container.innerHTML = '<p>Troli anda kosong.</p>';
    totalEl && (totalEl.textContent = 'Jumlah: RM0.00');
    return;
  }
  let total = 0;
  cart.forEach((item, idx) => {
    const div = document.createElement('div');
    div.className = 'cart-item';
    div.innerHTML = `<div>${item.name}</div><div>RM${Number(item.price).toFixed(2)}</div>`;
    container.appendChild(div);
    total += Number(item.price);
  });
  totalEl && (totalEl.textContent = `Jumlah: RM${total.toFixed(2)}`);

  // Pay buttons
  const waBtn = $('#whatsappPay'); const opBtn = $('#onlinePay');
  if(waBtn) waBtn.onclick = () => {
    // build message
    const lines = cart.map(i => `${i.name} - RM${Number(i.price).toFixed(2)}`);
    const totalTxt = `Jumlah: RM${total.toFixed(2)}`;
    const msg = encodeURIComponent(`Hai, saya ingin buat tempahan:\n\n${lines.join('\n')}\n\n${totalTxt}`);
    clearCartWithAnimation(() => {
      window.open(`https://wa.me/601123580478?text=${msg}`, '_blank');
    });
  };
  if(opBtn) opBtn.onclick = () => {
    clearCartWithAnimation(() => {
      window.location.href = 'payment.html';
    });
  };

  if(thank) thank.setAttribute('aria-hidden','true');
}

function clearCartWithAnimation(cb){
  // add fade class
  $all('.cart-item').forEach(it => it.style.opacity = '0.2');
  setTimeout(() => {
    localStorage.removeItem('cartItems');
    renderCartPage();
    const thank = $('#thank');
    if(thank){ thank.classList.add('visible'); thank.setAttribute('aria-hidden','false') }
    if(typeof cb === 'function') cb();
  }, 600);
}

/* Run render on cart page */
if(location.pathname.includes('cart.html')) renderCartPage();

/* ====== PAYMENT PAGE LOGIC ====== */
$all('.pay-method').forEach(btn => {
  btn.addEventListener('click', () => {
    const method = btn.dataset.method;
    const confirmDiv = $('#payConfirm');
    if(confirmDiv) confirmDiv.innerHTML = `
      <p>Kamu pilih: <strong>${method}</strong></p>
      <p>Sila buat pemindahan ke akaun (contoh / simulasi) atau hantar bukti melalui WhatsApp.</p>
      <button id="confirmPay" class="btn">Sahkan Pembayaran</button>
    `;
    const cbtn = $('#confirmPay');
    // delegate: wait a tick because element created
    setTimeout(() => {
      const confirmBtn = $('#confirmPay');
      if(confirmBtn) confirmBtn.onclick = () => {
        alert('Pembayaran disahkan (simulasi). Terima kasih!');
        // clear cart
        localStorage.removeItem('cartItems');
        window.location.href = 'index.html';
      };
    }, 100);
  });
});

const waContact = $('#payViaWhats');
if(waContact) waContact.addEventListener('click', () => {
  window.open('https://wa.me/601123580478', '_blank');
});

/* ====== CONTACT FORM ====== */
const contactForm = $('#contactForm');
if(contactForm){
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#cname').value.trim();
    alert(`Terima kasih ${name}! Mesej anda telah dihantar.`);
    contactForm.reset();
  });
}

/* ====== AUTH (SIGNUP / LOGIN) ====== */
function getUsers(){ return JSON.parse(localStorage.getItem('users')) || [] }
function saveUsers(u){ localStorage.setItem('users', JSON.stringify(u)) }

const signupForm = $('#signupForm');
if(signupForm){
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = $('#signupName').value.trim();
    const username = $('#signupUser').value.trim();
    const pass = $('#signupPass').value.trim();
    if(!name||!username||!pass){ alert('Sila lengkapkan semua maklumat'); return; }
    const users = getUsers();
    if(users.find(x => x.username === username)){ alert('Username sudah digunakan'); return; }
    users.push({ name, username, password: pass });
    saveUsers(users);
    alert('Pendaftaran berjaya! Sila login.');
    window.location.href = 'login.html';
  });
}

const loginForm = $('#loginForm');
if(loginForm){
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = $('#loginUser').value.trim();
    const pass = $('#loginPass').value.trim();
    const users = getUsers();
    // admin account (ikan/abcd123) special
    if(username === 'ikan' && pass === 'abcd123'){
      alert('Selamat datang Admin!');
      window.location.href = 'payment.html';
      return;
    }
    const u = users.find(x => x.username === username && x.password === pass);
    if(u){ localStorage.setItem('loggedInUser', username); alert(`Selamat datang, ${u.name}`); window.location.href = 'index.html' }
    else { alert('Username atau password salah') }
  });
}

/* ====== QUICK HOOK -> addToCart global for inline calls (index preview) ====== */
window.addToCart = addToCart;

/* ====== Render menu add-cart handlers already set above (for dynamic) ====== */
/* nothing more */

/* ====== Run small init for payment confirm buttons present on page load ====== */
document.addEventListener('DOMContentLoaded', () => {
  // if on payment page and payConfirm exists we already wired pay-method buttons above
});
/* ===== DEBUG TEST ===== */
$all('.add-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const cart = JSON.parse(localStorage.getItem('cartItems')) || [];
    console.log('📦 Cart sekarang:', cart);
    alert(`✅ ${cart.length} item dalam troli sekarang!`);
  });
});

