/* Author: Sebastian Dane Ragonjan */
/* Section: CS-201 */

document.addEventListener("DOMContentLoaded", function() {

  console.log("gumagana na lods!");

// smooth scroll sa links
const scrollLinks = document.querySelectorAll('a[href*="#"]');

scrollLinks.forEach(function(link) {
 link.addEventListener("click", function(e) {
      const targetHref = this.getAttribute("href");
      
     if (targetHref.startsWith("#") && targetHref.length > 1) {
    e.preventDefault();
        const targetElement = document.querySelector(targetHref);
        
  if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
     }
      }
   });
});

// ilaw sa nav link pag nag-scroll
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".navbar nav ul li a");

window.addEventListener("scroll", function() {
  let currentSection = "";

    sections.forEach(function(section) {
     if (window.scrollY >= (section.offsetTop - 150)) {
       currentSection = section.getAttribute("id");
     }
  });

  navLinks.forEach(function(link) {
     link.classList.remove("active");
       if (link.getAttribute("href").includes("#" + currentSection) && currentSection !== "") {
    link.classList.add("active");
     }
  });
});

// dark / light mode button
const modeBtn = document.createElement("button");
modeBtn.innerText = "☀️ Light Mode";
modeBtn.className = "mode-toggle-btn";

const navList = document.querySelector(".navbar nav ul");
if (navList) {
   const li = document.createElement("li");
     li.appendChild(modeBtn);
   navList.appendChild(li);
}

modeBtn.addEventListener("click", function() {
    document.body.classList.toggle("light-mode");
  if (document.body.classList.contains("light-mode")) {
     modeBtn.innerText = "🌙 Dark Mode";
  } else {
       modeBtn.innerText = "☀️ Light Mode";
  }
});

// ==========================================
// DIAGONAL HALF CUBES GRID (REACT BITS STYLE) imported from https://reactbits.dev/animations/cubes
// ==========================================
const homeSection = document.getElementById("home");

if (homeSection) {
  let canvas = document.getElementById("cubes-canvas");
  if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "cubes-canvas";
    homeSection.insertBefore(canvas, homeSection.firstChild);
  }

  const ctx = canvas.getContext("2d");
  let width, height;

  function resizeCanvas() {
    width = canvas.width = homeSection.offsetWidth || window.innerWidth;
    height = canvas.height = homeSection.offsetHeight || window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let mouseX = -1000;
  let mouseY = -1000;
  let ripples = [];

  window.addEventListener("mousemove", function(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });

  window.addEventListener("mouseleave", function() {
    mouseX = -1000;
    mouseY = -1000;
  });

  window.addEventListener("click", function(e) {
    const rect = canvas.getBoundingClientRect();
    if (e.clientY <= height) {
      ripples.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        radius: 0,
        maxRadius: 450,
        speed: 8
      });
    }
  });

  // 3d projection helper
  function project(x, y, z, rx, ry, cx, cy) {
    let x1 = x * Math.cos(ry) + z * Math.sin(ry);
    let z1 = -x * Math.sin(ry) + z * Math.cos(ry);
    let y2 = y * Math.cos(rx) - z1 * Math.sin(rx);
    let z2 = y * Math.sin(rx) + z1 * Math.cos(rx);

    let fov = 350;
    let scale = fov / (fov + z2 + 80);
    return {
      x: cx + x1 * scale,
      y: cy + y2 * scale
    };
  }

  function draw() {
    ctx.clearRect(0, 0, width, height);

    // update ripples
    for (let r = 0; r < ripples.length; r++) {
      const rip = ripples[r];
      rip.radius += rip.speed;
      if (rip.radius > rip.maxRadius) {
        ripples.splice(r, 1);
        r--;
      }
    }

    const cubeSize = 35;
    const gap = 8;
    const step = cubeSize + gap;

    const cols = Math.floor(width / step) + 2;
    const rows = Math.floor(height / step) + 2;

    const gridWidth = cols * step - gap;
    const gridHeight = rows * step - gap;

    const startX = (width - gridWidth) / 2 + cubeSize / 2;
    const startY = (height - gridHeight) / 2 + cubeSize / 2;

    const isLight = document.body.classList.contains("light-mode");
    const strokeColor = isLight ? "rgba(0, 0, 0, 0.45)" : "rgba(255, 255, 255, 0.45)";
    const fillColor = isLight ? "rgba(230, 230, 230, 0.95)" : "#120f17";

    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const cx = startX + i * step;
        const cy = startY + j * step;

        // CUTOFF: skip kung nasa ilalim nung diagonal red line
        if ((cy / height) > (cx / width)) {
          continue;
        }

        const dx = mouseX - cx;
        const dy = mouseY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let rx = 0;
        let ry = 0;
        let pZ = 0;

        // mouse hover effect
        const maxDist = 200;
        if (dist < maxDist) {
          const factor = (1 - dist / maxDist);
          rx = (dy / maxDist) * 0.75 * factor;
          ry = -(dx / maxDist) * 0.75 * factor;
          pZ = factor * 25;
        }

        // ripple effect
        ripples.forEach(rip => {
          const rDist = Math.abs(Math.sqrt((cx - rip.x) ** 2 + (cy - rip.y) ** 2) - rip.radius);
          if (rDist < 60) {
            const ripFactor = (1 - rDist / 60);
            rx += 0.5 * ripFactor;
            ry += 0.5 * ripFactor;
            pZ += ripFactor * 30;
          }
        });

        const half = cubeSize / 2;
        const depth = cubeSize * 0.4;

        // 8 vertices ng cube
        const rawVerts = [
          {x: -half, y: -half, z: -depth + pZ},
          {x:  half, y: -half, z: -depth + pZ},
          {x:  half, y:  half, z: -depth + pZ},
          {x: -half, y:  half, z: -depth + pZ},
          {x: -half, y: -half, z:  depth + pZ},
          {x:  half, y: -half, z:  depth + pZ},
          {x:  half, y:  half, z:  depth + pZ},
          {x: -half, y:  half, z:  depth + pZ}
        ];

        const v = rawVerts.map(p => project(p.x, p.y, p.z, rx, ry, cx, cy));

        ctx.strokeStyle = strokeColor;
        ctx.fillStyle = fillColor;
        ctx.lineWidth = 1;

        // draw front face
        ctx.beginPath();
        ctx.moveTo(v[4].x, v[4].y);
        ctx.lineTo(v[5].x, v[5].y);
        ctx.lineTo(v[6].x, v[6].y);
        ctx.lineTo(v[7].x, v[7].y);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // draw 3d side connecting lines
        const edges = [
          [0, 1], [1, 2], [2, 3], [3, 0],
          [0, 4], [1, 5], [2, 6], [3, 7]
        ];

        edges.forEach(edge => {
          ctx.beginPath();
          ctx.moveTo(v[edge[0]].x, v[edge[0]].y);
          ctx.lineTo(v[edge[1]].x, v[edge[1]].y);
          ctx.stroke();
        });
      }
    }

    requestAnimationFrame(draw);
  }

  draw();
}

});