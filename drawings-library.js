import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getStorage, ref, listAll, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-storage.js";

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
const storage = getStorage(app);

// Load and display drawings
async function loadGallery() {
    const gallery = document.getElementById('gallery');
    gallery.innerHTML = ''; // Clear existing content

    const listRef = ref(storage, 'drawings/'); // Reference to the drawings folder
    try {
        const res = await listAll(listRef); // List all files in the folder
        if (res.items.length === 0) {
            gallery.innerHTML = '<p>No drawings found.</p>';
            return;
        }

        for (const itemRef of res.items) {
            const url = await getDownloadURL(itemRef); // Get the download URL for each file
            const img = document.createElement('img');
            img.src = url;
            img.alt = 'Drawing';
            img.style.width = '200px'; // Set a fixed width for the images
            img.style.margin = '10px';
            gallery.appendChild(img);
        }
    } catch (error) {
        console.error('Error loading gallery:', error);
        gallery.innerHTML = '<p>Failed to load drawings. Please try again later.</p>';
    }
}

// Load the gallery on page load
document.addEventListener('DOMContentLoaded', loadGallery);