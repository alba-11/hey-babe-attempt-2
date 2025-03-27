document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.addEventListener('click', () => {
            const pageName = box.textContent.toLowerCase().replace(/ /g, '-').replace(/'/g, '').replace(/,/g, '') + '.html';
            window.location.href = pageName;
        });
    });
});

// Optional: Dynamically adjust scrolling speed based on screen size
window.addEventListener('resize', () => {
    const scrollingTexts = document.querySelectorAll('.scrolling-text');
    scrollingTexts.forEach(text => {
        const speed = window.innerWidth < 768 ? 20 : 15; // Adjust speed for smaller screens
        text.style.animationDuration = `${speed}s`;
    });
});