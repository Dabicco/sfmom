// SAFE MOM Mobile App - JavaScript Functionality

// Mock Backend Data
const mockBackend = {
    users: [
        {
            id: 1,
            email: 'admin@safemom.com',
            password: 'admin123',
            name: 'Jane Smith',
            title: 'Marketing Manager',
            profileType: 'admin'
        },
        {
            id: 2,
            email: 'test@test.com',
            password: 'test123',
            name: 'Test User',
            title: 'Community Member',
            profileType: 'user'
        }
    ],
    messages: [
        {
            id: 1,
            title: 'Community Updates',
            content: 'New safety alerts in your area...',
            time: '2 hours ago',
            sender: 'SafeMom Community'
        },
        {
            id: 2,
            title: 'Event Reminder',
            content: 'Don\'t forget about tomorrow\'s event...',
            time: '5 hours ago',
            sender: 'Event Coordinator'
        },
        {
            id: 3,
            title: 'Safety Alert',
            content: 'Increased security measures in downtown area...',
            time: '1 day ago',
            sender: 'Safety Team'
        }
    ],
    events: [
        {
            id: 1,
            title: 'Community Safety Meeting',
            date: '2025-04-15',
            time: '7:00 PM',
            location: 'Community Center'
        },
        {
            id: 2,
            title: 'Self Defense Workshop',
            date: '2025-04-16',
            time: '2:00 PM',
            location: 'Main Hall'
        }
    ],
    emergencyContacts: [
        { name: 'Emergency Services', number: '911' },
        { name: 'SafeMom Hotline', number: '1-800-SAFEMOM' },
        { name: 'Local Police', number: '555-0123' }
    ]
};

// App State Management
let currentUser = null;
let currentScreen = 'login-screen';
let calendarData = {
    currentMonth: 3, // April (0-indexed)
    currentYear: 2025,
    monthNames: ['January', 'February', 'March', 'April', 'May', 'June',
                'July', 'August', 'September', 'October', 'November', 'December']
};

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Handle iOS PWA quick actions from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const action = urlParams.get('action');
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('safemom-user');
    if (savedUser) {
        currentUser = JSON.parse(savedUser);
        
        // Handle quick actions if logged in
        if (action === 'emergency') {
            showScreen('emergency-alert-screen');
        } else if (action === 'checkin') {
            showScreen('checkin-screen');
        } else {
            showScreen('dashboard-screen');
        }
    } else {
        showScreen('login-screen');
    }

    // Set body data attribute for CSS targeting
    if (action) {
        document.body.setAttribute('data-action', action);
    }

    // Set up event listeners
    setupEventListeners();
    
    // iOS PWA optimizations
    setupiOSPWAFeatures();
    
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => console.log('SW registered:', registration))
            .catch(error => console.log('SW registration failed:', error));
    }
}

function setupiOSPWAFeatures() {
    // Prevent iOS bounce scrolling
    document.addEventListener('touchmove', function(e) {
        if (e.target.closest('.content') === null) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // iOS viewport height fix
    function setVH() {
        let vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    
    setVH();
    window.addEventListener('resize', setVH);
    window.addEventListener('orientationchange', setVH);
    
    // iOS PWA status bar color
    if (window.navigator.standalone) {
        document.querySelector('meta[name="theme-color"]').content = '#000000';
    }
    
    // iOS haptic feedback simulation
    window.triggerHaptic = function() {
        if (window.navigator.vibrate) {
            window.navigator.vibrate(50);
        }
    };
    
    // Add haptic feedback to important buttons
    document.addEventListener('click', function(e) {
        if (e.target.closest('.emergency-btn-911, .mom-alert-btn, .btn-action')) {
            if (typeof window.triggerHaptic === 'function') {
                window.triggerHaptic();
            }
        }
    });
}

function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Action buttons
    document.querySelectorAll('.btn-action').forEach(button => {
        button.addEventListener('click', handleActionButton);
    });

    // Navigation items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const screenName = this.getAttribute('onclick');
            if (screenName && screenName.includes('showScreen')) {
                const match = screenName.match(/showScreen\('([^']+)'\)/);
                if (match) {
                    showScreen(match[1]);
                }
            }
        });
    });
}

