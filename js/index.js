
let wikiContent = {};

document.getElementById('copyButton').addEventListener('click', function() {
    const ip = 'FRTCraft.ru';
    navigator.clipboard.writeText(ip).then(() => {
        const originalText = this.innerHTML;
        this.innerHTML = '<i class="fas fa-check"></i> Скопировано!';
        
        setTimeout(() => {
            this.innerHTML = originalText;
        }, 2000);
    }).catch(err => {
        console.error('Ошибка при копировании: ', err);
    });
});

async function openWiki() {
    document.getElementById('wikiModal').style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    document.querySelectorAll('.wiki-menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    document.getElementById('wikiLoading').style.display = 'flex';
    document.getElementById('contentContainer').style.display = 'none';
    
    if (Object.keys(wikiContent).length === 0) {
        try {
            const response = await fetch('wiki/content.json');
            wikiContent = await response.json();
        } catch (error) {
            console.error('Ошибка загрузки контента:', error);
            wikiContent = {
                'overview': '<div class="content-title">Обзор</div><div class="content-text">Контент временно недоступен</div>'
            };
        }
    }
}

function closeWiki() {
    document.getElementById('wikiModal').style.display = 'none';
    document.body.style.overflow = 'auto';
    const contents = document.querySelectorAll('.wiki-content-section');
    contents.forEach(content => content.classList.remove('active'));
}

function showContent(contentId) {
    document.querySelectorAll('.wiki-menu-item').forEach(item => {
        item.classList.remove('active');
    });
    
    const activeItem = document.querySelector(`.wiki-menu-item[onclick="showContent('${contentId}')"]`);
    if (activeItem) {
        activeItem.classList.add('active');
    }
    
    document.getElementById('wikiLoading').style.display = 'none';
    document.getElementById('contentContainer').style.display = 'flex';
    document.getElementById('contentContainer').classList.add('active');
    
    if (wikiContent[contentId]) {
        let contentHTML = wikiContent[contentId];
        
        if (!contentHTML.includes('content-scroll-container')) {
            contentHTML = `<div class="content-scroll-container">${contentHTML}</div>`;
        }
        
        document.getElementById('contentContainer').innerHTML = contentHTML;
    } else {
        document.getElementById('contentContainer').innerHTML = `
            <div class="content-scroll-container">
                <div class="content-title">Раздел не найден</div>
                <div class="content-text">Содержание этого раздела временно недоступно.</div>
            </div>
        `;
    }
    
    const scrollContainer = document.querySelector('.content-scroll-container');
    if (scrollContainer) {
        scrollContainer.scrollTop = 0;
    }
    
    setTimeout(() => {
        const container = document.querySelector('.content-scroll-container');
        if (container && container.scrollHeight > container.clientHeight) {
            container.style.overflowY = 'auto';
        }
    }, 100);
}

window.onclick = function(event) {
    const modal = document.getElementById('wikiModal');
    if (event.target == modal) {
        closeWiki();
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const title = document.querySelector('h1');
    const paragraphs = document.querySelectorAll('p');
    
    setTimeout(() => {
        title.style.opacity = '1';
        title.style.transform = 'translateY(0)';
    }, 100);
    
    paragraphs.forEach((p, index) => {
        setTimeout(() => {
            p.style.opacity = '1';
            p.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });

});
