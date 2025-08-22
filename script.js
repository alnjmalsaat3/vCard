fetch('data.json')
  .then(response => {
    if (!response.ok) {
      throw new Error(`فشل في تحميل ملف JSON: ${response.status}`);
    }
    return response.json();
  })
  .then(data => {
    // تم حذف name و title لأن العناصر المقابلة لها تم حذفها
    const elements = {
      company: data.company || '',
      phone: data.phone || '',
      email: data.email || '',
      address: data.address || '',
      website: data.website || '',
      whatsapp: data.whatsapp || '',
      linkedin: data.linkedin || '',
      instagram: data.instagram || '',
      behance: data.behance || ''
    };

    Object.keys(elements).forEach(key => {
      const element = document.getElementById(key);
      if (element) {
        if (key === 'email') {
          element.href = `mailto:${elements[key]}`;
          element.textContent = elements[key];
        } else if (key === 'website') {
          let url = elements[key].trim();
          if (url && !url.startsWith("http://") && !url.startsWith("https://")) {
            url = "https://" + url;
          }
          element.href = url;
          element.target = "_blank";
          element.textContent = url.replace(/^https?:\/\//, '');
        } else if (!['whatsapp', 'linkedin', 'instagram', 'behance'].includes(key)) {
          element.textContent = elements[key];
        }
      }
    });

    // إعداد روابط الشبكات الاجتماعية
    const whatsappLink = document.getElementById('whatsapp-link');
    if (whatsappLink && elements.whatsapp) {
      whatsappLink.href = `https://wa.me/${elements.whatsapp}`;
    }

    const linkedinLink = document.getElementById('linkedin-link');
    if (linkedinLink && elements.linkedin) {
      linkedinLink.href = elements.linkedin.startsWith('http') ? elements.linkedin : `https://linkedin.com/in/${elements.linkedin}`;
    }

    const instagramLink = document.getElementById('instagram-link');
    if (instagramLink && elements.instagram) {
      instagramLink.href = elements.instagram.startsWith('http') ? elements.instagram : `https://instagram.com/${elements.instagram}`;
    }

    const behanceLink = document.getElementById('behance-link');
    if (behanceLink && elements.behance) {
      behanceLink.href = elements.behance.startsWith('http') ? elements.behance : `https://behance.net/${elements.behance}`;
    }

    // vCard (يستخدم الاسم والمسمى الوظيفي من data.json مباشرة)
    window.downloadVCard = function() {
      const vCardData = [
        'BEGIN:VCARD',
        'VERSION:3.0',
        `N:${(data.name || '').split(' ').reverse().join(';')}`,
        `FN:${data.name}`,
        `TITLE:${data.title}`,
        `TEL;TYPE=CELL:${elements.phone}`,
        `EMAIL;TYPE=WORK:${elements.email}`,
        elements.company && `ORG:${elements.company}`,
        elements.address && `ADR;TYPE=WORK:;;${elements.address.replace(/,/g, ';')}`,
        elements.website && `URL:${elements.website}`,
        'END:VCARD'
      ].filter(Boolean).join('\n');

      const blob = new Blob([vCardData], { type: 'text/vcard' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'contact.vcf';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    };

    // تبديل الثيم
    window.toggleDarkMode = function() {
      const elementsToToggle = [
        document.body,
        document.querySelector('.card'),
        ...document.querySelectorAll('.detail-item'),
        ...document.querySelectorAll('.social-item'),
        document.querySelector('.vcard-btn'),
        document.querySelector('.dark-mode-toggle'),
        // تم حذف h1 و h2 من هنا
      ].filter(Boolean);

      elementsToToggle.forEach(el => el.classList.toggle('light-mode'));

      const icon = document.getElementById('dark-mode-icon');
      icon.classList.toggle('fa-moon');
      icon.classList.toggle('fa-sun');
    };
  })
  .catch(error => {
    console.error('خطأ في تحميل البيانات:', error);
    alert('حدث خطأ في تحميل البيانات، يرجى التحقق من اتصال الإنترنت أو ملف data.json');
  });