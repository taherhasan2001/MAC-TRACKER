async function getCurrentAPMac() {
    try {
        const response = await fetch('http://localhost:3000/api/current-ap-mac');
        const data = await response.json();
        return data.macAddress;
    } catch (error) {
        console.error('Error fetching MAC address:', error);
    }
    return null;
}

let currentAddress = "";

async function updateAPInfo() {
    const newMacAddress = await getCurrentAPMac();

    if (newMacAddress && newMacAddress !== currentAddress) {
        currentAddress = newMacAddress;
        let flagGotAP = false;

        const dict = {
            "مكتبة غرفة 1": ["34:fc:b9:2b:96:00", "34:fc:b9:2b:96:10"],
            "مكتبة غرفة 2": ["94:64:24:ad:b5:50"],
            "مكتبة طابق2 غرفة1": ["34:fc:b9:2b:8f:70"],
            "مكتبة طابق2 غرفة2": ["34:fc:b9:2b:8e:50"]
        };

        for (const [key, values] of Object.entries(dict)) {
            if (values.includes(newMacAddress)) {
                document.getElementById('output').innerHTML = `
                    <p>You have moved to:</p>
                    <p>MAC address: ${newMacAddress}</p>
                    <p>AP name: ${key}</p>
                    <p>Please wait for the next update...</p>
                    <p>====================================</p>
                `;
                flagGotAP = true;
                break;
            }
        }

        if (!flagGotAP) {
            document.getElementById('output').innerHTML = `
                <p>You have moved to unknown area:</p>
                <p>MAC address: ${currentAddress}</p>
                <p>Please wait for the next update...</p>
                <p>====================================</p>
            `;
        }
    }
}

setInterval(updateAPInfo, 1000);
