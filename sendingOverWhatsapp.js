const { MessageMedia, Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const fs = require('fs');
let start = 700; end = 1200;
//-962, 3200-3900

const wwebVersion = '2.3000.1011643235';
const client = new Client({
    webVersion: "2.3000.1011643235",
    authStrategy: new LocalAuth(),
    puppeteer: {
        executablePath: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
    },
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
});
let count = 0;

//In **msgText.txt** file, write the message to be sent
const msgText = fs.readFileSync('msgText.txt', 'utf8');

//In **new_cust_list.csv** file, contact numbers should be there
const csvData = fs.readFileSync('new_cust_list.csv', 'utf8'); // Read the CSV file
const lines = csvData.split("\n");
let contacts = [];

//Fixing contacts, nothing to change here
//*****
let index=0;
function getContacts() {
    for (const line of lines) {
        index++;
        const values = line.split(",").map(val => val.trim().toString()); // Split and trim efficiently
        try {
            values[0] = values[0].toLowerCase().replaceAll(" swar manjari", "").replaceAll(" fbd", "").replaceAll(" fb", "").replaceAll("jalsa", "").replaceAll(`"`, "").replaceAll("sunaina", "").replaceAll("bhopal", "").replaceAll("ahmedabad ", "").replaceAll("rotary", "").replaceAll("ashoka", "").replaceAll("roatry", "").replaceAll("exb ", "").replaceAll("agency", "").replaceAll("customer", "").replaceAll("dlf", "").replaceAll("dr ", "").replaceAll("dr. ", "").replaceAll("gv ", "").replaceAll("mrs ", "").replaceAll("volunteer", "").replaceAll("k ", "");
            if (values[0].includes(".")) {
                values[0] = values[0].split(".")[0];
            }
            values[0] = values[0].split(" ")[0].replace(/[^a-zA-Z]/g, '');
            values[0] = values[0].charAt(0).toUpperCase() + values[0].slice(1);
            if (values[0].length <= 3) {
                values[0] = "";
            }
            values[1] = values[1].replaceAll("-", "");
            if (values[1].length == 12 && (values[1].startsWith('91') || values[1].startsWith('+1'))) {
                values[1] = values[1].slice(2);
            }
            if (values[1].length == 11 && values[1].startsWith('0')) {
                values[1] = values[1].slice(1)
            }
            if (values[1].length != 10) {
                console.log("Removed: ", index, " ", values[0]," ",values[1]);
                continue;
            }
        }
        catch (e) {
            console.log("Error: ", index, " ", values[0]," ",values[1]);
            continue;
        }
        contacts.push(values);
    }
    // console.log(contacts);
}
getContacts();

async function sendMsgWithDelay() {
    for (let i = start; i < Math.min(contacts.length, end); i++) {
        if ((i + 1) % 5 == 0) {
            await new Promise((resolve) => setTimeout(resolve, 2000 + (Math.random() * 2000)));
        }
        await new Promise((resolve) => setTimeout(resolve, 4000 + (Math.random() * 3000)));
        const number = `91${contacts[i][1]}`;
        const name = `${contacts[i][0]}`;
        const msg = `${msgText}`;
        const chatId = number + "@c.us";

        //******** from here

        media = MessageMedia.fromFilePath('mediafiles/day1.pdf');
        await client.sendMessage(chatId, media, {caption: msg})
            .then(() => {
                console.log(`${i}: Message ${count} sent to ${name}!`);
                count++;
            })
            .catch(err => console.error(err));

        //******** till here

        //For sending multiple images/ videos/ pdf
        //In the folder named mediafiles, put all the images by the name of image1, image2, .....

        //*********From here

        // const n = 9;
        // for (let j = 1; j <= n; j++) {
        //     let options = {};
        //     if (j === 1) {
        //         options = { caption: msg };
        //     }
        //     const imagePath = `mediafiles/Image${j}.jpg`;
        //     const media = MessageMedia.fromFilePath(imagePath);
        //     await client.sendMessage(chatId, media, options)
        //         .then(async () => {
        //             await new Promise((resolve) => setTimeout(resolve, 2000 + (Math.random() * 2000)));
        //             console.log(`${i}: Message ${count} sent to ${name}!`);
        //             count++;
        //         })
        //         .catch(err => console.error(err));
        // }

        //******** Till here
    }
    console.log("I am done");
}

//In order to generate QRcode
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

//In order to start the code once the whatsapp is logged in and ready to send msg
client.on('ready', () => {
    console.log('Client is ready!');

    sendMsgWithDelay();
});

client.initialize();