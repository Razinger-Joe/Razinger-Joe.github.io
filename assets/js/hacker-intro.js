/* ============================================================
   HACKER INTRO — Binary Rain + "You Have Been Hacked" Splash
   ============================================================
   
   Shows a full-screen Matrix-style binary rain (green & red 0s and 1s)
   with a blinking "YOU HAVE BEEN HACKED" message on first visit.
   Clicking anywhere or waiting 6 seconds dismisses it.
   ============================================================ */

(function () {
  "use strict";

  function init() {
    /* ---------- 1. Build the overlay HTML ---------- */
    var overlay = document.createElement("div");
    overlay.id = "hacker-intro";
    overlay.innerHTML =
      '<canvas id="binary-rain"></canvas>' +
      '<div class="hacked-icon">💀</div>' +
      '<div class="hacked-msg">YOU HAVE BEEN HACKED</div>' +
      '<div class="hacked-sub">Initializing secure connection...</div>' +
      '<div class="enter-prompt">[ Click anywhere to enter ]</div>';

    document.body.prepend(overlay);

    /* ---------- 2. Binary Rain Canvas Setup ---------- */
    var canvas = document.getElementById("binary-rain");
    var ctx = canvas.getContext("2d");

    function resizeCanvas() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    /* Column setup */
    var fontSize = 14;
    var columns = Math.floor(canvas.width / fontSize);
    var drops = [];
    var colors = [];

    for (var i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; /* stagger start */
      colors[i] = Math.random() > 0.7 ? "#ff0040" : "#00ff41"; /* 30% red, 70% green */
    }

    /* ---------- 3. Draw loop ---------- */
    var animationId;

    function drawRain() {
      /* Semi-transparent black overlay for trail effect */
      ctx.fillStyle = "rgba(0, 0, 0, 0.06)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.font = fontSize + "px 'JetBrains Mono', 'Courier New', monospace";

      for (var i = 0; i < columns; i++) {
        /* Random binary character */
        var char = Math.random() > 0.5 ? "1" : "0";

        /* Color with slight random brightness variation */
        ctx.fillStyle = colors[i];
        ctx.globalAlpha = 0.6 + Math.random() * 0.4;

        /* Draw character */
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        /* Reset drop or advance */
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
          /* Reassign color on reset for visual variety */
          colors[i] = Math.random() > 0.7 ? "#ff0040" : "#00ff41";
        }
        drops[i]++;
      }
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(drawRain);
    }

    drawRain();

    /* ---------- 4. Dismiss logic ---------- */
    var dismissed = false;

    function dismiss() {
      if (dismissed) return;
      dismissed = true;
      overlay.classList.add("fade-out");
      setTimeout(function () {
        cancelAnimationFrame(animationId);
        overlay.remove();
      }, 1200);
    }

    /* Click to dismiss */
    overlay.addEventListener("click", dismiss);

    /* Auto-dismiss after 6 seconds */
    setTimeout(dismiss, 6000);

    /* Also dismiss on Escape key */
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape") dismiss();
    });
  }

  /* Ensure DOM is ready */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
