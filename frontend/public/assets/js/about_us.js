/* Auto slider for About Us page */
(function(){
    const slider = document.querySelector('.about_slider');
    if(!slider) return;

    const track = slider.querySelector('.carousel_track');
    const slides = Array.from(track.querySelectorAll('.carousel_slide'));
    const left = slider.querySelector('.carousel_btn.left');
    const right = slider.querySelector('.carousel_btn.right');
    let cur = 0;
    const count = slides.length || 1;

    function update(){
        track.style.transform = `translateX(-${cur * 100}%)`;
    }

    function show(index){
        cur = (index + count) % count;
        update();
    }

    left && left.addEventListener('click', ()=> show(cur - 1));
    right && right.addEventListener('click', ()=> show(cur + 1));

    // Auto-advance
    let autoId = setInterval(()=> show(cur + 1), 4000);
    function restartAuto(){ clearInterval(autoId); autoId = setInterval(()=> show(cur + 1), 4000); }

    slider.addEventListener('mouseenter', ()=> clearInterval(autoId));
    slider.addEventListener('mouseleave', restartAuto);

    // Touch support
    let startX = 0, deltaX = 0, isDragging = false;
    slider.addEventListener('touchstart', (e)=>{
        startX = e.touches[0].clientX; deltaX = 0; isDragging = true; track.style.transition = 'none';
    }, {passive:true});
    slider.addEventListener('touchmove', (e)=>{
        if(!isDragging) return;
        deltaX = e.touches[0].clientX - startX;
        track.style.transform = `translateX(calc(-${cur * 100}% + ${deltaX}px))`;
    }, {passive:true});
    slider.addEventListener('touchend', ()=>{
        isDragging = false; track.style.transition = 'transform 420ms cubic-bezier(.22,.9,.3,1)';
        if(Math.abs(deltaX) > 50){ deltaX < 0 ? show(cur + 1) : show(cur - 1); }
        else update();
    });

    // initial
    update();
})();
