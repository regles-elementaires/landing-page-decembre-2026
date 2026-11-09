/* Anime le graphique une fois, quand il apparaît à l'écran. */
(function(){
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var fmt = function(n){ return n.toLocaleString('fr-FR') + ' €'; };

    function countUp(el, delayMs){
    var target = +el.dataset.count, dur = 700;
    el.textContent = fmt(0);
    setTimeout(function(){
        var t0 = performance.now();
        (function tick(now){
        var p = Math.min((now - t0) / dur, 1), e = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(target * e));
        if (p < 1) requestAnimationFrame(tick);
        })(t0);
    }, delayMs);
    }

    function play(chart){
    chart.classList.remove('is-visible'); void chart.offsetWidth; // permet de rejouer
    chart.classList.add('is-visible');
    var stagger = parseFloat(getComputedStyle(chart).getPropertyValue('--stagger')) * 1000 || 180;
    chart.querySelectorAll('[data-count]').forEach(function(el, i){
        countUp(el, i * stagger + 1220);
    });
    }

    document.querySelectorAll('[data-don-chart]').forEach(function(chart){
    if (reduce || !('IntersectionObserver' in window)) return; // affichage statique
    chart.classList.add('js-anim');
    chart.replay = function(){ play(chart); };
    var io = new IntersectionObserver(function(entries){
        if (entries[0].isIntersecting){ play(chart); io.disconnect(); }
    }, { threshold: 0.4 });
    io.observe(chart);
    });
})();