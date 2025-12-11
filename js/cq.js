document.addEventListener('DOMContentLoaded', () => {
    const itemList = document.getElementById('itemList');
    const mainImage = document.getElementById('mainImage');
    const imageViewer = document.querySelector('.image-viewer');

    // Spng ফোল্ডারের সব ছবির লিস্ট এখানে যোগ করুন
    const questions = [
        { title: 'ঢাকা বোর্ড ২০২২', file: 'daka2022s.png' },
        { title: 'দিনাজপুর বোর্ড ২০১৯', file: 'dinajpur2019s.png' },
        // এখানে আপনার Spng ফোল্ডারের সব ছবির নাম যোগ করুন
    ];
    
    if (questions.length === 0) {
        itemList.innerHTML = '<p>কোনো সৃজনশীল প্রশ্ন যোগ করা হয়নি।</p>';
        return;
    }

    questions.forEach(q => {
        const button = document.createElement('button');
        button.textContent = q.title;
        button.classList.add('btn', 'item-btn');
        button.addEventListener('click', () => {
            mainImage.src = `CQpng/${q.file}`;
            mainImage.alt = q.title;
            imageViewer.style.display = 'block';
        });
        itemList.appendChild(button);
    });
    
    imageViewer.style.display = 'none';
});
