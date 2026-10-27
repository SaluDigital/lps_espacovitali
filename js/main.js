/* =========================================================
   ESPAÇO VITALI — Landing Liberação Miofascial
   Índice: 1 WhatsApp · 2 Imagens ausentes · 3 Entrada ao rolar · 4 Parallax
           5 Botão flutuante · 7 Acordeão · 8 Carrossel · 9 Ano
   ========================================================= */
(function () {
  'use strict';

  var reduzMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. WHATSAPP (link único, editar apenas aqui) ---------- */
  var WHATSAPP_URL = 'https://wa.me/5519989484598?text=Ol%C3%A1%2C%20vim%20do%20Google%20e%20gostaria%20de%20saber%20mais%20sobre%20Libera%C3%A7%C3%A3o%20Miofascial';
  document.querySelectorAll('[data-whatsapp]').forEach(function (el) {
    el.setAttribute('href', WHATSAPP_URL);
    el.setAttribute('target', '_blank');
    el.setAttribute('rel', 'noopener noreferrer');
  });

  /* ---------- 2. IMAGENS AUSENTES: mantém o placeholder suave ---------- */
  document.querySelectorAll('img').forEach(function (img) {
    var falhou = function () { img.classList.add('is-missing'); };
    img.addEventListener('error', falhou);
    if (img.complete && img.naturalWidth === 0 && img.getAttribute('src')) { falhou(); }
  });

  /* ---------- 3. ENTRADA AO ROLAR ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduzMovimento) {
    var io = new IntersectionObserver(function (entradas) {
      entradas.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el, i) {
      el.style.transitionDelay = (i % 3) * 80 + 'ms';
      io.observe(el);
    });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  /* ---------- 4. PARALLAX LEVE NO HERO + 5. BOTÃO FLUTUANTE ---------- */
  var parallax = document.querySelector('[data-parallax]');
  var wpp = document.querySelector('.wpp');
  var ticking = false;

  function aoRolar() {
    var y = window.scrollY || window.pageYOffset;
    if (parallax && !reduzMovimento && y < window.innerHeight * 1.2) {
      parallax.style.transform = 'translate3d(0,' + (y * 0.12).toFixed(1) + 'px,0)';
    }
    if (wpp) { wpp.classList.toggle('is-on', y > 120); }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(aoRolar); }
  }, { passive: true });
  aoRolar();

  /* ---------- 7. ACORDEÃO (botões nativos: Enter/Espaço funcionam) ---------- */
  document.querySelectorAll('.acordeao button[aria-expanded]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var aberto = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!aberto));
      // Fallback para navegadores sem :has()
      var resp = document.getElementById(btn.getAttribute('aria-controls'));
      resp.style.gridTemplateRows = aberto ? '0fr' : '1fr';
    });
  });

  /* ---------- 8. CARROSSEL DE DEPOIMENTOS ---------- */
  var trilho = document.querySelector('.carrossel__trilho');
  if (trilho) {
    var slides = Array.prototype.slice.call(trilho.children);
    var pontosBox = document.querySelector('.pontos');
    var pontos = slides.map(function (_, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.setAttribute('aria-label', 'Ir para o depoimento ' + (i + 1));
      b.addEventListener('click', function () { irPara(i); });
      pontosBox.appendChild(b);
      return b;
    });

    var atual = 0;
    function marcar(i) {
      atual = i;
      pontos.forEach(function (p, j) { p.setAttribute('aria-current', j === i ? 'true' : 'false'); });
    }
    function irPara(i) {
      var n = (i + slides.length) % slides.length;
      trilho.scrollTo({ left: slides[n].offsetLeft - trilho.offsetLeft, behavior: reduzMovimento ? 'auto' : 'smooth' });
      marcar(n);
    }
    document.querySelectorAll('.carrossel .seta').forEach(function (seta) {
      seta.addEventListener('click', function () { irPara(atual + Number(seta.dataset.dir)); });
    });
    trilho.addEventListener('scroll', function () {
      var i = Math.round(trilho.scrollLeft / trilho.clientWidth);
      if (i !== atual && i >= 0 && i < slides.length) { marcar(i); }
    }, { passive: true });
    trilho.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowRight') { e.preventDefault(); irPara(atual + 1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); irPara(atual - 1); }
    });
    marcar(0);

    /* Rolagem automática: pausa com mouse, foco ou toque, quando fora da tela e com movimento reduzido */
    var INTERVALO = 6000;
    var carrossel = document.querySelector('.carrossel');
    var pausado = false, visivel = false, timer = null;
    function tocar() {
      clearInterval(timer);
      if (reduzMovimento || pausado || !visivel) { return; }
      timer = setInterval(function () { irPara(atual + 1); }, INTERVALO);
    }
    function pausar(v) { pausado = v; tocar(); }
    carrossel.addEventListener('mouseenter', function () { pausar(true); });
    carrossel.addEventListener('mouseleave', function () { pausar(false); });
    carrossel.addEventListener('focusin', function () { pausar(true); });
    carrossel.addEventListener('focusout', function () { pausar(false); });
    carrossel.addEventListener('touchstart', function () { pausar(true); }, { passive: true });
    carrossel.addEventListener('touchend', function () { setTimeout(function () { pausar(false); }, 8000); }, { passive: true });
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e) { visivel = e[0].isIntersecting; tocar(); }, { threshold: 0.4 }).observe(carrossel);
    }
    document.addEventListener('visibilitychange', function () { clearInterval(timer); if (!document.hidden) { tocar(); } });
  }

  /* ---------- 9. ANO DO RODAPÉ ---------- */
  var ano = document.getElementById('ano');
  if (ano) { ano.textContent = new Date().getFullYear(); }
})();
