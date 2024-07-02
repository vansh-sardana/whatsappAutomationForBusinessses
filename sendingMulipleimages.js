const { MessageMedia, Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');

const wwebVersion = '2.2407.3';
const client = new Client({
    authStrategy: new LocalAuth(), // your authstrategy here
    puppeteer: {
        // puppeteer args here
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
});
let count = 0;
const msgText = fs.readFileSync('msgText.txt', 'utf8'); // Read the CSV file

const csvData = fs.readFileSync('CUSTOMER_LIST_1.csv', 'utf8'); // Read the CSV file
const lines = csvData.split("\n"); // Split into lines
let data = [];

function getContacts() {

    for (const line of lines) {
        const values = line.split(",").map(val => val.trim().toString()); // Split and trim efficiently
        try {
            values[0] = values[0].replaceAll(" Swar Manjari", "").replaceAll("Fb", "").replaceAll("Jalsa", "").replaceAll(`"`, "");
            values[1] = values[1].replaceAll("-", "");
        }
        catch (e) {
            continue;
        }

        data.push(values);
    }

    for (const line of data) {
        console.log(line);
    }
}
getContacts();
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

async function sendMsgWithDelay() {
    for (let i = 0; i < data.length; i++) {
        if((i+1)%5==0){
            await new Promise((resolve) => setTimeout(resolve, 5000+(Math.random()*15)));
        }
        await new Promise((resolve) => setTimeout(resolve, 3000+(Math.random()*10)));
        const number = `91${data[i][1]}`;
        const name = `${data[i][0]}`;
        const msg = `Hi ${name.split(" ")[0]},
${msgText}`;

        const chatId = number + "@c.us";
        for (let j = 1; j <= 5; j++) {
            let options = {};
            if (j === 1) {
                options = { caption: msg };
            }
            const imagePath = `mediafiles/image${j}.jpg`;
            const media = MessageMedia.fromFilePath(imagePath);
            await client.sendMessage(chatId, media, options)
            .then(async () => {
                await new Promise((resolve) => setTimeout(resolve, 3000+(Math.random()*10)));
                console.log(`Message ${count} sent to ${name}!`);
                count++;
            })
            .catch(err => console.error(err));
        }
    }
}

client.on('ready', () => {
    console.log('Client is ready!');


    sendMsgWithDelay();

});

client.initialize();