(function () {
  function copyText(text) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      return navigator.clipboard.writeText(text);
    }
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      ok ? resolve() : reject();
    });
  }

  function flash(btn, msg) {
    var old = btn.getAttribute('data-label') || btn.textContent;
    btn.setAttribute('data-label', old);
    btn.textContent = msg;
    btn.setAttribute('aria-live', 'polite');
    clearTimeout(btn._t);
    btn._t = setTimeout(function () { btn.textContent = old; }, 2200);
  }

  var buttons = document.querySelectorAll('[data-share]');
  Array.prototype.forEach.call(buttons, function (btn) {
    btn.addEventListener('click', function () {
      var url = location.href.split('#')[0];
      if (navigator.share) {
        navigator.share({ title: document.title, text: '幫你盯價格的「降價了沒」', url: url }).catch(function () {});
        return;
      }
      copyText(url).then(function () { flash(btn, '已複製'); }, function () { flash(btn, '請自行複製網址'); });
    });
  });
})();
