// Replace this with the RAW URL of your markdown file on GitHub
// Example: 'https://raw.githubusercontent.com/sparkcloud/my-repo/main/readme.md'
const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/sparkcloud/gratitude-journal/refs/heads/master/README.md';
const journalEntries = {};

// Calendar State
let currentDisplayDate = new Date(); // Defaults to today

async function initJournal() {
    try {
        const response = await fetch(RAW_GITHUB_URL);
        if (!response.ok) throw new Error("Failed to fetch markdown file.");
        
        const markdownText = await response.text();
        parseMarkdown(markdownText);
        
        setupEventListeners();
        renderCalendar(); // Draw the calendar!
        
    } catch (error) {
        console.error("Error loading journal:", error);
    }
}

function parseMarkdown(text) {
    const entryRegex = /## Date: (\d{2}\/\d{2}\/\d{4})\s+([\s\S]*?)(?=(?:## Date:)|$)/g;
    for (const match of text.matchAll(entryRegex)) {
        journalEntries[match[1]] = match[2].trim();
    }
}

function setupEventListeners() {
    document.getElementById('prev-month').addEventListener('click', () => {
        currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
        renderCalendar();
    });

    document.getElementById('next-month').addEventListener('click', () => {
        currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
        renderCalendar();
    });
}

function renderCalendar() {
    const year = currentDisplayDate.getFullYear();
    const month = currentDisplayDate.getMonth(); // 0-indexed (0 = Jan, 11 = Dec)
    
    // Update the Header text (e.g., "March 2026")
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    document.getElementById('month-year-display').innerText = `${monthNames[month]} ${year}`;

    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = ''; // Clear previous days

    // Get the first day of the month (0 = Sun, 1 = Mon...)
    const firstDayIndex = new Date(year, month, 1).getDay();
    // Get total days in the current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // 1. Fill in blank days at the start of the month
    for (let i = 0; i < firstDayIndex; i++) {
        const emptyDiv = document.createElement('div');
        emptyDiv.classList.add('calendar-day', 'empty');
        calendarGrid.appendChild(emptyDiv);
    }

    // 2. Fill in the actual days
    for (let day = 1; day <= daysInMonth; day++) {
        const dayDiv = document.createElement('div');
        dayDiv.classList.add('calendar-day');
        dayDiv.innerText = day;

        // Format date to match your Markdown (MM/DD/YYYY)
        // String().padStart(2, '0') ensures single digits become "03" instead of "3"
        const formattedMonth = String(month + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const dateKey = `${formattedMonth}/${formattedDay}/${year}`;

        // Check if this date exists in our parsed Markdown dictionary
        if (journalEntries[dateKey]) {
            dayDiv.classList.add('has-entry');
            
            dayDiv.addEventListener('click', () => {
                // Remove active styling from all days, add to this one
                document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('active'));
                dayDiv.classList.add('active');
                
                displayEntry(dateKey);
            });
        }

        calendarGrid.appendChild(dayDiv);
    }
}

function displayEntry(dateStr) {
    const displayContainer = document.getElementById('journal-display');
    const rawMarkdown = journalEntries[dateStr];
    
    if (rawMarkdown) {
        displayContainer.innerHTML = `
            <h3 style="margin-top: 0; color: var(--primary-color); border-bottom: 2px solid #eee; padding-bottom: 10px;">
                Journal Entry: ${dateStr}
            </h3>
            ${marked.parse(rawMarkdown)}
        `;
    }
}

initJournal();