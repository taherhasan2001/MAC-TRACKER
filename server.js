const express = require('express');
const cors = require('cors');  // Importing cors middleware
const { execSync } = require('child_process');
const os = require('os');
const path = require('path');
const app = express();
const port = 3000;

app.use(cors());  // Using cors middleware
app.use(express.static(path.join(__dirname, 'public')));

const dict = {
    "مكتبة غرفة 1": ["34:fc:b9:2b:96:00", "34:fc:b9:2b:96:10"],
    "مكتبة غرفة 2": ["94:64:24:ad:b5:50"],
    "مكتبة طابق2 غرفة1": ["34:fc:b9:2b:8f:70"],
    "مكتبة طابق2 غرفة2": ["34:fc:b9:2b:8e:50"]
};

function getCurrentAPMac() {
    try {
        if (os.platform() === 'win32') {
            const result = execSync('netsh wlan show interfaces', { encoding: 'utf-8' });
            const lines = result.split('\n');
            for (const line of lines) {
                if (line.includes('BSSID')) {
                    const parts = line.split(':');
                    return parts.slice(1).join(':').trim();
                }
            }
        } else if (os.platform() === 'linux' || os.platform() === 'darwin') {
            const result = execSync('nmcli -t -f ACTIVE,BSSID device wifi', { encoding: 'utf-8' });
            const lines = result.split('\n');
            for (const line of lines) {
                if (line.startsWith('yes')) {
                    return line.split(':')[1].trim();
                }
            }
        }
    } catch (e) {
        console.error(`An error occurred: ${e}`);
    }
    return null;
}

app.get('/api/current-ap-mac', (req, res) => {
    const macAddress = getCurrentAPMac();
    res.json({ macAddress });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
