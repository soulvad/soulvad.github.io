// Sample tour data
const tours = [
    {
        id: 1,
        title: "Відпочинок в Карпатах",
        image: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
        duration: "7 днів",
        price: "15000 грн",
        location: { lat: 48.6208, lng: 22.2879 },
        description: "Чудовий відпочинок в Карпатах з проживанням в гірському готелі"
    },
    {
        id: 2,
        title: "Морський круїз по Чорному морю",
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
        duration: "5 днів",
        price: "20000 грн",
        location: { lat: 44.6166, lng: 33.5254 },
        description: "Незвичайний круїз по Чорному морю з відвідуванням найкращих курортів"
    },
    {
        id: 3,
        title: "Екскурсія по Львову",
        image: "https://images.unsplash.com/photo-1596462502278-27bfdc403348",
        duration: "3 дні",
        price: "8000 грн",
        location: { lat: 49.8397, lng: 24.0297 },
        description: "Ознайомча екскурсія по найкращих місцях Львова"
    }
];

// Popup functionality
function showPopup(message, type = 'info') {
    const popup = document.createElement('div');
    popup.className = `popup ${type}`;
    popup.innerHTML = `
        <div class="popup-content">
            <span class="popup-message">${message}</span>
            <button class="popup-close">×</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Add styles dynamically
    const style = document.createElement('style');
    style.textContent = `
        .popup {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        }
        .popup-content {
            background: white;
            padding: 15px 20px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .popup.success .popup-content {
            border-left: 4px solid #4CAF50;
        }
        .popup.error .popup-content {
            border-left: 4px solid #f44336;
        }
        .popup.info .popup-content {
            border-left: 4px solid #2196F3;
        }
        .popup-close {
            background: none;
            border: none;
            font-size: 20px;
            cursor: pointer;
            padding: 0 5px;
            color: #666;
        }
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Add close button functionality
    const closeBtn = popup.querySelector('.popup-close');
    closeBtn.onclick = () => {
        popup.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => popup.remove(), 300);
    };
    
    // Auto close after 3 seconds
    setTimeout(() => {
        if (popup.parentElement) {
            popup.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => popup.remove(), 300);
        }
    }, 3000);
}

// Function to create tour cards
function createTourCard(tour, isBooking = false) {
    return `
        <div class="tour-card" data-tour-id="${tour.id}">
            <img src="${tour.image}" alt="${tour.title}" class="tour-image">
            <div class="tour-info">
                <h3 class="tour-title">${tour.title}</h3>
                <p class="tour-duration">Тривалість: ${tour.duration}</p>
                <p class="tour-price">${tour.price}</p>
                <p class="tour-description">${tour.description}</p>
                ${isBooking ? 
                    `<button class="cancel-button" onclick="cancelBooking(${tour.id})">Скасувати бронювання</button>` :
                    `<button class="book-button" onclick="bookTour(${tour.id})">Забронювати</button>`
                }
            </div>
        </div>
    `;
}

// Function to display tours using while loop
function displayTours() {
    const toursContainer = document.querySelector('.tours-container');
    toursContainer.innerHTML = '';
    
    let i = 0;
    while (i < tours.length) {
        const tourCard = createTourCard(tours[i]);
        toursContainer.innerHTML += tourCard;
        i++;
    }
    
    // Add click event listeners for card enlargement
    const tourCards = document.querySelectorAll('.tour-card');
    tourCards.forEach(card => {
        card.addEventListener('click', function(e) {
            if (!e.target.classList.contains('book-button') && !e.target.classList.contains('cancel-button')) {
                this.classList.toggle('enlarged');
            }
        });
    });
}

// Function to handle tour booking
function bookTour(tourId) {
    const tour = tours.find(t => t.id === tourId);
    if (!tour) return;

    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    if (!bookings.some(b => b.id === tourId)) {
        bookings.push(tour);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        displayBookings();
        showPopup('Тур успішно заброньовано!', 'success');
    } else {
        showPopup('Цей тур вже заброньовано!', 'error');
    }
}

// Function to cancel a booking
function cancelBooking(tourId) {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const updatedBookings = bookings.filter(booking => booking.id !== tourId);
    localStorage.setItem('bookings', JSON.stringify(updatedBookings));
    displayBookings();
    showPopup('Бронювання скасовано', 'info');
}

