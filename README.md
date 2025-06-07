# SAFE MOM Mobile App

A Progressive Web App (PWA) designed for community safety and mother empowerment. This app can be installed on iOS and Android devices directly from the web browser.

## Features

### 🔐 Authentication
- Secure login system
- User profile management
- Session persistence

### 🏠 Dashboard
- Quick access to all features
- Promotional content display
- Emergency alerts and notifications

### 💬 Messaging
- Community updates
- Safety alerts
- Event notifications

### 📅 Calendar
- Event scheduling
- Community meetings
- Important date tracking

### 👤 Account Management
- Profile editing
- Notification preferences
- Settings customization

### 🚨 Safety Features
- **Emergency Button**: Instant access to emergency services
- **Check-in**: Location-based safety check-ins
- **Suspicious Activity Reporting**: Community safety reporting
- **Event Management**: Community event organization

## Installation

### On Mobile Devices (iOS/Android)

1. Open your mobile browser (Safari on iOS, Chrome on Android)
2. Navigate to the app URL
3. Look for the "Install App" prompt or use browser menu:
   - **iOS Safari**: Tap Share → Add to Home Screen
   - **Android Chrome**: Tap Menu → Add to Home Screen

### Local Development

1. Clone or download the project files
2. Open a terminal in the project directory
3. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```
4. Open your browser and navigate to `http://localhost:8000`

## Usage

### Login Credentials
- **Test User**: `test@test.com` / `test123`
- **Admin User**: `admin@safemom.com` / `admin123`

### Quick Test
Click the "TEST" button on the login screen to auto-fill test credentials.

## App Structure

```
safe-mom-app/
├── index.html          # Main application file
├── styles.css          # App styling
├── app.js             # Application logic
├── manifest.json      # PWA manifest
├── sw.js             # Service worker for offline functionality
└── README.md         # This file
```

## PWA Features

- **Offline Support**: App works without internet connection
- **Installation**: Can be installed like a native app
- **Push Notifications**: Receive important safety alerts
- **App Shortcuts**: Quick access to emergency and check-in features
- **Responsive Design**: Works on all screen sizes

## Technical Details

### Technologies Used
- HTML5
- CSS3 (with CSS Grid and Flexbox)
- Vanilla JavaScript (ES6+)
- PWA APIs (Service Worker, Web Manifest)

### Browser Support
- Chrome 70+
- Safari 12+
- Firefox 70+
- Edge 79+

### Security Features
- HTTPS required for PWA features
- Local storage encryption
- Secure session management

## Mock Backend

The app includes a comprehensive mock backend that simulates:
- User authentication
- Message storage
- Event management
- Profile data persistence

## Customization

### Branding
- Update colors in `styles.css` (primary: `#e91e63`)
- Replace logo text in `index.html`
- Update app name in `manifest.json`

### Features
- Add new screens by creating HTML sections
- Extend functionality in `app.js`
- Customize navigation in bottom nav bar

## Production Deployment

1. Host files on HTTPS server
2. Generate real app icons (72x72 to 512x512 px)
3. Update manifest.json with production URLs
4. Configure real backend API endpoints
5. Set up push notification server
6. Add real emergency service integrations

## Safety Notice

This is a demonstration app. For production use:
- Implement real emergency service integration
- Add proper user authentication and authorization
- Set up secure backend infrastructure
- Comply with local emergency service protocols
- Add data encryption and privacy protections

## Contributing

To add features or fix bugs:
1. Test thoroughly on multiple devices
2. Ensure PWA compliance
3. Maintain mobile-first responsive design
4. Follow accessibility guidelines

## License

This is a demonstration project. Adapt for your specific needs and local regulations.

---

**Emergency Notice**: This demo app should not be used for real emergencies. Always contact your local emergency services directly in case of actual emergencies. 