// Authentication Functions
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Show loading
    showLoading();
    
    setTimeout(() => {
        const user = mockBackend.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            currentUser = user;
            localStorage.setItem('safemom-user', JSON.stringify(user));
            updateUserProfile();
            showScreen('dashboard-screen');
            showNotification('Login successful!', 'success');
        } else {
            showNotification('Invalid email or password', 'error');
        }
    }, 1500);
}

function testLogin() {
    document.getElementById('email').value = 'test@test.com';
    document.getElementById('password').value = 'test123';
    
    // Trigger login
    const loginForm = document.getElementById('login-form');
    loginForm.dispatchEvent(new Event('submit'));
}

function signOut() {
    currentUser = null;
    localStorage.removeItem('safemom-user');
    showScreen('login-screen');
    showNotification('Signed out successfully', 'success');
}

// Screen Management
function showScreen(screenId) {
    // Hide all screens
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Show target screen
    const targetScreen = document.getElementById(screenId);
    if (targetScreen) {
        targetScreen.classList.add('active');
        currentScreen = screenId;
        
        // Update navigation
        updateNavigation(screenId);
        
        // Load screen-specific data
        switch(screenId) {
            case 'messages-screen':
                loadMessages();
                break;
            case 'calendar-screen':
                loadCalendar();
                break;
            case 'account-screen':
                loadAccountData();
                break;
        }
    }
}

function showLoading() {
    showScreen('loading-screen');
    setTimeout(() => {
        // Hide loading after operation
    }, 1000);
}

// Navigation Functions
function updateNavigation(activeScreen) {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Map screen IDs to navigation items
    const navMapping = {
        'dashboard-screen': 0,
        'messages-screen': 1,
        'calendar-screen': 2,
        'account-screen': 3
    };
    
    const navIndex = navMapping[activeScreen];
    if (navIndex !== undefined) {
        const navItems = document.querySelectorAll('.nav-item');
        if (navItems[navIndex]) {
            navItems[navIndex].classList.add('active');
        }
    }
}

// Action Button Handlers
function handleActionButton(event) {
    const buttonText = event.target.textContent;
    
    switch(buttonText) {
        case 'CHECK-IN':
            handleCheckIn();
            break;
        case 'MY EVENTS':
            showMyEvents();
            break;
        case 'MY COMMUNITY':
            showCommunity();
            break;
        case 'EVENT CALENDAR':
            showScreen('calendar-screen');
            break;
        case 'REPORT SUSPICIOUS ACTIVITY':
            handleSuspiciousReport();
            break;
        case 'EMERGENCY':
            handleEmergency();
            break;
    }
}

function handleCheckIn() {
    showScreen('checkin-screen');
}

function showMyEvents() {
    showScreen('events-list-screen');
}

function showCommunity() {
    showScreen('community-screen');
}

function handleSuspiciousReport() {
    showScreen('report-category-screen');
}

function handleEmergency() {
    showScreen('emergency-alert-screen');
}

