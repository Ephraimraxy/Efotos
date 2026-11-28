/* tiny helpers for the admin panel (no inline scripts, so the strict Content-Security-Policy stays on) */
document.addEventListener('submit', function (e) {
  var m = e.target.getAttribute && e.target.getAttribute('data-confirm');
  if (m && !window.confirm(m)) e.preventDefault();
});
document.addEventListener('change', function (e) {
  var t = e.target;
  if (t.type === 'file' && t.closest('.slot') && t.files && t.files[0] && /^image\//.test(t.files[0].type)) {
    var img = t.closest('.slot').querySelector('img'); if (img) img.src = URL.createObjectURL(t.files[0]);
  }
});

/* password generator + table filter (external file: the strict CSP forbids inline scripts) */
document.addEventListener('click', function (e) {
  var b = e.target.closest && e.target.closest('[data-gen]'); if (!b) return;
  var inp = b.parentNode.querySelector('input[name=pw]') || b.previousElementSibling; if (!inp) return;
  var chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%*-_', a = new Uint32Array(16), out = '';
  (window.crypto || window.msCrypto).getRandomValues(a); for (var i = 0; i < a.length; i++) out += chars[a[i] % chars.length];
  inp.value = out; inp.type = 'text';
});
document.addEventListener('input', function (e) {
  var f = e.target.getAttribute && e.target.getAttribute('data-filter'); if (!f) return;
  var q = e.target.value.toLowerCase(); document.querySelectorAll(f + ' tbody tr').forEach(function (r) { r.style.display = r.textContent.toLowerCase().indexOf(q) > -1 ? '' : 'none'; });
});
