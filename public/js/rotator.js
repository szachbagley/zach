document.addEventListener('DOMContentLoaded', function () {
    var rotator = document.getElementById('word-rotator');
    if (!rotator) return;

    var terms = Array.prototype.slice.call(rotator.querySelectorAll('.rotator-term'));
    if (terms.length < 2) return;

    var index = 0;
    var INTERVAL = 2500;
    var TRANSITION = 500;

    function fitTo(term) {
        rotator.style.width = term.offsetWidth + 'px';
    }

    fitTo(terms[0]);
    window.addEventListener('resize', function () {
        fitTo(terms[index]);
    });

    setInterval(function () {
        var current = terms[index];
        index = (index + 1) % terms.length;
        var next = terms[index];

        current.classList.remove('is-active');
        current.classList.add('is-exiting');
        next.classList.add('is-active');
        fitTo(next);

        setTimeout(function () {
            current.classList.remove('is-exiting');
        }, TRANSITION);
    }, INTERVAL);
});
