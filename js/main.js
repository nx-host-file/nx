document.addEventListener('DOMContentLoaded', () => {
    const pageUrl = window.location.pathname.split('/').pop();

    if (pageUrl === 'chapter_view.html') {
        setupChapterView();
    } else if (pageUrl === 'board_mcq.html') {
        setupBoardItemView('mcq');
    } else if (pageUrl === 'creative.html') {
        setupBoardItemView('creative');
    } else if (pageUrl === 'ai_notes.html') {
        setupAiNotes();
    }
});

// CHAPTER VIEW LOGIC (No changes needed, but included for completeness)
function setupChapterView() {
    // ... আগের কোড এখানে থাকবে ...
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type'); // 'full' or 'info'
    const folder = type === 'full' ? '1png' : '2png';
    const totalPages = type === 'full' ? 20 : 10; // আপনার মোট পেজ সংখ্যা দিন

    let currentPage = 1;

    const pageTitle = document.getElementById('page-title');
    const headerTitle = document.getElementById('header-title');
    const pageImage = document.getElementById('pageImage');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    
    headerTitle.textContent = type === 'full' ? 'সম্পূর্ণ অধ্যায় পড়া' : 'দরকারি তথ্য';
    pageTitle.textContent = headerTitle.textContent;

    function showPage(pageNumber) {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            pageImage.src = `${folder}/page${pageNumber}.png`;
            pageImage.classList.remove('fade-in');
            void pageImage.offsetWidth; // Trigger reflow to restart animation
            pageImage.classList.add('fade-in');
            currentPage = pageNumber;
        }
        prevButton.disabled = (currentPage === 1);
        nextButton.disabled = (currentPage === totalPages);
    }

    prevButton.addEventListener('click', () => showPage(currentPage - 1));
    nextButton.addEventListener('click', () => showPage(currentPage + 1));
    
    const searchMap = {
        "html": 2, "tag": 3, "hyperlink": 8, "image": 10, "table": 12,
    };
    document.getElementById('searchButton')?.addEventListener('click', () => {
        const query = document.getElementById('searchInput').value.toLowerCase();
        if(searchMap[query]) showPage(searchMap[query]);
        else alert('টপিক খুঁজে পাওয়া যায়নি।');
    });

    showPage(1);
}

// BOARD MCQ / CREATIVE VIEW LOGIC (No changes needed)
function setupBoardItemView(type) {
    // ... আগের কোড এখানে থাকবে ...
    const container = document.getElementById('item-list-container');
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    const closeBtn = document.querySelector('.close-button');

    const mcqData = [ { title: 'ঢাকা বোর্ড - ২০২৩', img: 'MCQpng/dhaka_2023.png' }, { title: 'রাজশাহী বোর্ড - ২০২৩', img: 'MCQpng/raj_2023.png' }, ];
    const creativeData = [ { title: 'ঢাকা বোর্ড - ২০২৩', img: 'Spng/dhaka_cq_2023.png' }, { title: 'যশোর বোর্ড - ২০২৩', img: 'Spng/jessore_cq_2023.png' }, ];
    
    const data = type === 'mcq' ? mcqData : creativeData;

    data.forEach(item => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.textContent = item.title;
        div.addEventListener('click', () => {
            modal.style.display = 'block';
            modalImg.src = item.img;
        });
        container.appendChild(div);
    });

    closeBtn.onclick = () => modal.style.display = 'none';
    window.onclick = (event) => { if (event.target == modal) modal.style.display = 'none'; };
}

// **NEW** AI NOTES LOGIC
async function setupAiNotes() {
    const container = document.getElementById('notes-container');
    if (!container) return;

    try {
        const response = await fetch('json/3.json');
        const notes = await response.json();

        if (notes.length === 0) {
            container.innerHTML = '<p>এখনো কোনো নোট যোগ করা হয়নি।</p>';
            return;
        }

        notes.forEach(note => {
            const card = document.createElement('div');
            card.className = 'note-card';

            const title = document.createElement('h3');
            title.textContent = note.title;

            const content = document.createElement('p');
            content.textContent = note.content;

            const copyButton = document.createElement('button');
            copyButton.className = 'copy-button';
            copyButton.textContent = 'নোট কপি করুন';

            copyButton.addEventListener('click', () => {
                navigator.clipboard.writeText(note.content).then(() => {
                    copyButton.textContent = 'কপি হয়েছে!';
                    setTimeout(() => {
                        copyButton.textContent = 'নোট কপি করুন';
                    }, 2000);
                });
            });

            card.appendChild(title);
            card.appendChild(content);
            card.appendChild(copyButton);
            container.appendChild(card);
        });

    } catch (error) {
        console.error('Error fetching AI notes:', error);
        container.innerHTML = '<p>নোট লোড করতে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।</p>';
    }
}
