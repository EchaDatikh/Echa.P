function showOverlay(src) {
    document.getElementById("overlayImg").src = src;
    document.getElementById("overlay").style.display = "flex";
  }

  function hideOverlay() {
    document.getElementById("overlay").style.display = "none";
  }
