const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PUBLIC = __dirname;
const PORT = 3456;
const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.png': 'image/png',
};

http.createServer((req, res) => {
    let filePath = path.join(PUBLIC, req.url === '/' ? 'index.html' : req.url);
    const ext = path.extname(filePath);
    fs.readFile(filePath, (err, data) => {
        if (err) { res.writeHead(404); res.end('404'); return; }
        res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
        res.end(data);
    });
}).listen(PORT, () => {
    console.log(`Server on http://localhost:${PORT}`);
    // Try to deploy using surge with generated credentials
    try {
        const email = 'lt-entrenamientos-' + Date.now() + '@temp.mail';
        const pass = Math.random().toString(36).slice(2) + 'A1!';
        console.log('Creating surge account...');
        const result = execSync(`npx.cmd surge --email "${email}" --password "${pass}" --domain lt-entrenamientos.surge.sh`, {
            cwd: PUBLIC,
            timeout: 30000,
            stdio: 'pipe'
        });
        console.log(result.stdout.toString());
        console.log('DEPLOYED! https://lt-entrenamientos.surge.sh');
    } catch (e) {
        console.log('Surge failed:', e.message);
        console.log('Fallback: use localtunnel');
        require('localtunnel')({ port: PORT }).then(t => {
            console.log('TEMP URL: ' + t.url);
        });
    }
});