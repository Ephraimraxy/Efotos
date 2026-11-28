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
