#!/usr/bin/env python3
"""
Simple HTTPS server for SAFE MOM PWA
Enables PWA features that require HTTPS
"""

import http.server
import ssl
import socketserver
import os
import sys
from pathlib import Path

# Configuration
PORT = 8000
CERT_FILE = "cert.pem"
KEY_FILE = "key.pem"

class PWAHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with proper headers for PWA"""
    
    def end_headers(self):
        # Add security headers
        self.send_header('X-Content-Type-Options', 'nosniff')
        self.send_header('X-Frame-Options', 'DENY')
        self.send_header('X-XSS-Protection', '1; mode=block')
        
        # PWA-specific headers
        if self.path.endswith('.json'):
            self.send_header('Content-Type', 'application/json')
        elif self.path.endswith('.js'):
            self.send_header('Content-Type', 'application/javascript')
        
        super().end_headers()
    
    def log_message(self, format, *args):
        """Custom logging"""
        print(f"[{self.address_string()}] {format % args}")

def generate_self_signed_cert():
    """Generate a self-signed certificate for local development"""
    try:
        import subprocess
        print("Generating self-signed certificate...")
        
        # Generate private key
        subprocess.run([
            'openssl', 'genrsa', '-out', KEY_FILE, '2048'
        ], check=True)
        
        # Generate certificate
        subprocess.run([
            'openssl', 'req', '-new', '-x509', '-key', KEY_FILE,
            '-out', CERT_FILE, '-days', '365', '-subj',
            '/C=US/ST=State/L=City/O=SafeMom/OU=Dev/CN=localhost'
        ], check=True)
        
        print(f"Certificate generated: {CERT_FILE}")
        return True
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("OpenSSL not found or failed to generate certificate.")
        print("Install OpenSSL or run without HTTPS.")
        return False

def create_http_server():
    """Create HTTP server (fallback)"""
    print(f"Starting HTTP server on port {PORT}")
    print(f"PWA features may not work without HTTPS!")
    print(f"Open: http://localhost:{PORT}")
    
    with socketserver.TCPServer(("", PORT), PWAHTTPRequestHandler) as httpd:
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

def create_https_server():
    """Create HTTPS server with SSL"""
    # Check if certificates exist, generate if not
    if not (Path(CERT_FILE).exists() and Path(KEY_FILE).exists()):
        if not generate_self_signed_cert():
            print("Falling back to HTTP server...")
            create_http_server()
            return
    
    print(f"Starting HTTPS server on port {PORT}")
    print(f"Open: https://localhost:{PORT}")
    print("Note: You may need to accept the self-signed certificate warning")
    
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(CERT_FILE, KEY_FILE)
    
    with socketserver.TCPServer(("", PORT), PWAHTTPRequestHandler) as httpd:
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nServer stopped.")

def main():
    """Main server function"""
    print("SAFE MOM PWA Server")
    print("=" * 30)
    
    # Change to script directory
    os.chdir(Path(__file__).parent)
    
    # Check if index.html exists
    if not Path("index.html").exists():
        print("Error: index.html not found in current directory")
        sys.exit(1)
    
    # Parse command line arguments
    use_https = '--https' in sys.argv or '-s' in sys.argv
    use_http = '--http' in sys.argv or '-h' in sys.argv
    
    if use_http:
        create_http_server()
    elif use_https:
        create_https_server()
    else:
        # Try HTTPS first, fallback to HTTP
        print("Attempting to start HTTPS server...")
        try:
            create_https_server()
        except Exception as e:
            print(f"HTTPS failed: {e}")
            print("Falling back to HTTP...")
            create_http_server()

if __name__ == "__main__":
    main() 