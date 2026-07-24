(function(){
  "use strict";
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- year ---- */
  var yr = document.getElementById('yr'); if(yr) yr.textContent = new Date().getFullYear();

  /* ---- mobile menu (keyboard: Escape closes + returns focus) ---- */
  var mb = document.querySelector('.menu-btn'), links = document.getElementById('navlinks');
  if(mb && links){
    mb.addEventListener('click', function(){
      var open = links.classList.toggle('open');
      mb.setAttribute('aria-expanded', open ? 'true' : 'false');
      mb.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    });
    links.addEventListener('click', function(e){
      if(e.target.tagName === 'A'){ links.classList.remove('open'); mb.setAttribute('aria-expanded','false'); }
    });
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && links.classList.contains('open')){
        links.classList.remove('open'); mb.setAttribute('aria-expanded','false'); mb.focus();
      }
    });
  }

  /* ---- count-up (verifiable figures only) ---- */
  function countUp(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if(reduce || isNaN(target)){ return; }
    var start = null, dur = 1100;
    var from = target > 100 ? Math.max(0, target - 120) : 0;
    function frame(ts){
      if(start === null) start = ts;
      var p = Math.min(1, (ts - start) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = Math.round(from + (target - from) * eased);
      el.textContent = val + suffix;
      if(p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }
  var counters = [].slice.call(document.querySelectorAll('[data-count]'));
  if('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if(en.isIntersecting){ countUp(en.target); io.unobserve(en.target); }
      });
    }, {threshold:0.5});
    counters.forEach(function(c){ io.observe(c); });
  }

  /* ---- material selector (WAI-ARIA radiogroup) — carries into the RFQ ---- */
  var MAT = {
    al: { name:'Aluminum', grade:'6061-T6 · 7075', rating:5, rlabel:'Excellent',
          proc:['5-axis mill','Turning','Rapid proto'], tol:'to ±0.0005 in (0.013 mm)',
          fin:['Anodize II/III','Bead blast','Powder coat'], ind:'Aerospace · automotive · general',
          note:'Free-cutting and light. Fast chip clearance and clean finishes make it the go-to for housings, brackets and quick-turn prototypes.',
          fidx:0, ftol:'±0.0005 in' },
    ti: { name:'Titanium', grade:'Ti-6Al-4V (Grade 5)', rating:2, rlabel:'Challenging',
          proc:['5-axis mill','Wire EDM','Turning'], tol:'to ±0.0005 in (0.013 mm)',
          fin:['Anodize (color)','Bead blast'], ind:'Aerospace · defense · medical',
          note:'Low thermal conductivity and work-hardening demand rigid setups, sharp tooling and steady coolant. Rewards a shop that respects it — high strength-to-weight, biocompatible.',
          fidx:1, ftol:'±0.0005 in' },
    ss: { name:'Stainless Steel', grade:'303 · 316 · 17-4 PH', rating:3, rlabel:'Moderate',
          proc:['Milling','Turning','Wire & sinker EDM'], tol:'to ±0.0005 in (0.013 mm)',
          fin:['Bead blast','Passivate','Electropolish'], ind:'Automotive · marine · defense',
          note:'Corrosion-resistant and tough; grades like 303 machine freely while 316 and 17-4 work-harden. EDM handles the hardened and the intricate.',
          fidx:2, ftol:'±0.0005 in' },
    pl: { name:'Engineering Plastics', grade:'PEEK · POM (Delrin) · PTFE · Nylon', rating:4, rlabel:'Good',
          proc:['Milling','Turning','Rapid proto'], tol:'typ. ±0.001 in (0.025 mm)',
          fin:['As-machined','Light bead blast'], ind:'Insulators · seals · low-friction parts',
          note:'Lightweight, chemical-resistant and non-conductive. Watch thermal expansion and deflection — plastics move more with temperature than metal, so tolerance bands run a touch wider.',
          fidx:3, ftol:'±0.001 in' }
  };
  var group = document.getElementById('matgroup');
  if(group){
    var opts = [].slice.call(group.querySelectorAll('[role="radio"]'));
    var elMat = document.getElementById('ro-mat'), elGrade = document.getElementById('ro-grade'),
        elMeter = document.getElementById('ro-meter'), elProc = document.getElementById('ro-proc'),
        elTol = document.getElementById('ro-tol'), elFin = document.getElementById('ro-fin'),
        elInd = document.getElementById('ro-ind'), elNote = document.getElementById('ro-note'),
        elCarry = document.getElementById('ro-carry');
    /* RFQ targets the selection carries into */
    var fMat = document.getElementById('f-material'), fTol = document.getElementById('f-tol'),
        fCarried = document.getElementById('carried_spec'),
        fieldMat = document.getElementById('field-material'), fieldTol = document.getElementById('field-tol');

    function chips(arr, hotFirst){
      return arr.map(function(t,i){
        return '<span class="chip'+((hotFirst && i===0)?' hot':'')+'">'+t+'</span>';
      }).join('');
    }
    function meter(n){
      var s = '';
      for(var i=0;i<5;i++){ s += '<i class="'+(i<n?'on':'')+'"></i>'; }
      return s;
    }
    var carryTimer = null;
    function carry(m){
      if(fMat) fMat.selectedIndex = m.fidx;
      if(fTol) fTol.value = m.ftol;
      if(fCarried) fCarried.value = m.name + ' · ' + m.tol.replace(/^to\s/,'').replace(/^typ\.\s/,'');
      if(elCarry) elCarry.textContent = m.name + ' · ' + m.ftol;
      /* brief visual confirmation on the pre-filled fields */
      if(fieldMat && fieldTol){
        fieldMat.classList.add('carried'); fieldTol.classList.add('carried');
        if(carryTimer) clearTimeout(carryTimer);
        carryTimer = setTimeout(function(){
          fieldMat.classList.remove('carried'); fieldTol.classList.remove('carried');
        }, 1400);
      }
    }
    function render(key, doCarry){
      var m = MAT[key]; if(!m) return;
      elMat.textContent = m.name;
      elGrade.textContent = m.grade;
      elMeter.innerHTML = meter(m.rating) + '<span class="mlab">'+m.rlabel+'</span>';
      elProc.innerHTML = chips(m.proc, true);
      elTol.innerHTML = '<b>'+m.tol+'</b>';
      elFin.innerHTML = chips(m.fin, false);
      elInd.textContent = m.ind;
      elNote.textContent = m.note;
      carry(m, doCarry);
    }
    function select(opt, focus, animate){
      opts.forEach(function(o){
        var on = o === opt;
        o.setAttribute('aria-checked', on ? 'true' : 'false');
        o.tabIndex = on ? 0 : -1;
      });
      if(focus) opt.focus();
      render(opt.getAttribute('data-mat'), animate);
    }
    opts.forEach(function(opt, idx){
      opt.addEventListener('click', function(){ select(opt, false, true); });
      opt.addEventListener('keydown', function(e){
        var i = idx, n = opts.length;
        if(e.key === 'ArrowRight' || e.key === 'ArrowDown'){ e.preventDefault(); select(opts[(i+1)%n], true, true); }
        else if(e.key === 'ArrowLeft' || e.key === 'ArrowUp'){ e.preventDefault(); select(opts[(i-1+n)%n], true, true); }
        else if(e.key === 'Home'){ e.preventDefault(); select(opts[0], true, true); }
        else if(e.key === 'End'){ e.preventDefault(); select(opts[n-1], true, true); }
        else if(e.key === ' ' || e.key === 'Enter'){ e.preventDefault(); select(opt, false, true); }
      });
    });
    /* initial render — populate readout + carried spec without the flash animation */
    render('al', false);
  }

  /* ---- shop-floor video (poster-first, controllable, aria-pressed) ---- */
  var vid = document.getElementById('floorvid'), vbtn = document.getElementById('vidbtn'),
      vicon = document.getElementById('vidicon');
  if(vid && vbtn){
    var PLAY = 'M8 5v14l11-7z', PAUSE = 'M7 5h4v14H7zM13 5h4v14h-4z';
    vbtn.addEventListener('click', function(){
      if(vid.paused){
        var p = vid.play();
        if(p && p.catch){ p.catch(function(){}); }
        vicon.setAttribute('d', PAUSE);
        vbtn.setAttribute('aria-pressed','true');
        vbtn.setAttribute('aria-label','Pause shop-floor footage');
        vbtn.querySelector('.disc').style.background = 'rgba(12,11,9,.28)';
      } else {
        vid.pause();
        vicon.setAttribute('d', PLAY);
        vbtn.setAttribute('aria-pressed','false');
        vbtn.setAttribute('aria-label','Play shop-floor footage');
        vbtn.querySelector('.disc').style.background = '';
      }
    });
    vid.addEventListener('ended', function(){
      vicon.setAttribute('d', PLAY); vbtn.setAttribute('aria-pressed','false');
    });
  }

  /* ---- hero SVG motion (skip entirely if reduced) ---- */
  if(!reduce){
    var css = document.createElement('style');
    css.textContent =
      '[data-spin]{animation:spin 1.15s linear infinite}' +
      '@keyframes spin{to{transform:rotate(360deg)}}' +
      '[data-bob]{animation:bob 3.2s ease-in-out infinite}' +
      '@keyframes bob{0%,100%{transform:translateY(0)}50%{transform:translateY(6px)}}' +
      '.sw1{animation:sw 2.6s ease-out infinite}.sw2{animation:sw 2.6s ease-out .5s infinite}.sw3{animation:sw 2.6s ease-out 1s infinite}' +
      '@keyframes sw{0%{opacity:0;transform:translate(0,0)}12%{opacity:.9}100%{opacity:0;transform:translate(-16px,-24px)}}' +
      '[data-draw]{animation:draw 2.4s ease-out forwards}' +
      '@keyframes draw{to{stroke-dashoffset:0}}';
    document.head.appendChild(css);
  }
})();
