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

window.toggleLanguage = function() {
  const currentLang = document.documentElement.lang;
  const newLang = currentLang === 'en' ? 'ar' : 'en';
  setLanguage(newLang);
};

window.toggleDescription = function() {
  document.getElementById('description-container').classList.toggle('expanded');
};

window.toggleDarkMode = function() {
  const elementsToToggle = [
    document.body,
    document.querySelector('.profile-card'),
    document.getElementById('gallery-card'),
    document.querySelector('.dark-mode-toggle'),
    document.querySelector('.lang-toggle'),
    document.querySelector('.description-section'),
    document.querySelector('.description-text'),
    document.querySelector('.description-toggle'),
    ...document.querySelectorAll('.detail-item'),
    ...document.querySelectorAll('.social-item'),
    ...document.querySelectorAll('.action-btn'),
  ];
  elementsToToggle.forEach(el => {
    if (el) el.classList.toggle('light-mode');
  });
  const icon = document.getElementById('dark-mode-icon');
  icon.classList.toggle('fa-moon');
  icon.classList.toggle('fa-sun');
};

window.toggleGallery = function() {
  document.body.classList.toggle('gallery-visible');
};

window.openLightbox = function(src) {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  lightboxImg.src = src;
  lightbox.classList.add('visible');
};

window.closeLightbox = function() {
  const lightbox = document.getElementById('lightbox');
  lightbox.classList.remove('visible');
};

window.downloadVCard = function() {
  const currentLang = document.documentElement.lang;
  const langData = appData[currentLang];
  const sharedData = appData.shared_data;
  
  const vCardData = [
    'BEGIN:VCARD', 'VERSION:3.0',
    `N:${(langData.name || '').split(' ').reverse().join(';')}`, `FN:${langData.name}`,
    `TITLE:${langData.title || ''}`, `TEL;TYPE=CELL:${sharedData.phone}`,
    `EMAIL;TYPE=WORK:${sharedData.email}`,
    langData.company && `ORG:${langData.company}`,
    sharedData.address && `ADR;TYPE=WORK:;;${sharedData.address.replace(/,/g, ';')}`,
    sharedData.website && `URL;TYPE=Website:https://${sharedData.website}`,
    sharedData.linkedin && `URL;TYPE=LinkedIn:https://linkedin.com/in/${sharedData.linkedin}`,
    sharedData.instagram && `URL;TYPE=Instagram:https://instagram.com/${sharedData.instagram}`,
    sharedData.behance && `URL;TYPE=Behandce:https://behance.net/${sharedData.behance}`,
    'END:VCARD'
  ].filter(Boolean).join('\n');

  const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${langData.name.replace(/\s+/g, '_') || 'contact'}.vcf`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

// =================== هنا تم التعديل الرئيسي ===================
// دالة لإنشاء المعرض بالصور المحلية والعشوائية
function populateGallery() {
  // الخطوة 1: أضف أسماء ملفات صورك هنا في هذا السطر
  const localImages = [
    'images/image1.png',
    // 'images/another-image.jpg', // يمكنك إضافة المزيد هكذا
  ];

  // الخطوة 2: إنشاء 8 صور عشوائية من الإنترنت بأبعاد مختلفة
  const onlineImages = [];
  for (let i = 0; i < 8; i++) {
    const width = Math.floor(Math.random() * 201) + 300; // عرض عشوائي بين 300 و 500
    const height = Math.floor(Math.random() * 301) + 300; // ارتفاع عشوائي بين 300 و 600
    onlineImages.push(`https://picsum.photos/${width}/${height}?random=${i}`);
  }

  // الخطوة 3: دمج الصور المحلية والعشوائية
  const allImages = [...localImages, ...onlineImages];
  
  const imageGrid = document.querySelector('.image-grid');
  imageGrid.innerHTML = ''; // تفريغ المعرض قبل إضافة الصور الجديدة

  // الخطوة 4: إنشاء عناصر الصور وإضافتها للمعرض
  allImages.forEach(imageUrl => {
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = 'Gallery Image';
    img.className = 'gallery-image';
    img.onclick = () => openLightbox(imageUrl);
    imageGrid.appendChild(img);
  });
}
// =================== نهاية التعديل الرئيسي ===================


document.addEventListener('DOMContentLoaded', () => {
  fetch('data.json')
    .then(response => response.json())
    .then(data => {
      appData = data;
      const sharedData = appData.shared_data;
      document.getElementById('whatsapp-link').href = `https://wa.me/${sharedData.whatsapp}`;
      document.getElementById('linkedin-link').href = sharedData.linkedin.startsWith('http') ? sharedData.linkedin : `https://linkedin.com/in/${sharedData.linkedin}`;
      document.getElementById('instagram-link').href = sharedData.instagram.startsWith('http') ? sharedData.instagram : `https://instagram.com/${sharedData.instagram}`;
      document.getElementById('behance-link').href = sharedData.behance.startsWith('http') ? sharedData.behance : `https://behance.net/${sharedData.behance}`;
      const savedLang = localStorage.getItem('userLanguage') || 'ar';
      setLanguage(savedLang);

      // <<<<<<< استدعاء دالة بناء المعرض بعد تحميل البيانات
      populateGallery();
    })
    .catch(error => console.error('Error loading data:', error));

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      }
    });
});