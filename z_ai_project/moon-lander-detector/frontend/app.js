// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyBK6JnMIft5vOeDHXT7iXkXBzSc8tPjYNU",
    authDomain: "moon-landslide-detection.firebaseapp.com",
    projectId: "moon-landslide-detection",
    storageBucket: "moon-landslide-detection.appspot.com",
    messagingSenderId: "29468326553",
    appId: "1:29468326553:web:47619c465eb4c331399608"
};

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
    console.log("Firebase initialized successfully.");
} else {
    console.log("Firebase already initialized.");
}

const auth = firebase.auth();
const db = firebase.firestore();

// Authentication
document.getElementById('loginBtn').addEventListener('click', () => {
    const email = prompt('Enter email');
    const password = prompt('Enter password');
    if (!email || !password) return alert('Email and password are required');
    auth.signInWithEmailAndPassword(email, password)
        .then(() => showDashboard())
        .catch(error => alert(error.message));
});

document.getElementById('registerBtn').addEventListener('click', () => {
    const email = prompt('Enter email');
    const password = prompt('Enter password');
    if (!email || !password) return alert('Email and password are required');
    auth.createUserWithEmailAndPassword(email, password)
        .then(() => alert('Registered successfully! Please log in.'))
        .catch(error => alert(error.message));
});

function showDashboard() {
    document.getElementById('auth').style.display = 'none';
    document.getElementById('dashboard').style.display = 'block';
}

// Image Search
document.getElementById('searchBtn').addEventListener('click', () => {
    const query = document.getElementById('searchInput').value;
    if (!query) return alert('Please enter a search term');
    document.getElementById('loading').style.display = 'block';
    fetch(`https://images-api.nasa.gov/search?q=${query}&media_type=image`)
        .then(response => response.json())
        .then(data => {
            document.getElementById('loading').style.display = 'none';
            const gallery = document.getElementById('imageGallery');
            gallery.innerHTML = '';
            data.collection.items.slice(0, 6).forEach(item => { // Limit to 6 for demo
                const div = document.createElement('div');
                div.className = 'col-4';
                const img = document.createElement('img');
                img.src = item.links[0].href;
                img.className = 'image-item img-fluid';
                img.alt = item.data[0].title;
                img.onclick = () => analyzeImage(item.links[0].href);
                div.appendChild(img);
                gallery.appendChild(div);
            });
        })
        .catch(() => {
            document.getElementById('loading').style.display = 'none';
            alert('Failed to fetch images');
        });
});

// Analyze Image
function analyzeImage(imageUrl) {
    document.getElementById('loading').style.display = 'block';
    fetch('http://localhost:5000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image_url: imageUrl })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('dashboard').style.display = 'none';
        document.getElementById('analysis').style.display = 'block';
        document.getElementById('loading').style.display = 'none';

        // Display Image with Overlays
        const container = document.getElementById('imageContainer');
        container.innerHTML = `<img src="${imageUrl}" alt="Analyzed Lunar Image" class="img-fluid">`;
        data.detections.forEach(det => {
            const box = document.createElement('div');
            box.className = 'bounding-box';
            box.style.left = `${det.bbox[0]}px`;
            box.style.top = `${det.bbox[1]}px`;
            box.style.width = `${det.bbox[2] - det.bbox[0]}px`;
            box.style.height = `${det.bbox[3] - det.bbox[1]}px`;
            box.setAttribute('data-type', det.type);
            container.appendChild(box);
        });

        // Save to Firestore
        db.collection('analyses').add({
            userId: auth.currentUser.uid,
            imageUrl: imageUrl,
            detections: data.detections,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Chart Visualization
        const ctx = document.getElementById('statsChart').getContext('2d');
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Landslides', 'Boulders'],
                datasets: [{
                    label: 'Detections',
                    data: [
                        data.detections.filter(d => d.type === 'landslide').length,
                        data.detections.filter(d => d.type === 'boulder').length
                    ],
                    backgroundColor: ['#ff6384', '#36a2eb']
                }]
            },
            options: { responsive: true }
        });
    })
    .catch(() => {
        document.getElementById('loading').style.display = 'none';
        alert('Analysis failed');
    });
}