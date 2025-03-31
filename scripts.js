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

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    databaseURL: "YOUR_DATABASE_URL",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Select the canvas and buttons
const canvas = document.getElementById('drawingCanvas');
const ctx = canvas.getContext('2d');
const clearButton = document.getElementById('clearCanvas');
const saveButton = document.getElementById('saveDrawing');
const gallery = document.getElementById('gallery');

// Variables for drawing
let isDrawing = false;
let lastX = 0;
let lastY = 0;

// Set initial drawing settings
ctx.strokeStyle = 'black';
ctx.lineWidth = 2;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';

// Start drawing
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

// Draw on the canvas
canvas.addEventListener('mousemove', (e) => {
    if (!isDrawing) return;
    ctx.beginPath();
    ctx.moveTo(lastX, lastY);
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    [lastX, lastY] = [e.offsetX, e.offsetY];
});

// Stop drawing
canvas.addEventListener('mouseup', () => (isDrawing = false));
canvas.addEventListener('mouseout', () => (isDrawing = false));

// Clear the canvas
clearButton.addEventListener('click', () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
});

// Save the drawing
saveButton.addEventListener('click', () => {
    const dataURL = canvas.toDataURL('image/png');
    const img = document.createElement('img');
    img.src = dataURL;
    img.alt = 'Saved Drawing';
    img.style.width = '200px'; // Optional: Set thumbnail size
    img.style.margin = '10px';
    gallery.appendChild(img);
});

// Load gallery from Firebase
async function loadGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing images
    const listRef = ref(storage, 'drawings/');
    const res = await listAll(listRef);
    for (const itemRef of res.items) {
        const url = await getDownloadURL(itemRef);
        const img = document.createElement('img');
        img.src = url;
        gallery.appendChild(img);
    }
}

// Scroll to gallery
function scrollToGallery() {
    const gallery = document.getElementById('gallery');
    gallery.scrollIntoView({ behavior: 'smooth' });
}

// Load gallery on page load
loadGallery();