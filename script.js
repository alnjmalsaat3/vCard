let appData = {};

function setLanguage(lang) {
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  const langData = appData[lang];
  const sharedData = appData.shared_data;
  document.getElementById('description').textContent = langData.description;
  document.getElementById('company').textContent = langData.company;
  document.getElementById('vcard-btn').textContent = langData.saveContact;
  document.getElementById('lang-toggle-btn').textContent = langData.lang_toggle;
  document.getElementById('gallery-btn').textContent = langData.gallery;
  document.getElementById('gallery-title').textContent = langData.galleryTitle;
  document.getElementById('phone').textContent = sharedData.phone;
  document.getElementById('address').textContent = sharedData.address;
  const emailEl = document.getElementById('email');
  emailEl.href = `mailto:${sharedData.email}`;
  emailEl.textContent = sharedData.email;
  localStorage.setItem('userLanguage', lang);
}

window.toggleLanguage = () => {
  const newLang = document.documentElement.lang === 'en' ? 'ar' : 'en';
  setLanguage(newLang);
};

window.toggleDescription = () => document.getElementById('description-container').classList.toggle('expanded');

window.toggleDarkMode = () => {
  const isLight = document.body.classList.toggle('light-mode');
  document.querySelectorAll('.card, .dark-mode-toggle, .lang-toggle, .description-section, .description-text, .description-toggle, .detail-item, .social-item, .action-btn, .gallery-image').forEach(el => {
    if (el) el.classList.toggle('light-mode', isLight);
  });
  const icon = document.getElementById('dark-mode-icon');
  icon.className = isLight ? 'fas fa-sun' : 'fas fa-moon';
};

window.toggleGallery = () => document.body.classList.toggle('gallery-visible');

window.openLightbox = (src) => {
  const lightbox = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  lightbox.classList.add('visible');
};

window.closeLightbox = () => document.getElementById('lightbox').classList.remove('visible');

window.downloadVCard = function() { /* ... الكود كما هو ... */ };

// ======== Gallery Population Final & Robust Version ========
function populateGallery() {
  const localImages = ['images/image1.png'];
  const onlineImages = Array.from({ length: 8 }, (_, i) => `https://picsum.photos/${Math.floor(Math.random()*201)+300}/${Math.floor(Math.random()*301)+400}?random=${i}`);
  const allImages = [...localImages, ...onlineImages];
  
  const imageGrid = document.querySelector('.image-grid');
  imageGrid.innerHTML = '';
  
  imageGrid.className = allImages.length <= 2 ? 'image-grid centered' : 'image-grid masonry';

  allImages.forEach(imageUrl => {
    const img = document.createElement('img');
    img.className = 'gallery-image';
    if (document.body.classList.contains('light-mode')) {
      img.classList.add('light-mode');
    }
    
    // الدالة التي يتم استدعاؤها عند التحميل الناجح
    const onImageLoad = () => {
      img.classList.add('loaded');
      img.style.minHeight = 'auto'; // إزالة الارتفاع الأدنى بعد معرفة الحجم الحقيقي
    };
    
    img.onload = onImageLoad;
    img.onerror = () => {
      img.style.display = 'none'; // إخفاء الصورة تمامًا إذا فشل تحميلها
    };
    
    // تعيين المصدر بعد إضافة المستمعين
    img.src = imageUrl;
    
    // للتعامل مع الصور المحملة من الكاش بسرعة
    if (img.complete) {
      onImageLoad();
    }

    img.onclick = () => openLightbox(imageUrl);
    imageGrid.appendChild(img);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      appData = data;
      const sharedData = appData.shared_data;
      document.getElementById('whatsapp-link').href = `https://wa.me/${sharedData.whatsapp}`;
      document.getElementById('linkedin-link').href = `https://linkedin.com/in/${sharedData.linkedin}`;
      document.getElementById('instagram-link').href = `https://instagram.com/${sharedData.instagram}`;
      document.getElementById('behance-link').href = `https://behance.net/${sharedData.behance}`;
      const savedLang = localStorage.getItem('userLanguage') || 'ar';
      setLanguage(savedLang);
      populateGallery();
    })
    .catch(error => console.error('Error loading data:', error));

  window.addEventListener('keydown', (e) => e.key === 'Escape' && closeLightbox());
});