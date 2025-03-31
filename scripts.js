import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getDatabase, ref, push } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";
import { getStorage, ref as storageRef, uploadString, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

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
const storage = getStorage(app);

document.addEventListener('DOMContentLoaded', () => {
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        box.addEventListener('click', () => {
            const pageName = box.textContent.toLowerCase().replace(/ /g, '-').replace(/'/g, '').replace(/,/g, '') + '.html';
            window.location.href = pageName;
        });
    });

    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');

    // Ensure canvas has a valid size
    function ensureCanvasSize() {
        if (canvas.width === 0 || canvas.height === 0) {
            canvas.width = 800; // Default width
            canvas.height = 400; // Default height
        }
    }
    ensureCanvasSize();

    // Variables to track drawing state
    let isDrawing = false;
    let lastX = 0;
    let lastY = 0;

    // Set up canvas for drawing
    ctx.strokeStyle = '#000'; // Default stroke color (black)
    ctx.lineWidth = 2; // Default line width

    // Mouse events for drawing
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        [lastX, lastY] = [e.offsetX, e.offsetY];
    });

    canvas.addEventListener('mouseup', () => (isDrawing = false));
    canvas.addEventListener('mouseout', () => (isDrawing = false));

    // Touch events for drawing (for mobile devices)
    canvas.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent scrolling or zooming
        isDrawing = true;
        const touch = e.touches[0];
        [lastX, lastY] = [touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop];
    });

    canvas.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent scrolling or zooming
        if (!isDrawing) return;
        const touch = e.touches[0];
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop);
        ctx.stroke();
        [lastX, lastY] = [touch.clientX - canvas.offsetLeft, touch.clientY - canvas.offsetTop];
    });

    canvas.addEventListener('touchend', () => (isDrawing = false));

    // Clear canvas functionality
    document.getElementById('clearCanvas').addEventListener('click', () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Save drawing to Firebase
    document.getElementById('saveDrawing').addEventListener('click', async () => {
        const dataURL = canvas.toDataURL('image/png'); // Get the drawing as a base64 string
        const fileName = `drawing_${Date.now()}.png`; // Unique filename based on timestamp
        const storageReference = storageRef(storage, `drawings/${fileName}`); // Reference to Firebase Storage

        try {
            await uploadString(storageReference, dataURL, 'data_url'); // Upload the base64 string to Firebase
            alert('Drawing saved successfully!');
        } catch (error) {
            console.error('Error saving drawing:', error);
            alert('Failed to save the drawing. Please try again.');
        }
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

// Load gallery from Firebase
async function loadGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing images
    const listRef = storageRef(storage, 'drawings/');
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