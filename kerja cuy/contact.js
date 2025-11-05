document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();
  alert("✅ Terima kasih! Mesej anda telah dihantar. Kami akan hubungi anda secepat mungkin.");
  this.reset();
});
