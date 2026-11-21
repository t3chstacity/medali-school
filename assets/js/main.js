document.addEventListener('DOMContentLoaded', () => {
  // 1. Mobile Navigation Toggle
  const menuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // 2. Highlight Active Navigation Link Automatically
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  // 3. Gallery Category Filtering (gallery.html)
  const filterBtns = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => {
        b.classList.remove('bg-[#0f3d3e]', 'text-white');
        b.classList.add('bg-slate-100', 'text-slate-700');
      });
      btn.classList.remove('bg-slate-100', 'text-slate-700');
      btn.classList.add('bg-[#0f3d3e]', 'text-white');

      const category = btn.getAttribute('data-filter');
      galleryItems.forEach(item => {
        if (category === 'all' || item.getAttribute('data-category') === category) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  // 4. Formspree AJAX Submission Handler (Admissions & Contact)
  const setupFormspree = (formId, successId, errorId, submitBtnId, loadingText) => {
    const form = document.getElementById(formId);
    const successBox = document.getElementById(successId);
    const errorBox = document.getElementById(errorId);
    const submitBtn = document.getElementById(submitBtnId);

    if (!form) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (successBox) successBox.classList.add('hidden');
      if (errorBox) errorBox.classList.add('hidden');

      const originalBtnText = submitBtn ? submitBtn.textContent : 'Submit';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = loadingText;
      }

      try {
        const formData = new FormData(form);
        const response = await fetch(form.action, {
          method: form.method || 'POST',
          body: formData,
          headers: {
            'Accept': 'application/json'
          }
        });

        if (response.ok) {
          if (successBox) successBox.classList.remove('hidden');
          form.reset();
        } else {
          const data = await response.json().catch(() => ({}));
          console.error(`Formspree error (${formId}):`, response.status, data);
          if (errorBox) errorBox.classList.remove('hidden');
        }
      } catch (error) {
        console.error(`Network error (${formId}):`, error);
        if (errorBox) errorBox.classList.remove('hidden');
      } finally {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.textContent = originalBtnText;
        }
      }
    });
  };

  setupFormspree('admission-form', 'admission-alert', 'admission-error', 'admission-submit-btn', 'Sending Application...');
  setupFormspree('contact-form', 'contact-alert', 'contact-error', 'contact-submit-btn', 'Sending Message...');
});