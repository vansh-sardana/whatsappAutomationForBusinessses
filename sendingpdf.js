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
const msgText = fs.readFileSync('msgText.txt', 'utf8').trim(); // Read the CSV file
let start= 564;
let end= 1000;
const csvData = fs.readFileSync('data_2.csv', 'utf8'); // Read the CSV file
const lines = csvData.split("\n"); // Split into lines
let data = [];

function getContacts() {
    for (const line of lines) {
        const values = line.split(",").map(val => val.trim().toString()); // Split and trim efficiently
        try {
            values[0] = values[0].replaceAll(" Swar Manjari", "").replaceAll("Fb", "").replaceAll("Jalsa", "").replaceAll(`"`, "").replaceAll("Sunaina", "").replaceAll("Bhopal", "").replaceAll("Ahmedabad ", "").replaceAll("Rotary", "").replaceAll("Ashoka", "").replaceAll("Roatry", "").replaceAll("Exb ", "");
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
    for (let i = start; i < Math.min(data.length, end); i++) {
        if ((i + 1) % 5 == 0) {
            await new Promise((resolve) => setTimeout(resolve, 2000 + (Math.random() * 5)));
        }
        await new Promise((resolve) => setTimeout(resolve, 2000 + (Math.random() * 2)));
        const number = `91${data[i][1]}`;
        const name = `${data[i][0]}`;
        const msg = `Hi ${name.split(" ")[0]}, ${msgText}`;

        const chatId = number + "@c.us";
        media = MessageMedia.fromFilePath('Mothers_Day.pdf');

        await client.sendMessage(chatId, media, { caption: msg })
        .then(() => {
            console.log(`Message ${count} sent to ${name}!`);
            count++;
        }).catch(err => console.error(err));
    }
}

client.on('ready', () => {
    console.log('Client is ready!');
    sendMsgWithDelay();
});

client.initialize();