document.addEventListener('DOMContentLoaded', function() {
  // Navegación entre secciones
  const menuButtons = document.querySelectorAll('.menu button');
  const sections = document.querySelectorAll('.section');
  
  menuButtons.forEach(button => {
    button.addEventListener('click', function() {
      const sectionId = this.getAttribute('data-section');
      
      sections.forEach(section => {
        section.classList.remove('active');
      });
      
      document.getElementById(sectionId).classList.add('active');
    });
  });

  // Libro de poemas
  const pages = document.querySelectorAll('.page');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const pageCounter = document.getElementById('page-counter');
  let currentPage = 0;

  function showPage() {
    pages.forEach((page, index) => {
      if (index < currentPage) {
        page.style.transform = 'rotateY(-180deg)';
        page.style.zIndex = pages.length - index;
      } else if (index === currentPage) {
        page.style.transform = 'rotateY(0deg)';
        page.style.zIndex = pages.length;
      } else {
        page.style.transform = 'rotateY(0deg)';
        page.style.zIndex = pages.length - index;
      }
    });

    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === pages.length - 1;
    pageCounter.textContent = `${currentPage + 1}/${pages.length}`;
  }

  prevBtn.addEventListener('click', function() {
    if (currentPage > 0) {
      currentPage--;
      showPage();
    }
  });

  nextBtn.addEventListener('click', function() {
    if (currentPage < pages.length - 1) {
      currentPage++;
      showPage();
    }
  });

  // Swipe para móviles
  const book = document.getElementById('book-pages');
  let startX = 0;

  book.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
  }, { passive: true });

  book.addEventListener('touchend', function(e) {
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;

    if (diffX > 50 && !nextBtn.disabled) {
      nextBtn.click();
    } else if (diffX < -50 && !prevBtn.disabled) {
      prevBtn.click();
    }
  }, { passive: true });

  // Modal para imágenes
  const modal = document.getElementById('image-modal');
  const modalImg = document.getElementById('modal-image');
  const captionText = document.getElementById('caption');
  const galleryImages = document.querySelectorAll('.gallery img');

  galleryImages.forEach(img => {
    img.addEventListener('click', function() {
      modal.style.display = "block";
      modalImg.src = this.src;
      captionText.innerHTML = this.alt;
    });
  });
  document.querySelector('.close').addEventListener('click', function() {
    modal.style.display = "none";
  });

  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  // Manejo del PDF
  const pdfViewer = document.getElementById('pdf-viewer');
  const pdfFallback = document.getElementById('pdf-fallback');
  const pdfError = document.getElementById('pdf-error');
  
  window.reloadPDF = function() {
    pdfViewer.style.display = 'block';
    pdfFallback.style.display = 'none';
    pdfError.style.display = 'none';
    
    const currentSrc = pdfViewer.src;
    pdfViewer.src = '';
    setTimeout(() => {
      pdfViewer.src = currentSrc;
    }, 100);
  };
  
  pdfViewer.onload = function() {
    pdfFallback.style.display = 'none';
    pdfError.style.display = 'none';
    
    try {
      if (pdfViewer.contentDocument.body.innerHTML.includes("PDF")) {
        pdfFallback.style.display = 'none';
      }
    } catch (e) {}
  };
  
  pdfViewer.onerror = function() {
    setTimeout(() => {
      pdfViewer.style.display = 'none';
      pdfFallback.style.display = 'block';
    }, 3000);
  };
  
  fetch('pdfs/carta.pdf')
    .then(response => {
      if (!response.ok) {
        showPDFError();
      }
    })
    .catch(() => {
      showPDFError();
    });
  
  function showPDFError() {
    pdfViewer.style.display = 'none';
    pdfFallback.style.display = 'none';
    pdfError.style.display = 'block';
  }
  
  // Mostrar la página inicial
  showPage();
});
// Verificación del PDF
function checkPDF() {
  fetch('pdfs/carta.pdf')
    .then(response => {
      if (!response.ok) {
        showPDFAlternatives();
      }
    })
    .catch(() => {
      showPDFAlternatives();
    });
}

function showPDFAlternatives() {
  const pdfContainer = document.querySelector('.pdf-container');
  pdfContainer.innerHTML = `
    <div class="pdf-error">
      <p>No se pudo cargar el PDF automáticamente. Por favor usa una de estas opciones:</p>
      <div class="pdf-alternatives">
        <a href="pdfs/carta.pdf" target="_blank" class="alt-btn">🔍 Abrir en nueva ventana</a>
        <a href="pdfs/carta.pdf" download class="alt-btn">📥 Descargar PDF</a>
      </div>
    </div>
  `;
}

// Llamar al cargar la página
document.addEventListener('DOMContentLoaded', checkPDF);
// Solución para reproducción en móviles
function setupMobileVideos() {
  if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    const videoContainers = document.querySelectorAll('.video-container');
    
    videoContainers.forEach(container => {
      const iframe = container.querySelector('iframe');
      const overlay = document.createElement('div');
      overlay.className = 'video-overlay';
      overlay.innerHTML = '<span>Toca para reproducir</span>';
      
      container.style.position = 'relative';
      container.appendChild(overlay);
      
      overlay.addEventListener('click', () => {
        // Reemplazar el iframe para forzar la reproducción
        const src = iframe.src;
        iframe.src = src + '?autoplay=1';
        overlay.style.display = 'none';
      });
    });
  }
}

document.addEventListener('DOMContentLoaded', function() {
  setupMobileVideos();
  // [El resto de tu código JavaScript existente]
});