// Function to show confirmation popup
function showConfirmationPopup(message, onConfirm) {
    const popup = document.createElement('div');
    popup.className = 'popup confirmation';
    popup.innerHTML = `
        <div class="popup-content">
            <span class="popup-message">${message}</span>
            <div class="popup-buttons">
                <button class="popup-confirm">Так</button>
                <button class="popup-cancel">Ні</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Add confirmation popup styles
    const style = document.createElement('style');
    style.textContent = `
        .popup.confirmation .popup-content {
            min-width: 300px;
            text-align: center;
        }
        .popup-buttons {
            display: flex;
            gap: 10px;
            justify-content: center;
            margin-top: 15px;
        }
        .popup-confirm, .popup-cancel {
            padding: 8px 20px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
        }
        .popup-confirm {
            background-color: #f44336;
            color: white;
        }
        .popup-cancel {
            background-color: #e0e0e0;
            color: #333;
        }
        .popup-confirm:hover {
            background-color: #d32f2f;
        }
        .popup-cancel:hover {
            background-color: #d5d5d5;
        }
    `;
    document.head.appendChild(style);
    
    // Add button functionality
    const confirmBtn = popup.querySelector('.popup-confirm');
    const cancelBtn = popup.querySelector('.popup-cancel');
    
    confirmBtn.onclick = () => {
        popup.remove();
        onConfirm();
    };
    
    cancelBtn.onclick = () => {
        popup.remove();
    };
}

// Function to clear all bookings
function clearAllBookings() {
    showConfirmationPopup('Ви впевнені, що хочете скасувати всі бронювання?', () => {
        localStorage.removeItem('bookings');
        displayBookings();
        showPopup('Всі бронювання скасовано', 'info');
    });
}

// Function to display bookings
function displayBookings() {
    const bookingsContainer = document.querySelector('.bookings-container');
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    
    if (bookings.length === 0) {
        bookingsContainer.innerHTML = '<p>У вас немає заброньованих турів.</p>';
        return;
    }

    bookingsContainer.innerHTML = `
        <div class="bookings-header">
            <h3>Ваші бронювання (${bookings.length})</h3>
            <button class="cancel-all-button" onclick="clearAllBookings()">Скасувати всі бронювання</button>
        </div>
        <div class="bookings-grid">
            ${bookings.map(tour => createTourCard(tour, true)).join('')}
        </div>
    `;
}

// Function to handle contact form submission
function handleContactForm(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    
    // Here you would typically send the form data to a server
    showPopup('Дякуємо за ваше повідомлення! Ми зв\'яжемося з вами найближчим часом.', 'success');
    form.reset();
}

// Function to initialize map
function initMap() {
    // Initialize the map
    const map = L.map('map').setView([48.3794, 31.1656], 6); // Center of Ukraine

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Custom icon for markers
    const tourIcon = L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
    });

    // Add markers for each tour
    tours.forEach(tour => {
        const marker = L.marker([tour.location.lat, tour.location.lng], { icon: tourIcon })
            .addTo(map);

        // Create popup content
        const popupContent = `
            <div class="map-info-window">
                <h3>${tour.title}</h3>
                <p>${tour.description}</p>
                <p>Тривалість: ${tour.duration}</p>
                <p>Ціна: ${tour.price}</p>
                <button onclick="bookTour(${tour.id})">Забронювати</button>
            </div>
        `;

        marker.bindPopup(popupContent);
    });
}

// Додаємо ініціалізацію карти для контактів
function initContactMap() {
    const contactMapDiv = document.getElementById('contact-map');
    if (!contactMapDiv) return;
    // Координати Хрещатика, Київ
    const kyivCoords = [50.4483823, 30.5193563];
    const map = L.map('contact-map').setView(kyivCoords, 16);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    L.marker(kyivCoords).addTo(map)
        .bindPopup('<b>вулиця Хрещатик</b><br>Київ, 02000').openPopup();
}

// Add styles for enlarged cards and map
const style = document.createElement('style');
style.textContent = `
    .tour-card {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
        cursor: pointer;
    }
    
    .tour-card.enlarged {
        transform: scale(1.05);
        box-shadow: 0 4px 20px rgba(0,0,0,0.2);
        z-index: 1;
    }
    
    .map-info-window {
        padding: 10px;
        max-width: 300px;
    }
    
    .map-info-window h3 {
        margin: 0 0 10px 0;
        color: #333;
    }
    
    .map-info-window button {
        background-color: #4CAF50;
        color: white;
        border: none;
        padding: 8px 15px;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 10px;
    }
    
    .map-info-window button:hover {
        background-color: #45a049;
    }

    .leaflet-popup-content {
        margin: 10px;
    }
`;
document.head.appendChild(style);

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    displayTours();
    displayBookings();
    initMap();
    initContactMap(); // Додаємо ініціалізацію контактної карти
    
    // Add contact form submit handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', handleContactForm);
    }
}); 