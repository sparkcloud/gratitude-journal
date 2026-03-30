// We are creating a custom function named 'loadPage'
function loadPage(urlToLoad, clickedLink) {
    
    // 1. Find the iframe and tell it to load the new HTML file
    const iframe = document.getElementById('content-frame');
    iframe.src = urlToLoad;

    // 2. Find all the links in the sidebar and remove the 'active' highlight
    const allLinks = document.querySelectorAll('#sidebar a');
    allLinks.forEach(link => {
        link.classList.remove('active');
    });

    // 3. Add the 'active' highlight strictly to the link the user just clicked
    clickedLink.classList.add('active');
} 