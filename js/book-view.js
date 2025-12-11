document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const pageTitle = document.getElementById('pageTitle');
    const questionText = document.getElementById('questionText');
    const answerText = document.getElementById('answerText');
    const pageIndicator = document.getElementById('pageIndicator');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');

    let questionsData = []; // json ফাইল থেকে আসা সব প্রশ্ন এখানে জমা হবে
    let currentPageIndex = 0;
    let totalQuestions = 0;

    // --- Functions ---

    // নির্দিষ্ট প্রশ্ন ও উত্তর দেখানোর জন্য এই ফাংশন
    function renderPage(index) {
        if (index < 0 || index >= totalQuestions) return; // সীমার বাইরে গেলে কিছু করবে না
        
        currentPageIndex = index;
        const currentQuestion = questionsData[index];

        // প্রশ্ন এবং উত্তর দেখানো
        questionText.textContent = `প্রশ্ন ${currentQuestion.question_no}: ${currentQuestion.question}`;
        answerText.textContent = currentQuestion.answer;

        // পেজ ইন্ডিকেটর আপডেট করা
        pageIndicator.textContent = `প্রশ্ন ${index + 1} / ${totalQuestions}`;
        
        // বাটন সক্রিয় বা নিষ্ক্রিয় করা
        prevPageBtn.disabled = index === 0;
        nextPageBtn.disabled = index === totalQuestions - 1;
    }

    // JSON ফাইল থেকে ডেটা লোড করার জন্য Async ফাংশন
    async function loadQuestions() {
        // বর্তমান HTML ফাইলের নাম থেকে '.html' বাদ দিয়ে JSON ফাইলের নাম তৈরি করা
        const pageName = window.location.pathname.split('/').pop().replace('.html', '');
        const jsonFilePath = `json/${pageName}.json`;

        try {
            const response = await fetch(jsonFilePath);
            if (!response.ok) {
                throw new Error(`ফাইল পাওয়া যায়নি: ${response.statusText}`);
            }
            questionsData = await response.json();
            totalQuestions = questionsData.length;

            if (totalQuestions > 0) {
                // ডেটা সফলভাবে লোড হলে প্রথম প্রশ্নটি দেখানো
                renderPage(0);
            } else {
                questionText.textContent = 'কোনো প্রশ্ন পাওয়া যায়নি।';
                prevPageBtn.disabled = true;
                nextPageBtn.disabled = true;
            }

        } catch (error) {
            console.error('JSON ফাইল লোড করতে সমস্যা হয়েছে:', error);
            questionText.textContent = 'দুঃখিত, প্রশ্ন লোড করা সম্ভব হচ্ছে না।';
            // বাটনগুলো নিষ্ক্রিয় করে দেওয়া
            prevPageBtn.disabled = true;
            nextPageBtn.disabled = true;
        }
    }

    // --- Event Listeners ---
    prevPageBtn.addEventListener('click', () => {
        if (currentPageIndex > 0) {
            renderPage(currentPageIndex - 1);
        }
    });

    nextPageBtn.addEventListener('click', () => {
        if (currentPageIndex < totalQuestions - 1) {
            renderPage(currentPageIndex + 1);
        }
    });

    // --- Initial Setup ---
    // পেজ লোড হওয়ার সাথে সাথে প্রশ্ন লোড করা শুরু হবে
    loadQuestions();
});
