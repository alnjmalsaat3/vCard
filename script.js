fetch('data.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`فشل في تحميل ملف JSON: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        const elements = {
            name: data.name || '',
            title: data.title || '',
            phone: data.phone || '',
            email: data.email || '',
            email2: data.email2 || '',
            company: data.company || '',
            address: data.address || '',
            website: data.website || '',
            whatsapp: data.whatsapp || ''
        };
        Object.keys(elements).forEach(key => {
            const element = document.getElementById(key);
            if (element) {
                if (key === 'email' || key === 'email2') {
                    element.href = `mailto:${elements[key]}`;
                    element.textContent = elements[key];
                } else if (key === 'website') {
                    element.href = elements[key];
                    element.textContent = elements[key];
                } else if (key === 'whatsapp') {
                    element.href = `https://wa.me/${elements[key]}`;
                } else {
                    element.textContent = elements[key];
                }
            }
        });
        document.getElementById('email2-container').style.display = elements.email2 ? 'flex' : 'none';
        adjustElementsForScreenSize();
        window.addEventListener('resize', adjustElementsForScreenSize);
        window.downloadVCard = function() {
            const vCardData = [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `N:${(elements.name || '').split(' ').reverse().join(';')}`,
                `FN:${elements.name}`,
                `TITLE:${elements.title}`,
                `TEL;TYPE=CELL:${elements.phone}`,
                `EMAIL;TYPE=WORK:${elements.email}`,
                elements.email2 && `EMAIL;TYPE=WORK:${elements.email2}`,
                elements.company && `ORG:${elements.company}`,
                elements.address && `ADR;TYPE=WORK:;;${elements.address.replace(/,/g, ';')}`,
                elements.website && `URL:${elements.website}`,
                'END:VCARD'
            ].filter(line => line).join('\n');
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
        window.toggleDarkMode = function() {
            const elementsToToggle = [
                document.body,
                document.querySelector('.card'),
                ...document.querySelectorAll('.detail-item'),
                document.querySelector('.vcard-btn'),
                document.querySelector('.dark-mode-toggle')
            ];
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

function adjustElementsForScreenSize() {
    const detailItems = document.querySelectorAll('.detail-item');
    const screenWidth = window.innerWidth;
    if (screenWidth <= 320) {
        detailItems.forEach(item => {
            item.style.padding = '6px 6px';
        });
    } else if (screenWidth <= 480) {
        detailItems.forEach(item => {
            item.style.padding = '8px 8px';
        });
    } else {
        detailItems.forEach(item => {
            item.style.padding = '8px';
        });
    }
}