/* Waving cloth flag (three.js). From the Claude Design handoff; adapted: reduced-motion static frame, WebGL fallback. */
(function () {
  if (customElements.get('nero-flag')) return;
  class NeroFlag extends HTMLElement {
    connectedCallback() {
      this.style.display = 'block';
      this.style.position = 'absolute';
      this.style.left = '0'; this.style.top = '0';
      this.style.pointerEvents = 'none';
      const boot = () => { if (window.THREE) this.init(); else setTimeout(boot, 100); };
      boot();
    }
    disconnectedCallback() {
      this.dead = true;
      this.ro && this.ro.disconnect();
      this.io && this.io.disconnect();
      this.renderer && this.renderer.dispose();
    }
    init() {
      const THREE = window.THREE;
      const bg = this.getAttribute('background') || '#F6F4F7';
      const starColor = this.getAttribute('star-color') || '#EADEDA';
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(bg);
      const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
      let renderer;
      try { renderer = new THREE.WebGLRenderer({ antialias: true }); }
      catch (e) { this.remove(); return; } // no WebGL: the box stays plain surface-coloured
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.style.cssText = 'display:block;width:100%;height:100%';
      this.appendChild(renderer.domElement);
      this.renderer = renderer;

      const size = 2048, c = document.createElement('canvas');
      c.width = c.height = size;
      const ctx = c.getContext('2d');
      ctx.fillStyle = this.getAttribute('cloth') || '#FAF7F3';
      ctx.fillRect(0, 0, size, size);
      const img = ctx.getImageData(0, 0, size, size), px = img.data;
      for (let p = 0; p < px.length; p += 4) {
        const g = (Math.random() - 0.5) * 10, warm = Math.random() < 0.015 ? -8 : 0;
        px[p] = Math.max(0, Math.min(255, px[p] + g + warm * 0.4));
        px[p + 1] = Math.max(0, Math.min(255, px[p + 1] + g + warm * 0.7));
        px[p + 2] = Math.max(0, Math.min(255, px[p + 2] + g + warm));
      }
      ctx.putImageData(img, 0, 0);
      const r = size * 0.09, so = size * 0.018, si = so * 0.382;
      ctx.fillStyle = starColor;
      for (let i = 0; i < 12; i++) {
        const a = (i / 12) * Math.PI * 2, x = size / 2 + Math.cos(a) * r, y = size / 2 + Math.sin(a) * r;
        let rot = Math.PI * 1.5; const step = Math.PI / 5;
        ctx.beginPath(); ctx.moveTo(x, y - so);
        for (let k = 0; k < 5; k++) {
          ctx.lineTo(x + Math.cos(rot) * so, y + Math.sin(rot) * so); rot += step;
          ctx.lineTo(x + Math.cos(rot) * si, y + Math.sin(rot) * si); rot += step;
        }
        ctx.closePath(); ctx.fill();
      }
      const tex = new THREE.CanvasTexture(c);
      tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
      const geo = new THREE.PlaneGeometry(28, 28, 160, 160);
      const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ map: tex, side: THREE.DoubleSide, roughness: 1, metalness: 0 }));
      mesh.position.y = parseFloat(this.getAttribute('lift') || '0');
      scene.add(mesh);
      scene.add(new THREE.AmbientLight(0xffffff, 0.88));
      const d1 = new THREE.DirectionalLight(0xffffff, 0.28); d1.position.set(6, 12, 15); scene.add(d1);
      const d2 = new THREE.DirectionalLight(0xffffff, 0.08); d2.position.set(-10, -5, 10); scene.add(d2);

      const pos = geo.attributes.position, n = pos.count;
      const ix = new Float32Array(n), iy = new Float32Array(n);
      for (let i = 0; i < n; i++) { ix[i] = pos.getX(i); iy[i] = pos.getY(i); }
      const speed = parseFloat(this.getAttribute('speed') || '0.5');

      const host = this.closest('[data-flag-host]') || this.offsetParent || this;
      const resize = () => {
        const w = host.clientWidth || 1, h = host.clientHeight || 1;
        this.style.width = w + 'px'; this.style.height = h + 'px';
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.position.z = Math.max(10, 10 / camera.aspect) / parseFloat(this.getAttribute('zoom') || '1');
        camera.updateProjectionMatrix();
      };
      this.ro = new ResizeObserver(resize); this.ro.observe(host); resize();
      this.visible = true;
      this.io = new IntersectionObserver(e => { this.visible = e[0].isIntersecting; }); this.io.observe(this);

      const clock = new THREE.Clock();
      const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // static frame instead of waving
      let t = still ? 3 : 0;
      const frame = () => {
        if (this.dead) return;
        if (!still) requestAnimationFrame(frame);
        const dt = clock.getDelta();
        if (!this.visible && !still) return;
        if (!still) t += dt * speed;
        for (let i = 0; i < n; i++) {
          const ox = ix[i], oy = iy[i];
          const n1 = Math.sin(ox * 0.6 + oy * 0.5 - t * 2.8);
          const n2 = Math.cos(ox * 1.2 - oy * 0.8 + t * 3.5);
          const n3 = Math.sin(ox * 1.8 + oy * 1.5 - t * 4.2);
          pos.setXYZ(i, ox + n2 * 0.45 + n3 * 0.25, oy + n1 * 0.4 + n3 * 0.2, (n1 * 0.8 + n2 * 0.45 + n3 * 0.25) * 0.7);
        }
        pos.needsUpdate = true;
        geo.computeVertexNormals();
        renderer.render(scene, camera);
      };
      frame();
    }
  }
  customElements.define('nero-flag', NeroFlag);
})();
