// Replace this with the RAW URL of your markdown file on GitHub
// Example: 'https://raw.githubusercontent.com/sparkcloud/my-repo/main/readme.md'
const RAW_GITHUB_URL = 'https://raw.githubusercontent.com/sparkcloud/gratitude-journal/refs/heads/master/README.md';

// Object to store our parsed data: { "03/23/2026": "Markdown text...", ... }
const journalEntries = {};

// 1. Fetch and Parse the Data
async function initJournal() {
    try {
        const response = await fetch(RAW_GITHUB_URL);
        if (!response.ok) throw new Error("Failed to fetch markdown file.");
        
        const markdownText = await response.text();
        parseMarkdown(markdownText);
        renderCalendar();
        
    } catch (error) {
        console.error("Error loading journal:", error);
        document.getElementById('journal-display').innerHTML = 
            `<p style="color: red;">Error loading entries. Check the console and ensure your RAW GitHub URL is correct.</p>`;
    }
}

// 2. The Regex Parsing Logic
function parseMarkdown(text) {
    // The Regex designed for your specific format
    const entryRegex = /## Date: (\d{2}\/\d{2}\/\d{4})\s+([\s\S]*?)(?=(?:## Date:)|$)/g;
    
    for (const match of text.matchAll(entryRegex)) {
        const dateStr = match[1];      // e.g., "03/23/2026"
        const content = match[2].trim(); // The journal text
        
        journalEntries[dateStr] = content;
    }
}

// 3. Render the Digital Calendar Tiles
function renderCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    calendarGrid.innerHTML = ''; // Clear out loading states

    // Extract the dates and sort them (optional, but good for organization)
    const dates = Object.keys(journalEntries);
    
    dates.forEach(date => {
        const tile = document.createElement('div');
        tile.classList.add('calendar-tile');
        
        // Make the date display a bit cleaner (e.g., "03/23")
        const shortDate = date.substring(0, 5);
        tile.innerText = shortDate; 
        
        tile.addEventListener('click', () => {
            // Remove active class from all tiles, add to the clicked one
            document.querySelectorAll('.calendar-tile').forEach(t => t.classList.remove('active'));
            tile.classList.add('active');
            
            displayEntry(date);
        });
        
        calendarGrid.appendChild(tile);
    });
}

// 4. Display the Entry
function displayEntry(dateStr) {
    const displayContainer = document.getElementById('journal-display');
    const rawMarkdown = journalEntries[dateStr];
    
    if (rawMarkdown) {
        // Use marked.js to render the markdown into HTML formatting
        displayContainer.innerHTML = `
            <h3 style="margin-top: 0; color: var(--primary-color);">Entry for ${dateStr}</h3>
            ${marked.parse(rawMarkdown)}
        `;
    }
}

// Kickstart the application
initJournal();