from http.server import HTTPServer, BaseHTTPRequestHandler
import time
HOST = "127.0.0.1"
PORT = 9999

class myHTTP(BaseHTTPRequestHandler):
    
    def do_GET(self):
        time.sleep(2)
        self.send_response(200)         # sent after diagnostics is completed
        self.send_header("Content-Type","text/html")
        self.end_headers()
        self.wfile.write(bytes("<html><body>hello world</body></html>","utf-8"))

server = HTTPServer((HOST,PORT),myHTTP)
print("Server now running")
server.serve_forever()
server.server_close()
print("Server stopped")