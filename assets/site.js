(() => {
  'use strict';

  const icons = () => window.lucide?.createIcons();
  icons();
  document.querySelectorAll('#year').forEach(el => { el.textContent = new Date().getFullYear(); });
  const time = document.querySelector('#mumbai-time');
  if (time) {
    const updateTime = () => { time.textContent = new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Kolkata', hour: '2-digit', minute: '2-digit', hour12: false }).format(new Date()) + ' IST'; };
    updateTime();
    setInterval(updateTime, 60000);
  }

  const root = document.documentElement;
  const themeButton = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name=theme-color]');
  const setTheme = dark => {
    root.dataset.theme = dark ? 'dark' : 'light';
    themeMeta?.setAttribute('content', dark ? '#0f141b' : '#f8f9fc');
    if (!themeButton) return;
    const label = dark ? 'Switch to light mode' : 'Switch to dark mode';
    themeButton.setAttribute('aria-pressed', String(dark));
    themeButton.setAttribute('aria-label', label);
    themeButton.title = label;
    themeButton.innerHTML = `<i data-lucide="${dark ? 'sun' : 'moon'}" aria-hidden="true"></i>`;
    icons();
  };
  setTheme(root.dataset.theme === 'dark');
  themeButton?.addEventListener('click', () => {
    const dark = root.dataset.theme !== 'dark';
    setTheme(dark);
    try { localStorage.setItem('theme', dark ? 'dark' : 'light'); } catch (_) { /* private mode */ }
  });

  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('#mobile-nav');
  const setMenu = open => {
    if (!menuButton || !mobileNav) return;
    mobileNav.hidden = !open;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    menuButton.title = open ? 'Close navigation' : 'Open navigation';
    menuButton.innerHTML = `<i data-lucide="${open ? 'x' : 'menu'}" aria-hidden="true"></i>`;
    icons();
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  mobileNav?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header') && menuButton?.getAttribute('aria-expanded') === 'true') setMenu(false);
  });
  matchMedia('(min-width: 621px)').addEventListener('change', event => { if (event.matches) setMenu(false); });

  if ('IntersectionObserver' in window) {
    const navLinks = [...document.querySelectorAll('.desktop-nav a')];
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) navLinks.forEach(link => {
          if (link.hash === '#' + entry.target.id) link.setAttribute('aria-current', 'location');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-15% 0px -65% 0px', threshold: 0 });
    document.querySelectorAll('main > section[id]').forEach(section => sectionObserver.observe(section));
  }

  let toastTimer;
  const notify = message => {
    const toast = document.querySelector('.toast');
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('visible');
    toastTimer = setTimeout(() => toast.classList.remove('visible'), 3000);
  };
  const copyText = async value => {
    if (navigator.clipboard && window.isSecureContext) {
      try { await navigator.clipboard.writeText(value); return; } catch (_) { /* File previews may deny clipboard permission. */ }
    }
    const field = document.createElement('textarea');
    field.value = value;
    field.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.append(field);
    field.select();
    const copied = document.execCommand('copy');
    field.remove();
    if (!copied) throw new Error('Clipboard unavailable');
  };
  document.querySelectorAll('.copy-email').forEach(button => button.addEventListener('click', async () => {
    try { await copyText('riyaansheth@gmail.com'); notify('Email address copied'); }
    catch (_) { notify('Email: riyaansheth@gmail.com'); }
  }));
  document.querySelector('.share-profile')?.addEventListener('click', async () => {
    const url = 'https://riyaansheth.tech/links.html';
    if (navigator.share) {
      try { await navigator.share({ title: 'Riyaan Sheth', text: 'Find me online.', url }); return; }
      catch (error) { if (error.name === 'AbortError') return; }
    }
    try { await copyText(url); notify('Profile link copied'); }
    catch (_) { notify('riyaansheth.tech/links.html'); }
  });

  const projects = {
    leadgen: {
      category: 'Full-stack platform / AI automation', title: 'AI Lead Generation Platform',
      description: 'A connected workflow for finding leads, understanding their fit, and reaching out with context.',
      sections: [
        ['The problem', 'Lead discovery, qualification, and outreach often live in separate tools. Moving data between them creates repetitive work and loses useful context.'],
        ['What I built', ['A full-stack platform with lead discovery and a built-in CRM.', 'LLM-powered qualification to evaluate leads with relevant context.', 'Automated email and WhatsApp outreach connected to the same workflow.']],
        ['My role', 'Backend automation, API integrations, database design, and deployment as part of my AI & Automation internship at DIZRUPT.']
      ],
      tags: ['Laravel', 'JavaScript', 'MySQL', 'Claude / LLM APIs', 'WhatsApp API', 'SMTP'],
      url: 'https://leadgen.outreachtool.xyz/', linkLabel: 'Visit live project'
    },
    payments: {
      category: 'Backend engineering / Financial operations', title: 'Payment Reconciliation System',
      description: 'A repeatable way to compare transaction data with bank settlements and surface the records that need attention.',
      sections: [
        ['The problem', 'Settlement files and transaction records need to agree, even when client-specific fees and inconsistent input files make that comparison difficult.'],
        ['What I built', ['CSV parsing and reconciliation between bank settlements and transaction data.', 'A configurable rules engine for per-client fees.', 'Automatic discrepancy flags so exceptions can be reviewed.']],
        ['My role', 'Built the Python backend, data workflows, rules engine, and MySQL integration, and deployed the system on Railway. The public demo is currently unavailable.']
      ], tags: ['Python', 'MySQL', 'CSV parsing', 'Rules engine', 'REST APIs', 'Railway']
    },
    reviews: {
      category: 'Autonomous agents / Customer experience', title: 'Google Review AI Bot',
      description: 'A review-management agent that brings new reviews and suggested replies into the place a team already works.',
      sections: [
        ['The problem', 'Keeping up with reviews takes time, especially when each reply should feel relevant and consistent with the business.'],
        ['What I built', ['Google Business Profile integration to retrieve new reviews.', 'Context-aware, on-brand response generation with Claude.', 'Telegram notifications and a one-click approval workflow for publishing replies.']],
        ['My role', 'Connected the APIs, built the agentic workflow, and implemented the Python backend and webhook integration.']
      ], tags: ['Python', 'Claude API', 'Google Business Profile API', 'Telegram Bot API', 'Webhooks']
    }
  };
  const dialog = document.querySelector('#project-dialog');
  if (dialog) {
    let trigger;
    document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => {
      const project = projects[button.dataset.project];
      if (!project) return;
      trigger = button;
      document.querySelector('#dialog-category').textContent = project.category;
      document.querySelector('#dialog-title').textContent = project.title;
      document.querySelector('#dialog-description').textContent = project.description;
      const content = document.querySelector('#dialog-content');
      content.replaceChildren();
      project.sections.forEach(([heading, body]) => {
        const section = document.createElement('section');
        section.className = 'dialog-section';
        const title = document.createElement('h3');
        title.textContent = heading;
        section.append(title);
        if (Array.isArray(body)) {
          const list = document.createElement('ul');
          body.forEach(text => { const item = document.createElement('li'); item.textContent = text; list.append(item); });
          section.append(list);
        } else { const paragraph = document.createElement('p'); paragraph.textContent = body; section.append(paragraph); }
        content.append(section);
      });
      const tags = document.querySelector('#dialog-tags');
      tags.replaceChildren();
      project.tags.forEach(text => { const tag = document.createElement('span'); tag.textContent = text; tags.append(tag); });
      const links = document.querySelector('#dialog-links');
      links.replaceChildren();
      const primary = document.createElement('a');
      primary.className = 'button button-primary';
      primary.href = project.url || 'mailto:riyaansheth@gmail.com?subject=' + encodeURIComponent('Tell me about ' + project.title);
      primary.textContent = project.linkLabel || 'Discuss this project';
      if (project.url) { primary.target = '_blank'; primary.rel = 'noopener noreferrer'; }
      primary.insertAdjacentHTML('beforeend', '<i data-lucide="arrow-up-right" aria-hidden="true"></i>');
      const resume = document.createElement('a');
      resume.className = 'text-link'; resume.href = 'assets/riyaan-sheth-resume.pdf'; resume.download = ''; resume.textContent = 'Download resume';
      resume.insertAdjacentHTML('beforeend', '<i data-lucide="download" aria-hidden="true"></i>');
      links.append(primary, resume);
      icons();
      dialog.showModal();
      dialog.scrollTop = 0;
      document.body.classList.add('modal-open');
      dialog.querySelector('.dialog-close').focus({ preventScroll: true });
    }));
    dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
    let backdropDown = false;
    dialog.addEventListener('pointerdown', event => { backdropDown = event.target === dialog && outsideDialog(event); });
    const outsideDialog = event => {
      const rect = dialog.getBoundingClientRect();
      return event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom;
    };
    dialog.addEventListener('click', event => { if (backdropDown && event.target === dialog && outsideDialog(event)) dialog.close(); });
    dialog.addEventListener('close', () => { document.body.classList.remove('modal-open'); trigger?.focus({ preventScroll: true }); });
  }

  const stage = document.querySelector('#hero-art');
  if (!stage) return;
  const fallback = () => {
    stage.replaceChildren();
    stage.classList.add('art-fallback');
    stage.removeAttribute('tabindex');
    stage.removeAttribute('title');
    stage.setAttribute('aria-label', 'Connected loops sculpture');
  };
  // Phones get the matching still render instead of a 600KB WebGL download.
  if (!matchMedia('(min-width: 621px)').matches) { fallback(); return; }
  const threeScript = document.createElement('script');
  threeScript.src = 'assets/three.min.js';
  threeScript.onerror = fallback;
  threeScript.onload = () => {
    let renderer;
    try {
      const T = window.THREE;
      renderer = new T.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power', preserveDrawingBuffer: true });
      renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
      renderer.outputEncoding = T.sRGBEncoding;
      renderer.toneMapping = T.ACESFilmicToneMapping;
      renderer.toneMappingExposure = .95;
      renderer.setClearColor(0xf8f9fc, 0);
      stage.append(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(35, 1, .1, 100);
      camera.position.z = 11;

      // Large studio panels give the metal readable reflections without external textures.
      const studio = new T.Scene();
      studio.background = new T.Color(0xaab4c5);
      const panelGeometry = new T.PlaneGeometry(1, 1);
      const panels = [];
      const addPanel = (color, x, y, z, width, height) => {
        const material = new T.MeshBasicMaterial({ color, side: T.DoubleSide });
        const panel = new T.Mesh(panelGeometry, material);
        panel.position.set(x, y, z); panel.scale.set(width, height, 1); panel.lookAt(0, 0, 0); studio.add(panel); panels.push(material);
      };
      addPanel(0xffffff, -4, 5, 3, 6, 9);
      addPanel(0xffffff, 3, 5, -4, 5, 9);
      addPanel(0x141f39, 0, -3, 5, 9, 4);
      addPanel(0x3155ee, 5, 0, 2, 6, 8);
      addPanel(0x8fcac3, -5, -1, -2, 4, 7);
      addPanel(0xf0bba7, 2, -4, -3, 5, 4);
      const pmrem = new T.PMREMGenerator(renderer);
      const environment = pmrem.fromScene(studio, .025);
      scene.environment = environment.texture;
      panelGeometry.dispose(); panels.forEach(material => material.dispose()); pmrem.dispose();
      scene.add(new T.HemisphereLight(0xffffff, 0x7a869a, 1.05));
      const key = new T.DirectionalLight(0xffffff, 2.1); key.position.set(-3, 6, 5); scene.add(key);
      const fill = new T.DirectionalLight(0xa2b7ff, .7); fill.position.set(5, -2, 3); scene.add(fill);
      const sculpture = new T.Group(); scene.add(sculpture);
      const metal = new T.MeshPhysicalMaterial({ color: 0xd3dcf0, metalness: .96, roughness: .19, clearcoat: 1, clearcoatRoughness: .12, envMapIntensity: 1.25 });
      const cobalt = new T.MeshPhysicalMaterial({ color: 0x284bd0, metalness: .8, roughness: .2, clearcoat: 1, clearcoatRoughness: .1, envMapIntensity: 1.05 });
      const geometry = new T.TorusKnotGeometry(1.3, .43, 256, 36, 2, 3);
      for (let segment = 0; segment < 256; segment++) geometry.addGroup(segment * 36 * 6, 36 * 6, segment < 93 ? 1 : 0);
      const knot = new T.Mesh(geometry, [metal, cobalt]);
      knot.rotation.set(.5, -.5, .22); sculpture.add(knot);
      const filament = new T.Mesh(new T.TorusKnotGeometry(1.64, .019, 256, 8, 2, 3), new T.MeshStandardMaterial({ color: 0x3155e7, metalness: .45, roughness: .32 }));
      filament.rotation.copy(knot.rotation); filament.rotation.y += .15; sculpture.add(filament);

      const motionQuery = matchMedia('(prefers-reduced-motion: reduce)');
      const toggle = document.querySelector('.motion-toggle');
      let paused = motionQuery.matches;
      let visible = true;
      let frame = 0;
      let previousTime = 0;
      let phase = 0;
      let width = 0;
      let height = 0;
      const target = { x: 0, y: 0 };
      const rotation = { x: 0, y: 0 };
      const updateToggle = () => {
        toggle.hidden = false;
        toggle.setAttribute('aria-pressed', String(paused));
        toggle.setAttribute('aria-label', paused ? 'Play animation' : 'Pause animation');
        toggle.title = paused ? 'Play animation' : 'Pause animation';
        toggle.innerHTML = `<i data-lucide="${paused ? 'play' : 'pause'}" aria-hidden="true"></i>`;
        icons();
      };
      const draw = () => {
        rotation.x += (target.x - rotation.x) * .08;
        rotation.y += (target.y - rotation.y) * .08;
        sculpture.rotation.set(rotation.x + Math.sin(phase * .28) * .09, rotation.y + phase * .075, -.15 + Math.sin(phase * .2) * .035);
        renderer.render(scene, camera);
      };
      const animate = timestamp => {
        frame = 0;
        if (document.hidden || !visible || paused) return;
        phase += Math.min((timestamp - previousTime) / 1000 || 0, .05);
        previousTime = timestamp;
        draw();
        frame = requestAnimationFrame(animate);
      };
      const sync = () => {
        cancelAnimationFrame(frame); frame = 0;
        draw();
        if (!paused && visible && !document.hidden) { previousTime = performance.now(); frame = requestAnimationFrame(animate); }
      };
      const resize = () => {
        width = stage.clientWidth; height = stage.clientHeight;
        if (!width || !height) return;
        camera.aspect = width / height; camera.updateProjectionMatrix(); renderer.setSize(width, height);
        const worldHeight = 2 * Math.tan(T.MathUtils.degToRad(camera.fov / 2)) * camera.position.z;
        const worldWidth = worldHeight * camera.aspect;
        const mobile = width <= 620;
        const visualSize = mobile ? Math.min(width * .72, 275, height * .37) : Math.min(width * .43, height * .83);
        sculpture.scale.setScalar(visualSize / height * worldHeight / 4.8);
        sculpture.position.x = worldWidth * (mobile ? .045 : .245);
        sculpture.position.y = worldHeight * (mobile ? -.28 : .005);
        draw();
      };
      new ResizeObserver(resize).observe(stage);
      if ('IntersectionObserver' in window) new IntersectionObserver(entries => { visible = entries[0].isIntersecting; sync(); }, { rootMargin: '60px' }).observe(stage);
      document.addEventListener('visibilitychange', sync);
      toggle.addEventListener('click', () => { paused = !paused; updateToggle(); sync(); });
      motionQuery.addEventListener('change', event => { paused = event.matches; updateToggle(); sync(); });
      let dragging = false;
      let lastX = 0;
      let lastY = 0;
      stage.addEventListener('pointerdown', event => {
        if (event.pointerType === 'touch') return;
        dragging = true; lastX = event.clientX; lastY = event.clientY; stage.setPointerCapture(event.pointerId);
      });
      stage.addEventListener('pointermove', event => {
        if (dragging) { target.y += (event.clientX - lastX) * .006; target.x += (event.clientY - lastY) * .004; lastX = event.clientX; lastY = event.clientY; }
        else if (event.pointerType !== 'touch' && !motionQuery.matches) { target.y = (event.clientX / width - .5) * .3; target.x = (event.clientY / height - .5) * .13; }
        if (paused) { rotation.x = target.x; rotation.y = target.y; draw(); }
      });
      stage.addEventListener('pointerup', () => { dragging = false; });
      stage.addEventListener('pointercancel', () => { dragging = false; });
      stage.addEventListener('keydown', event => {
        if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
        event.preventDefault();
        if (event.key === 'ArrowLeft') target.y -= .15;
        if (event.key === 'ArrowRight') target.y += .15;
        if (event.key === 'ArrowUp') target.x -= .15;
        if (event.key === 'ArrowDown') target.x += .15;
        rotation.x = target.x; rotation.y = target.y; draw();
      });
      renderer.domElement.addEventListener('webglcontextlost', event => { event.preventDefault(); cancelAnimationFrame(frame); stage.classList.add('art-fallback'); toggle.hidden = true; });
      updateToggle(); resize(); sync();
    } catch (error) {
      renderer?.dispose();
      fallback();
    }
  };
  document.head.append(threeScript);
})();
