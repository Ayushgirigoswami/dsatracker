// giri120.js

document.addEventListener('DOMContentLoaded', () => {
    // State
    // State
    console.log('Giri120: Checking for data...');
    if (typeof window.giriData === 'undefined') {
        console.error('Giri120: giriData is undefined!');
        alert('Table data failed to load. Please refresh or check console.');
    } else {
        console.log('Giri120: Data loaded with ' + window.giriData.length + ' entries.');
    }
    let questions = window.giriData || [];
    let userProgress = JSON.parse(localStorage.getItem('giri120_progress')) || {};
    let userNotes = JSON.parse(localStorage.getItem('giri120_notes')) || {};
    
    // DOM Elements
    const container = document.getElementById('questions-container');
    const topicFilter = document.getElementById('topic-filter');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const statusFilter = document.getElementById('status-filter');
    const searchInput = document.getElementById('search-input');
    const progressCount = document.getElementById('progress-count');
    const progressPercent = document.getElementById('progress-percent');
    const progressFill = document.getElementById('progress-fill');
    
    // Modal Elements
    const modal = document.getElementById('note-modal');
    const modalTitle = document.getElementById('modal-title');
    const noteText = document.getElementById('note-text');
    const saveNoteBtn = document.getElementById('save-note');
    const cancelNoteBtn = document.getElementById('cancel-note');
    const closeModalBtn = document.getElementById('close-modal');
    
    let currentNoteId = null;

    // Initialize
    init();

    function init() {
        populateTopicFilter();
        renderQuestions();
        updateProgress();
        setupEventListeners();
    }

    function populateTopicFilter() {
        const topics = [...new Set(questions.map(q => q.topic))];
        topics.forEach(topic => {
            const option = document.createElement('option');
            option.value = topic;
            option.textContent = topic;
            topicFilter.appendChild(option);
        });
    }

    function getFilteredQuestions() {
        const searchTerm = searchInput.value.toLowerCase();
        const selectedTopic = topicFilter.value;
        const selectedDiff = difficultyFilter.value;
        const selectedStatus = statusFilter.value;

        return questions.filter(q => {
            const matchesSearch = q.title.toLowerCase().includes(searchTerm) || q.id.toString().includes(searchTerm);
            const matchesTopic = selectedTopic === 'all' || q.topic === selectedTopic;
            const matchesDiff = selectedDiff === 'all' || q.difficulty === selectedDiff;
            
            const isDone = userProgress[q.id];
            let matchesStatus = true;
            if (selectedStatus === 'done') matchesStatus = isDone;
            if (selectedStatus === 'pending') matchesStatus = !isDone;

            return matchesSearch && matchesTopic && matchesDiff && matchesStatus;
        });
    }

    function renderQuestions() {
        container.innerHTML = '';
        const filtered = getFilteredQuestions();
        
        if (filtered.length === 0) {
            container.innerHTML = '<div style="text-align:center; padding: 40px; color: var(--text-secondary);">No questions found matching your criteria.</div>';
            return;
        }

        // Group by Topic
        const grouped = {};
        filtered.forEach(q => {
            if (!grouped[q.topic]) grouped[q.topic] = [];
            grouped[q.topic].push(q);
        });

        // Create Accordions
        for (const [topic, topicQuestions] of Object.entries(grouped)) {
            const topicGroup = document.createElement('div');
            topicGroup.className = 'topic-group open'; // Default open for better visibility
            
            // Calculate topic progress
            const topicDone = topicQuestions.filter(q => userProgress[q.id]).length;
            const topicTotal = topicQuestions.length;
            
            topicGroup.innerHTML = `
                <div class="topic-header" onclick="toggleAccordion(this)">
                    <div class="topic-title">
                        <i class="fa-solid fa-chevron-down chevron"></i>
                        ${topic}
                    </div>
                    <div class="topic-stats">
                        ${topicDone}/${topicTotal} Done
                    </div>
                </div>
                <div class="topic-body">
                    <div class="question-list">
                        ${topicQuestions.map(q => createQuestionHTML(q)).join('')}
                    </div>
                </div>
            `;
            container.appendChild(topicGroup);
        }
    }

    function createQuestionHTML(q) {
        const isChecked = userProgress[q.id] ? 'checked' : '';
        const hasNote = userNotes[q.id] ? 'has-note' : '';
        
        return `
            <div class="question-item" data-id="${q.id}">
                <input type="checkbox" class="q-checkbox" ${isChecked} onchange="toggleStatus('${q.id}')">
                <div class="q-content">
                    <div class="q-title-row">
                        <span style="color: var(--text-secondary); font-size: 0.9rem; min-width: 30px;">#${q.id}</span>
                        <a href="${q.url}" target="_blank" class="q-link">${q.title}</a>
                        <div class="q-badges">
                            <span class="badge badge-${q.difficulty.toLowerCase()}">${q.difficulty}</span>
                            <span class="priority-stars">${q.priority}</span>
                        </div>
                    </div>
                </div>
                <div class="q-actions">
                    <button class="btn-icon ${hasNote}" onclick="openNoteModal('${q.id}', '${q.title.replace(/'/g, "\\'")}')" title="Add Note">
                        <i class="fa-regular fa-note-sticky"></i>
                    </button>
                </div>
            </div>
        `;
    }

    window.toggleAccordion = function(header) {
        header.parentElement.classList.toggle('open');
    }

    window.toggleStatus = function(id) {
        if (userProgress[id]) {
            delete userProgress[id];
        } else {
            userProgress[id] = true;
        }
        localStorage.setItem('giri120_progress', JSON.stringify(userProgress));
        updateProgress();
        renderQuestions(); // Re-render to update stats
    }

    function updateProgress() {
        const total = questions.length;
        const solved = Object.keys(userProgress).length;
        const percent = Math.round((solved / total) * 100);
        
        progressCount.textContent = `${solved}/${total}`;
        progressPercent.textContent = `(${percent}%)`;
        progressFill.style.width = `${percent}%`;
    }

    // Note Modal Logic
    window.openNoteModal = function(id, title) {
        currentNoteId = id;
        modalTitle.textContent = `Note: ${title}`;
        noteText.value = userNotes[id] || '';
        modal.classList.add('active');
    }

    function closeNote() {
        modal.classList.remove('active');
        currentNoteId = null;
    }

    function saveNote() {
        if (currentNoteId) {
            const text = noteText.value.trim();
            if (text) {
                userNotes[currentNoteId] = text;
            } else {
                delete userNotes[currentNoteId];
            }
            localStorage.setItem('giri120_notes', JSON.stringify(userNotes));
            renderQuestions(); // Update icon state
            closeNote();
        }
    }

    function setupEventListeners() {
        searchInput.addEventListener('input', renderQuestions);
        topicFilter.addEventListener('change', renderQuestions);
        difficultyFilter.addEventListener('change', renderQuestions);
        statusFilter.addEventListener('change', renderQuestions);
        
        closeModalBtn.addEventListener('click', closeNote);
        cancelNoteBtn.addEventListener('click', closeNote);
        saveNoteBtn.addEventListener('click', saveNote);
        
        // Close modal on outside click
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeNote();
        });
    }
});
