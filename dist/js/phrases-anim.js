(function () {
// ---- Les phrases (modifiez / ajoutez librement) ----
const PHRASES = [
    "d'avoir accès à des protections périodiques.",
    "de savoir ce qu'elles contiennent.",
    "de comprendre mon corps.",
    "d'être écouté·e et soigné·e correctement.",
    "de parler de mes règles librement."
];
const PAUSE = 2200; // temps d'affichage de chaque phrase (ms)

const box    = document.querySelector('.droit__box');
const cube   = document.querySelector('.droit__cube');
const front  = document.querySelector('.droit__face--front');
const bottom = document.querySelector('.droit__face--bottom');
const ruler  = document.querySelector('.droit__ruler');

let index = 0;
let timer = null;
let visible = true;

const title = document.querySelector('.droit');
const fixed = document.querySelector('.droit__fixed');

function widthOf(text) {
    ruler.textContent = text;
    return Math.ceil(ruler.getBoundingClientRect().width);
}

function setWidth(text) {
    box.style.width = widthOf(text) + 'px';
}

// Choisit la mise en page : une ligne si tout tient,
// sinon deux lignes, et réduit la police si la plus longue
// phrase dépasse encore la largeur disponible.
function layout() {
    title.style.fontSize = '';
    title.classList.remove('is-stacked');
    const available = title.clientWidth;
    const longest = Math.max.apply(null, PHRASES.map(widthOf));
    const gap = parseFloat(getComputedStyle(title).columnGap) || 0;
    const fixedW = fixed.getBoundingClientRect().width;

    if (fixedW + gap + longest > available) {
    title.classList.add('is-stacked');
    }
    setWidth(PHRASES[index]);
}

function rotate() {
    const next = (index + 1) % PHRASES.length;
    bottom.textContent = PHRASES[next];
    setWidth(PHRASES[next]);
    cube.classList.add('is-rotating');
}

// fin de rotation : la phrase suivante devient la face avant,
// puis on remet le cube à zéro sans animation
cube.addEventListener('transitionend', function (e) {
    if (e.target !== cube || e.propertyName !== 'transform') return;
    finishRotation();
});

function finishRotation() {
    if (!cube.classList.contains('is-rotating')) return;
    index = (index + 1) % PHRASES.length;
    front.textContent = PHRASES[index];
    cube.classList.add('no-anim');
    cube.classList.remove('is-rotating');
    void cube.offsetWidth;            // force le reflow
    cube.classList.remove('no-anim');
    schedule();
}

function schedule() {
    clearTimeout(timer);
    if (!visible || document.hidden) return;
    timer = setTimeout(function () {
    rotate();
    // filet de sécurité si transitionend ne se déclenche pas
    // (ex. prefers-reduced-motion sans transition de transform)
    setTimeout(finishRotation, 900);
    }, PAUSE);
}

function init() {
    front.textContent = PHRASES[0];
    box.style.transition = 'none';
    layout();
    void box.offsetWidth;
    box.style.transition = '';
    schedule();
}

// pause quand la section n'est pas à l'écran ou l'onglet masqué
if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
    visible = entries[0].isIntersecting;
    if (visible) schedule(); else clearTimeout(timer);
    }).observe(box);
}
document.addEventListener('visibilitychange', schedule);

let resizeTimer;
window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 120);
});

// attendre la police avant de mesurer les largeurs
(document.fonts ? document.fonts.ready : Promise.resolve()).then(init);
})();