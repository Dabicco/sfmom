// PWA Installation Helper
let deferredPrompt;
let installButton;

// Initialize installation features
document.addEventListener('DOMContentLoaded', function() {
    createInstallPrompt();
    setupInstallListeners();
});

function createInstallPrompt() {
    // Only show install prompt if not already installed
    if (!window.navigator.standalone && !window.matchMedia('(display-mode: standalone)').matches) {
        const installPrompt = document.createElement('div');
        installPrompt.id = 'install-prompt';
        installPrompt.innerHTML = `
            <div class="install-content">
                <div class="install-icon">📱</div>
                <div class="install-text">
                    <h3>Install SafeMom App</h3>
                    <p>Add to your home screen for quick access</p>
                </div>
                <button id="install-btn" class="install-button">Install</button>
                <button id="dismiss-install" class="dismiss-button">×</button>
            </div>
        `;
        
        // Add styles
        const style = document.createElement('style');
        style.textContent = `
            #install-prompt {
                position: fixed;
                bottom: 100px;
                left: 20px;
                right: 20px;
                background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
                border: 1px solid #e91e63;
                border-radius: 12px;
                padding: 15px;
                z-index: 10000;
                box-shadow: 0 4px 20px rgba(233, 30, 99, 0.3);
                animation: slideUp 0.3s ease;
                display: none;
            }
            
            #install-prompt.show {
                display: block;
            }
            
            .install-content {
                display: flex;
                align-items: center;
                gap: 15px;
            }
            
            .install-icon {
                font-size: 24px;
            }
            
            .install-text {
                flex: 1;
            }
            
            .install-text h3 {
                color: #fff;
                font-size: 16px;
                margin: 0 0 4px 0;
            }
            
            .install-text p {
                color: #999;
                font-size: 14px;
                margin: 0;
            }
            
            .install-button {
                background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 8px;
                font-size: 14px;
                font-weight: bold;
                cursor: pointer;
            }
            
            .dismiss-button {
                background: none;
                border: none;
                color: #999;
                font-size: 18px;
                cursor: pointer;
                padding: 4px 8px;
                margin-left: 8px;
            }
            
            @keyframes slideUp {
                from { transform: translateY(100%); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            @media (display-mode: standalone) {
                #install-prompt { display: none !important; }
            }
        `;
        
        document.head.appendChild(style);
        document.body.appendChild(installPrompt);
        installButton = document.getElementById('install-btn');
        
        // Show prompt after a delay
        setTimeout(() => {
            if (!localStorage.getItem('install-dismissed')) {
                installPrompt.classList.add('show');
            }
        }, 3000);
        
        // Dismiss functionality
        document.getElementById('dismiss-install').addEventListener('click', () => {
            installPrompt.classList.remove('show');
            localStorage.setItem('install-dismissed', 'true');
        });
    }
}

function setupInstallListeners() {
    // Listen for PWA install prompt
    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        
        if (installButton) {
            installButton.style.display = 'block';
        }
    });
    
    // Handle install button click
    document.addEventListener('click', (e) => {
        if (e.target.id === 'install-btn') {
            handleInstallClick();
        }
    });
    
    // Listen for app installed
    window.addEventListener('appinstalled', () => {
        console.log('SafeMom PWA was installed');
        const installPrompt = document.getElementById('install-prompt');
        if (installPrompt) {
            installPrompt.style.display = 'none';
        }
        deferredPrompt = null;
    });
}

function handleInstallClick() {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isStandalone = window.navigator.standalone;
    
    if (isIOS && !isStandalone) {
        // Show iOS-specific install instructions
        showIOSInstallInstructions();
    } else if (deferredPrompt) {
        // Use standard PWA install prompt
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
        });
    } else {
        // Fallback instructions
        showGenericInstallInstructions();
    }
}

function showIOSInstallInstructions() {
    const modal = document.createElement('div');
    modal.innerHTML = `
        <div class="install-modal">
            <div class="install-modal-content">
                <h3>Install SafeMom App</h3>
                <div class="install-steps">
                    <div class="install-step">
                        <div class="step-number">1</div>
                        <div class="step-text">Tap the share button <span class="share-icon">⬆️</span> at the bottom of your screen</div>
                    </div>
                    <div class="install-step">
                        <div class="step-number">2</div>
                        <div class="step-text">Scroll down and tap "Add to Home Screen"</div>
                    </div>
                    <div class="install-step">
                        <div class="step-number">3</div>
                        <div class="step-text">Tap "Add" to install SafeMom</div>
                    </div>
                </div>
                <button class="close-modal">Got it!</button>
            </div>
        </div>
    `;
    
    const style = document.createElement('style');
    style.textContent = `
        .install-modal {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10001;
            padding: 20px;
        }
        
        .install-modal-content {
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border-radius: 12px;
            padding: 30px;
            border: 1px solid #e91e63;
            max-width: 400px;
            text-align: center;
        }
        
        .install-modal h3 {
            color: #fff;
            margin-bottom: 20px;
            font-size: 20px;
        }
        
        .install-steps {
            text-align: left;
            margin-bottom: 25px;
        }
        
        .install-step {
            display: flex;
            align-items: center;
            gap: 15px;
            margin-bottom: 15px;
            padding: 12px;
            background: rgba(233, 30, 99, 0.1);
            border-radius: 8px;
        }
        
        .step-number {
            background: #e91e63;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: bold;
            flex-shrink: 0;
        }
        
        .step-text {
            color: #ccc;
            font-size: 14px;
            line-height: 1.4;
        }
        
        .share-icon {
            background: #007AFF;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 12px;
        }
        
        .close-modal {
            background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
        }
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(modal);
    
    modal.querySelector('.close-modal').addEventListener('click', () => {
        document.body.removeChild(modal);
        document.head.removeChild(style);
    });
}

function showGenericInstallInstructions() {
    alert('To install SafeMom:\n\n• On Chrome: Look for the install icon in the address bar\n• On Safari (iOS): Tap Share → Add to Home Screen\n• On Samsung Internet: Tap Menu → Add page to → Home screen');
}

// Export for use in main app
window.PWAInstaller = {
    handleInstallClick,
    showIOSInstallInstructions
}; 