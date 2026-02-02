const editor = document.getElementById('editor');
let isRevealed = true;

// Theme toggle function with smooth transition
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    const themeIcon = document.getElementById('themeIcon');
    const themeText = document.getElementById('themeText');
    
    if (isDark) {
        themeIcon.className = 'fas fa-sun';
        themeText.textContent = 'Light';
    } else {
        themeIcon.className = 'fas fa-moon';
        themeText.textContent = 'Dark';
    }
    
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Load saved theme preference
window.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        document.getElementById('themeIcon').className = 'fas fa-sun';
        document.getElementById('themeText').textContent = 'Light';
    }
});

// Auto-focus editor when user starts typing anywhere
document.addEventListener('keydown', function(e) {
    if (document.activeElement === editor) return;
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (e.key.length > 1 && !['Enter', 'Space', 'Backspace', 'Delete', 'Tab'].includes(e.key)) return;
    
    editor.focus();
});

// Format text command
function formatText(command) {
    document.execCommand(command, false, null);
    editor.focus();
    updateButtonStates();
}

// Clear all formatting
function clearFormatting() {
    document.execCommand('removeFormat', false, null);
    editor.focus();
    updateButtonStates();
}

// Update button active states based on current selection
function updateButtonStates() {
    const buttons = {
        'bold': document.querySelector('[onclick*="bold"]'),
        'italic': document.querySelector('[onclick*="italic"]'),
        'underline': document.querySelector('[onclick*="underline"]'),
        'strikeThrough': document.querySelector('[onclick*="strikeThrough"]'),
        'insertOrderedList': document.querySelector('[onclick*="insertOrderedList"]'),
        'insertUnorderedList': document.querySelector('[onclick*="insertUnorderedList"]')
    };

    Object.keys(buttons).forEach(command => {
        if (buttons[command]) {
            if (document.queryCommandState(command)) {
                buttons[command].classList.add('active');
            } else {
                buttons[command].classList.remove('active');
            }
        }
    });
}

// Toggle reveal/hide text
function toggleReveal() {
    isRevealed = !isRevealed;
    editor.classList.toggle('hidden', !isRevealed);
    document.querySelector('.reveal-toggle').innerHTML = isRevealed ? '<i class="fas fa-eye-slash"></i> Hide' : '<i class="fas fa-eye"></i> Reveal';
}

// Keyboard shortcuts
editor.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        document.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
    }
    else if (e.ctrlKey && e.key === 'b') {
        e.preventDefault();
        formatText('bold');
    }
    else if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        formatText('italic');
    }
    else if (e.ctrlKey && e.key === 'u') {
        e.preventDefault();
        formatText('underline');
    }
    else if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        toggleReveal();
    }
    else if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        e.preventDefault();
        formatText('strikeThrough');
    }
    else if (e.ctrlKey && e.shiftKey && e.key === '&') {
        e.preventDefault();
        formatText('insertOrderedList');
    }
    else if (e.ctrlKey && e.shiftKey && e.key === '*') {
        e.preventDefault();
        formatText('insertUnorderedList');
    }
    else if (e.ctrlKey && e.key === '\\') {
        e.preventDefault();
        clearFormatting();
    }
});

// Update button states when selection changes
editor.addEventListener('mouseup', updateButtonStates);
editor.addEventListener('keyup', updateButtonStates);
editor.addEventListener('focus', updateButtonStates);
document.addEventListener('selectionchange', function() {
    if (document.activeElement === editor) {
        updateButtonStates();
    }
});

// Update character and word count
function updateStats() {
    const text = editor.innerText || '';
    const charCount = text.length;
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    document.getElementById('charCount').textContent = `${charCount} characters`;
    document.getElementById('wordCount').textContent = `${wordCount} words`;
}

// Update stats on input
editor.addEventListener('input', updateStats);

// Initial focus
editor.focus();
