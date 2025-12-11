document.addEventListener('DOMContentLoaded', async () => {
    const notesContainer = document.getElementById('notesContainer');

    try {
        const response = await fetch('json/board-mcq.json');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const mcqs = await response.json();
        
        if (mcqs.length === 0) {
            notesContainer.innerHTML = '<p>কোনো MCQ পাওয়া যায়নি।</p>';
            return;
        }

        notesContainer.innerHTML = ''; // লোডিং টেক্সট মুছে ফেলা হলো

        mcqs.forEach(mcq => {
            const mcqElement = document.createElement('div');
            mcqElement.classList.add('mcq-block');

            const metaElement = document.createElement('div');
            metaElement.classList.add('mcq-meta');
            metaElement.textContent = `বোর্ড: ${mcq.board}, সাল: ${mcq.year}`;
            mcqElement.appendChild(metaElement);

            const questionElement = document.createElement('p');
            questionElement.classList.add('question');
            questionElement.textContent = mcq.question;
            mcqElement.appendChild(questionElement);

            const optionsList = document.createElement('ul');
            optionsList.classList.add('options');

            let correctOptionElement = null; // সঠিক উত্তরের li এলিমেন্ট রাখার জন্য

            for (const key in mcq.options) {
                const optionItem = document.createElement('li');
                optionItem.textContent = `${key}) ${mcq.options[key]}`;

                if (key === mcq.answer) {
                    // সঠিক উত্তরটিকে একটি ভেরিয়েবলে সংরক্ষণ করা হলো
                    // কিন্তু ক্লাস এখনই যোগ করা হচ্ছে না
                    correctOptionElement = optionItem;
                }

                optionsList.appendChild(optionItem);
            }

            mcqElement.appendChild(optionsList);

            // উত্তর দেখানোর/লুকানোর বাটন (চোখের আইকন)
            const toggleBtn = document.createElement('button');
            toggleBtn.classList.add('toggle-answer-btn');
            toggleBtn.innerHTML = '👁️'; // চোখের ইমোজি
            toggleBtn.title = 'উত্তর দেখুন/লুকান'; // মাউস রাখলে এই লেখা দেখাবে

            // বাটনে ক্লিক ইভেন্ট যোগ করা
            toggleBtn.addEventListener('click', () => {
                // correct-answer ক্লাসটি যোগ বা حذف করবে
                correctOptionElement.classList.toggle('correct-answer');
            });

            mcqElement.appendChild(toggleBtn);
            notesContainer.appendChild(mcqElement);
        });

    } catch (error) {
        notesContainer.innerHTML = '<p>দুঃখিত, MCQ লোড করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।</p>';
        console.error('Failed to load MCQ:', error);
    }
});
