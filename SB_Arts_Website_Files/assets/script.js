
const menuBtn = document.querySelector('.menu-btn');
const navLinks = document.querySelector('.nav-links');
if (menuBtn && navLinks) {
  menuBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
}

const slides = [...document.querySelectorAll('.hero-slide')];
const dots = [...document.querySelectorAll('.hero-dot')];
let current = 0;
function showSlide(index){
  if(!slides.length) return;
  current = (index + slides.length) % slides.length;
  slides.forEach((slide,i)=>slide.classList.toggle('active',i===current));
  dots.forEach((dot,i)=>dot.classList.toggle('active',i===current));
}
dots.forEach((dot,i)=>dot.addEventListener('click',()=>showSlide(i)));
if(slides.length){
  showSlide(0);
  setInterval(()=>showSlide(current+1),8000);
}

document.querySelectorAll('form[data-demo]').forEach(form=>{
  form.addEventListener('submit',e=>{
    e.preventDefault();
    const msg=form.querySelector('.form-note');
    if(msg) msg.textContent='Thank you. This preview form is ready to connect to your preferred form service.';
    form.reset();
  });
});
