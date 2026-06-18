  // Year
  document.getElementById('yr').textContent = new Date().getFullYear();

  // Nav scroll state
  var nav = document.getElementById('nav');
  window.addEventListener('scroll', function(){
    nav.classList.toggle('scrolled', window.scrollY > 12);
  }, {passive:true});

  // Mobile menu
  var toggle = document.getElementById('navToggle');
  toggle.addEventListener('click', function(){
    var open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', open);
  });
  document.querySelectorAll('.nav-links a, .nav-cta').forEach(function(a){
    a.addEventListener('click', function(){ nav.classList.remove('open'); toggle.setAttribute('aria-expanded','false'); });
  });

  // Pinned hero — depth parallax: planes move at different speeds as you scroll
  (function(){
    var track = document.getElementById('top');
    if (!track) return;
    var bg    = document.getElementById('heroBg'),
        glow  = document.getElementById('heroGlow'),
        scrim = document.getElementById('heroScrim'),
        frame = document.getElementById('heroFrame'),
        copy  = document.getElementById('heroCopy'),
        trust = document.getElementById('heroTrust'),
        hint  = document.getElementById('heroHint');
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var clamp = function(v){ return v < 0 ? 0 : v > 1 ? 1 : v; };

    if (reduce) return;

    var ticking = false, lastP = -1;
    function apply(p){
      bg.style.transform    = 'scale(' + (1 + p * 0.12) + ') translateY(' + (p * -6) + '%)';
      glow.style.transform  = 'translateY(' + (p * 16) + '%) translateX(' + (p * -3) + '%)';
      frame.style.transform = 'translateY(' + (p * -34) + 'px)';
      var f = clamp((p - 0.42) / 0.40);
      copy.style.transform  = 'translateY(' + (p * -120) + 'px)';
      copy.style.opacity    = (1 - f).toFixed(3);
      copy.style.pointerEvents = f > 0.8 ? 'none' : 'auto';
      scrim.style.opacity   = (clamp(p * 1.2) * 0.5).toFixed(3);
      var tf = clamp((p - 0.78) / 0.22);
      trust.style.opacity   = tf.toFixed(3);
      trust.style.transform = 'translateY(' + ((1 - tf) * 100) + '%)';
      if (hint) hint.style.opacity = clamp(1 - p / 0.07).toFixed(3);
    }
    function compute(){
      var total = track.offsetHeight - window.innerHeight;
      var scrolled = Math.min(Math.max(-track.getBoundingClientRect().top, 0), total);
      var p = total > 0 ? scrolled / total : 0;
      if (p !== lastP){ apply(p); lastP = p; }
      ticking = false;
    }
    function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(compute); } }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    apply(0); compute();
  })();

  // Then & Now — pinned crossfade: the image morphs in place while the stage holds
  (function(){
    var track = document.getElementById('thennow');
    if (!track) return;
    var nw  = document.getElementById('tnNew'),
        old = document.getElementById('tnOld'),
        dot = document.getElementById('tnDot'),
        yOld = document.getElementById('tnYearOld'),
        yNew = document.getElementById('tnYearNew');
    var clamp = function(v){ return v < 0 ? 0 : v > 1 ? 1 : v; };
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      if (nw) nw.style.opacity = 1; if (dot) dot.style.left = '100%';
      if (yOld) yOld.style.opacity = .4; if (yNew) yNew.style.opacity = 1;
      return;
    }
    var ticking = false, lastP = -1;
    function apply(p){
      var f = clamp((p - 0.12) / 0.56);          // crossfade, then hold "today"
      nw.style.opacity = f.toFixed(3);
      old.style.transform = 'scale(' + (1.04 + p*0.05) + ')';
      nw.style.transform  = 'scale(' + (1.08 + p*0.05) + ')';
      if (dot) dot.style.left = (f*100) + '%';
      if (yOld) yOld.style.opacity = (1 - f*0.6).toFixed(2);
      if (yNew) yNew.style.opacity = (0.4 + f*0.6).toFixed(2);
    }
    function compute(){
      var total = track.offsetHeight - window.innerHeight;
      var scrolled = Math.min(Math.max(-track.getBoundingClientRect().top, 0), total);
      var p = total > 0 ? scrolled / total : 0;
      if (p !== lastP){ apply(p); lastP = p; }
      ticking = false;
    }
    function onScroll(){ if (!ticking){ ticking = true; requestAnimationFrame(compute); } }
    window.addEventListener('scroll', onScroll, {passive:true});
    window.addEventListener('resize', onScroll);
    apply(0); compute();
  })();

  // Image frames: drop the placeholder label only when the real image loads
  document.querySelectorAll('.frame img').forEach(function(img){
    function ok(){ img.closest('.frame').classList.add('has-img'); }
    if (img.complete && img.naturalWidth > 0) ok();
    img.addEventListener('load', ok);
    img.addEventListener('error', function(){ img.style.display='none'; });
  });

  // Scroll reveal
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    document.querySelectorAll('.reveal').forEach(function(el){ io.observe(el); });
  } else {
    document.querySelectorAll('.reveal').forEach(function(el){ el.classList.add('in'); });
  }
