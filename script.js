/* ----------------- script.js ----------------- */
/* Slider + controls + keyboard accessibility + smooth animations */
(function(){
  const slides = Array.from(document.querySelectorAll('.slide'));
  const dotsWrap = document.getElementById('dots');
  const prevBtn = document.getElementById('prev');
  const nextBtn = document.getElementById('next');
  const gallery = document.getElementById('gallery');
  const btnNextSlide = document.getElementById('btn-next-slide');
  const btnPrevSlide = document.getElementById('btn-prev-slide');

  let index = 0;
  let animating = false;

  function safeEl(el){ return el && el.addEventListener; }

  function renderDots(){
    if(!dotsWrap) return;
    dotsWrap.innerHTML = '';
    slides.forEach((s,i)=>{
      const dot = document.createElement('button');
      dot.className = 'dot' + (i===index? ' active':'');
      dot.setAttribute('aria-label', 'Go to slide ' + (i+1));
      dot.addEventListener('click', ()=> goTo(i));
      dotsWrap.appendChild(dot);
    });
  }

  function update(){
    if(animating) return;
    animating = true;

    slides.forEach((s,i)=>{
      const active = i === index;
      s.classList.toggle('active', active);
      s.setAttribute('aria-hidden', (!active).toString());
    });

    if(dotsWrap){
      Array.from(dotsWrap.children).forEach((d,i)=> d.classList.toggle('active', i===index));
    }

    // entrance animation (Web Animations API if available)
    const current = slides[index];
    if(current && current.animate){
      current.animate([
        {opacity:0, transform:'translateY(10px) scale(.995)'},
        {opacity:1, transform:'translateY(0) scale(1)'}
      ], {duration:420, easing:'cubic-bezier(.2,.9,.3,1)'}).onfinish = ()=> { animating = false; };
    } else {
      // fallback
      setTimeout(()=> animating = false, 460);
    }
  }

  function goTo(i){
    index = (i + slides.length) % slides.length;
    update();
  }

  // init
  if(slides.length){
    renderDots();
    update();

    if(safeEl(nextBtn)) nextBtn.addEventListener('click', ()=> goTo(index + 1));
    if(safeEl(prevBtn)) prevBtn.addEventListener('click', ()=> goTo(index - 1));
  }

  // hook hero buttons to slider (user requested)
  if(safeEl(btnNextSlide)) btnNextSlide.addEventListener('click', ()=> goTo(index + 1));
  if(safeEl(btnPrevSlide)) btnPrevSlide.addEventListener('click', ()=> goTo(index - 1));

  // keyboard accessibility
  document.addEventListener('keydown', (e)=>{
    if(!gallery) return;
    if(e.key === 'ArrowLeft' && safeEl(prevBtn)) prevBtn.click();
    if(e.key === 'ArrowRight' && safeEl(nextBtn)) nextBtn.click();
  });

  // OPTIONAL: autoplay (comment out by default)
  // let auto = setInterval(()=> goTo(index + 1), 6000);

})();
