document.addEventListener('DOMContentLoaded', async () => {
    const notesContainer = document.getElementById('notesContainer');

    try {
        const response = await fetch('json/ainote.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const notes = await response.json();
        
        if (notes.length === 0) {
            notesContainer.innerHTML = '<p>কোনো নোট পাওয়া যায়নি।</p>';
            return;
        }

        notesContainer.innerHTML = ''; // Clear loading text
        notes.forEach(note => {
            const noteElement = document.createElement('div');
            noteElement.classList.add('note');

            const titleElement = document.createElement('h2');
            titleElement.textContent = note.title;

            const contentElement = document.createElement('p');
            contentElement.textContent = note.content;

            noteElement.appendChild(titleElement);
            noteElement.appendChild(contentElement);
            notesContainer.appendChild(noteElement);
        });

    } catch (error) {
        notesContainer.innerHTML = '<p>দুঃখিত, নোট লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।</p>';
        console.error('Failed to load notes:', error);
    }
});
