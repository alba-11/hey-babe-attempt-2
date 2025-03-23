document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.addEventListener('click', () => {
            const pageName = box.textContent.toLowerCase().replace(/ /g, '-').replace(/'/g, '').replace(/,/g, '') + '.html';
            window.location.href = pageName;
        });
    });
});