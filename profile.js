 
  /* ---------------------------
     Small utilities & initialization
     --------------------------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  // THEME SWITCH: cycles through dark (default), light, cyber
  const themeToggle = document.getElementById('themeToggle');
  const themes = ['','theme-light','theme-cyber'];
  let tIndex = 0;
  themeToggle.addEventListener('click', ()=>{
    tIndex = (tIndex+1) % themes.length;
    document.body.className = themes[tIndex];
    themeToggle.textContent = ['Dark','Light','Cyber'][tIndex];
  });

  // Resume download (demo text file)
  document.getElementById('downloadResume').addEventListener('click', (e)=>{
    e.preventDefault();
    const content = `Resume - Your Name\nRole: 3D Developer\nReplace with real resume.`;
    const blob = new Blob([content], {type:'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href=url; a.download='Resume-YourName.txt'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  });

  /* ---------------------------
     3D card tilt
     --------------------------- */
  (function(){
    const card = document.getElementById('card3d');
    if(!card) return;
    const inner = card.querySelector('.card-inner');
    function onMove(e){
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX || e.touches[0].clientX) - rect.left) / rect.width;
      const y = ((e.clientY || e.touches[0].clientY) - rect.top) / rect.height;
      const rx = (y - 0.5) * 14; // rotateX
      const ry = (x - 0.5) * -20; // rotateY
      inner.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      inner.style.boxShadow = `${(x-0.5)*-40}px ${(y-0.5)*40}px 60px rgba(18,10,40,0.45)`;
    }
    function reset(){ inner.style.transform = ''; inner.style.boxShadow = ''; }
    card.addEventListener('mousemove', onMove);
    card.addEventListener('mouseleave', reset);
    card.addEventListener('touchmove', (ev)=> onMove(ev.touches[0]), {passive:true});
  })();

  /* ---------------------------
     Parallax background subtle
     --------------------------- */
  (function(){
    const bg1 = document.getElementById('bg1'), bg2 = document.getElementById('bg2');
    window.addEventListener('mousemove', (e)=>{
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      bg1.style.transform = `translate(${cx*8}px, ${cy*8}px)`;
      bg2.style.transform = `translate(${cx*-6}px, ${cy*-6}px)`;
    });
  })();

  /* ---------------------------
     Particle canvas (background)
     --------------------------- */
  (function(){
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');
    function resize(){ canvas.width = innerWidth; canvas.height = innerHeight; }
    window.addEventListener('resize', resize); resize();

    const particles = [];
    function make(n=90){
      for(let i=0;i<n;i++){
        particles.push({
          x: Math.random()*canvas.width,
          y: Math.random()*canvas.height,
          r: Math.random()*2+0.6,
          vx: (Math.random()-0.5)*0.3,
          vy: (Math.random()-0.5)*0.3,
          alpha: 0.6 + Math.random()*0.4
        });
      }
    }
    make(110);

    function draw(){
      ctx.clearRect(0,0,canvas.width,canvas.height);
      particles.forEach(p=>{
        p.x += p.vx; p.y += p.vy;
        if(p.x<0||p.x>canvas.width) p.vx *= -1;
        if(p.y<0||p.y>canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
        ctx.shadowBlur = 8; ctx.shadowColor = 'rgba(255,255,255,0.6)';
        ctx.arc(p.x,p.y,p.r,0,Math.PI*2); ctx.fill();
      });
      requestAnimationFrame(draw);
    }
    draw();
  })();

  /* ---------------------------
     ORIGINAL SKILLS: animate meters when section visible
     --------------------------- */
  (function(){
    const skillsSection = document.getElementById('skills');
    if(!skillsSection) return;
    const meters = skillsSection.querySelectorAll('.meter > div');

    const obs = new IntersectionObserver((entries, o)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          meters.forEach(m=>{
            const parent = m.parentElement;
            const target = parseInt(parent.getAttribute('data-fill') || parent.dataset.fill || 80);
            m.style.width = target + '%';
          });
          o.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    obs.observe(skillsSection);

    // pill hover micro interaction
    document.querySelectorAll('.pill').forEach(p=>{
      p.addEventListener('mouseenter', ()=> p.style.transform='translateY(-6px)');
      p.addEventListener('mouseleave', ()=> p.style.transform='translateY(0)');
    });
  })();

  /* ---------------------------
     Animated Floating Skill Cards: animate bars when visible
     --------------------------- */
  (function(){
    const container = document.getElementById('animatedSkills');
    if(!container) return;
    const cards = Array.from(container.querySelectorAll('.skill-card'));
    // stagger appear
    cards.forEach((card,i)=>{
      card.style.opacity = 0;
      card.style.transform = `translateY(20px)`;
      setTimeout(()=>{ card.style.transition = 'transform .8s cubic-bezier(.2,.9,.3,1), opacity .8s'; card.style.opacity=1; card.style.transform='translateY(0)'; }, 200 + i*140);
    });

    // when card area visible, fill bars
    const obs = new IntersectionObserver((entries, o)=>{
      entries.forEach(entry=>{
        if(entry.isIntersecting){
          const bars = container.querySelectorAll('.bar');
          bars.forEach((bar, i)=>{
            const level = cards[i].getAttribute('data-level') || cards[i%cards.length].dataset.level || 75;
            setTimeout(()=>{ bar.style.width = level + '%'; }, i*140);
          });
          o.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    obs.observe(container);
  })();

  /* ---------------------------
     Animated skill-card hover tilt + neon pulse
     --------------------------- */
  (function(){
    document.querySelectorAll('.skill-card').forEach(card=>{
      card.addEventListener('mousemove', (e)=>{
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left)/r.width;
        const y = (e.clientY - r.top)/r.height;
        const rx = (y - 0.5) * 8;
        const ry = (x - 0.5) * -14;
        card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
        card.style.boxShadow = '0 30px 60px rgba(0,0,0,0.5)';
      });
      card.addEventListener('mouseleave', ()=>{ card.style.transform=''; card.style.boxShadow=''; });
      card.addEventListener('click', ()=> {
        // small click feedback
        card.animate([{transform:'scale(1)'},{transform:'scale(0.98)'},{transform:'scale(1)'}], {duration:260});
      });
    });
  })();

  /* ---------------------------
     Contact form mock
     --------------------------- */
  (function(){
    const form = document.getElementById('contactForm'), status = document.getElementById('formStatus');
    form.addEventListener('submit', (ev)=> {
      ev.preventDefault();
      status.textContent = 'Sending...';
      setTimeout(()=>{ status.textContent = 'Message sent! (Demo)'; form.reset(); setTimeout(()=>status.textContent='',3000); }, 1100);
    });
  })();