// Check-in Screen Functions
function getCurrentLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            document.getElementById('location-search-input').value = `Current Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        }, function(error) {
            alert('Unable to get location: ' + error.message);
        });
    } else {
        alert('Geolocation not supported by this browser');
    }
}

function confirmCheckIn() {
    const location = document.getElementById('location-search-input').value || 'Current Location';
    alert(`Check-in confirmed at: ${location}\n\nYour location has been shared with your safety circle.`);
    showScreen('dashboard-screen');
}

// Emergency Functions
function sendMomAlert() {
    if (confirm('Are you sure you want to send a MOM ALERT to all nearby moms?')) {
        alert('🚨 MOM ALERT SENT!\n\nYour location has been shared with all moms in your safe zone. Help is on the way!');
        showScreen('dashboard-screen');
    }
}

function call911Emergency() {
    if (confirm('Are you sure you want to call 911? This will also alert your community.')) {
        alert('🚨 EMERGENCY ALERT ACTIVATED!\n\n• 911 has been contacted\n• Your location shared with law enforcement\n• Community members have been notified\n\nStay on the line with emergency services.');
        // In a real app, this would actually dial 911
        // window.location.href = 'tel:911';
        showScreen('dashboard-screen');
    }
}

// Report Category Functions
function selectReportCategory(category) {
    const categoryNames = {
        'law-enforcement': 'Law Enforcement',
        'fire-department': 'Fire Department',
        'animal-control': 'Animal Control',
        'medical-emergency': 'Medical Emergency',
        'hazardous-materials': 'Hazardous Materials',
        'other': 'Other'
    };
    
    alert(`Report category selected: ${categoryNames[category]}\n\nIn a full app, this would open a detailed report form for ${categoryNames[category]} incidents.`);
    showScreen('dashboard-screen');
}

// Community Functions
function likePost(button) {
    const postItem = button.closest('.post-item');
    const statsDiv = postItem.querySelector('.post-stats');
    const currentStats = statsDiv.textContent;
    
    if (button.classList.contains('liked')) {
        button.classList.remove('liked');
        button.style.color = '#666';
        // Decrease like count
        const matches = currentStats.match(/(\d+) Likes?/);
        if (matches) {
            const newCount = Math.max(0, parseInt(matches[1]) - 1);
            statsDiv.textContent = currentStats.replace(/(\d+) Likes?/, `${newCount} Like${newCount !== 1 ? 's' : ''}`);
        }
    } else {
        button.classList.add('liked');
        button.style.color = '#e91e63';
        // Increase like count
        const matches = currentStats.match(/(\d+) Likes?/);
        if (matches) {
            const newCount = parseInt(matches[1]) + 1;
            statsDiv.textContent = currentStats.replace(/(\d+) Likes?/, `${newCount} Like${newCount !== 1 ? 's' : ''}`);
        }
    }
}

function commentPost(button) {
    const comment = prompt('Add a comment:');
    if (comment && comment.trim()) {
        alert(`Comment added: "${comment}"\n\nIn a full app, this would be posted to the community feed.`);
    }
}

function savePost(button) {
    if (button.classList.contains('saved')) {
        button.classList.remove('saved');
        button.style.color = '#666';
        alert('Post removed from saved items');
    } else {
        button.classList.add('saved');
        button.style.color = '#e91e63';
        alert('Post saved to your collection');
    }
}

function createNewPost() {
    const postContent = prompt('What would you like to share with the community?');
    if (postContent && postContent.trim()) {
        alert(`New post created: "${postContent}"\n\nIn a full app, this would be posted to the community feed.`);
    }
}

// Messages Functions
function loadMessages() {
    const messagesContainer = document.querySelector('.messages-content');
    if (messagesContainer) {
        messagesContainer.innerHTML = '';
        
        mockBackend.messages.forEach(message => {
            const messageElement = createMessageElement(message);
            messagesContainer.appendChild(messageElement);
        });
    }
}

function createMessageElement(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message-item';
    messageDiv.innerHTML = `
        <div class="avatar"></div>
        <div class="message-info">
            <h3>${message.title}</h3>
            <p>${message.content}</p>
            <span class="time">${message.time}</span>
        </div>
    `;
    messageDiv.addEventListener('click', () => {
        alert(`From: ${message.sender}\n\n${message.content}`);
    });
    return messageDiv;
}

// Calendar Functions
function loadCalendar() {
    updateCalendarHeader();
    // Calendar is already loaded in HTML for simplicity
    // In a real app, this would dynamically generate calendar days
}

function updateCalendarHeader() {
    const monthHeader = document.getElementById('current-month');
    if (monthHeader) {
        monthHeader.textContent = `${calendarData.monthNames[calendarData.currentMonth]} ${calendarData.currentYear}`;
    }
}

function previousMonth() {
    calendarData.currentMonth--;
    if (calendarData.currentMonth < 0) {
        calendarData.currentMonth = 11;
        calendarData.currentYear--;
    }
    updateCalendarHeader();
    showNotification('Calendar navigation - Previous month', 'info');
}

function nextMonth() {
    calendarData.currentMonth++;
    if (calendarData.currentMonth > 11) {
        calendarData.currentMonth = 0;
        calendarData.currentYear++;
    }
    updateCalendarHeader();
    showNotification('Calendar navigation - Next month', 'info');
}

// Account Functions
function loadAccountData() {
    if (currentUser) {
        updateUserProfile();
    }
}

function updateUserProfile() {
    // Update profile information
    document.getElementById('user-title').textContent = currentUser.title;
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-email').textContent = currentUser.email;
}

function editField(fieldType) {
    let currentValue = '';
    let fieldElement = '';
    
    switch(fieldType) {
        case 'title':
            currentValue = currentUser.title;
            fieldElement = document.getElementById('user-title');
            break;
        case 'name':
            currentValue = currentUser.name;
            fieldElement = document.getElementById('user-name');
            break;
        case 'email':
            currentValue = currentUser.email;
            fieldElement = document.getElementById('user-email');
            break;
    }
    
    const newValue = prompt(`Edit ${fieldType}:`, currentValue);
    if (newValue && newValue !== currentValue) {
        currentUser[fieldType] = newValue;
        fieldElement.textContent = newValue;
        localStorage.setItem('safemom-user', JSON.stringify(currentUser));
        showNotification(`${fieldType} updated successfully`, 'success');
    }
}

// Notification System
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        backgroundColor: type === 'error' ? '#f44336' : type === 'success' ? '#4caf50' : '#2196f3',
        color: 'white',
        padding: '15px 20px',
        borderRadius: '8px',
        zIndex: '10000',
        fontSize: '14px',
        maxWidth: '90%',
        textAlign: 'center',
        boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
    });
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// Utility Functions
function formatDate(date) {
    return new Date(date).toLocaleDateString();
}

function formatTime(time) {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
}

// PWA Installation
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent Chrome 67 and earlier from automatically showing the prompt
    e.preventDefault();
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button or prompt
    showInstallPrompt();
});

function showInstallPrompt() {
    const installButton = document.createElement('button');
    installButton.textContent = 'Install App';
    installButton.className = 'btn-primary';
    installButton.style.position = 'fixed';
    installButton.style.bottom = '90px';
    installButton.style.right = '20px';
    installButton.style.zIndex = '1001';
    installButton.style.fontSize = '12px';
    installButton.style.padding = '8px 12px';
    installButton.style.width = 'auto';
    
    installButton.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                showNotification('App installed successfully!', 'success');
            }
            deferredPrompt = null;
            installButton.remove();
        }
    });
    
    document.body.appendChild(installButton);
    
    // Remove button after 10 seconds if not clicked
    setTimeout(() => {
        if (installButton.parentNode) {
            installButton.remove();
        }
    }, 10000);
}

// Touch and Gesture Handling
let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', function(e) {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', function(e) {
    if (!e.changedTouches || !e.changedTouches[0]) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Implement swipe gestures
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
            // Swipe right
            handleSwipeRight();
        } else {
            // Swipe left
            handleSwipeLeft();
        }
    }
});

function handleSwipeRight() {
    // Navigate to previous screen
    const screens = ['dashboard-screen', 'messages-screen', 'calendar-screen', 'account-screen'];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex > 0) {
        showScreen(screens[currentIndex - 1]);
    }
}

function handleSwipeLeft() {
    // Navigate to next screen
    const screens = ['dashboard-screen', 'messages-screen', 'calendar-screen', 'account-screen'];
    const currentIndex = screens.indexOf(currentScreen);
    if (currentIndex < screens.length - 1) {
        showScreen(screens[currentIndex + 1]);
    }
}

// App State Persistence
window.addEventListener('beforeunload', function() {
    // Save app state before closing
    localStorage.setItem('safemom-app-state', JSON.stringify({
        currentScreen: currentScreen,
        calendarData: calendarData
    }));
});

// Load saved state on startup
function loadAppState() {
    const savedState = localStorage.getItem('safemom-app-state');
    if (savedState) {
        const state = JSON.parse(savedState);
        calendarData = state.calendarData || calendarData;
        // Don't restore screen state if user is not logged in
        if (currentUser && state.currentScreen) {
            setTimeout(() => showScreen(state.currentScreen), 100);
        }
    }
}

// Initialize app state loading
setTimeout(loadAppState, 500);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('App error:', e.error);
    showNotification('An error occurred. Please try again.', 'error');
});

// Online/Offline Detection
window.addEventListener('online', function() {
    showNotification('Connection restored', 'success');
});

window.addEventListener('offline', function() {
    showNotification('You are offline. Some features may not work.', 'error');
});

// Debug Console (for development)
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('SAFE MOM App - Development Mode');
    console.log('Mock Backend Data:', mockBackend);
    console.log('Test login: test@test.com / test123');
    console.log('Admin login: admin@safemom.com / admin123');
} 