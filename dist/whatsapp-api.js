import { get_chrome_ws } from "./get-puppeteer-url.js";
import { exec as exec_sync } from "child_process";
import whatsapp from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import util from "util";
import puppeteer from "puppeteer";
const exec = util.promisify(exec_sync);
const { Client, LocalAuth, MessageMedia } = whatsapp;
class CustomClient extends Client {
    msg_to_provider(phone, caption, file) {
        if (file === "") {
            return this.sendMessage(phone + "@c.us", caption);
        }
        const msg_option = {};
        if (caption !== "") {
            msg_option.caption = caption;
        }
        const media_msg = MessageMedia.fromFilePath(file);
        return this.sendMessage(phone + "@c.us", media_msg, msg_option);
    }
}
export const client = (async () => {
    const chrome_ws = await get_chrome_ws().catch(async () => {
        exec("start " + puppeteer.executablePath() + " -remote-debugging-port=9222");
        await new Promise(resolve => setTimeout(resolve, 3 * 1000));
    });
    const client = new CustomClient({
        authStrategy: new LocalAuth(),
        puppeteer: {
            browserWSEndpoint: await get_chrome_ws(),
            headless: false
        }
    });
    client.on('qr', qr => {
        qrcode.generate(qr, {
            small: true
        });
    });
    client.on('ready', () => {
        console.log('Client is ready!');
    });
    client.on('message', message => {
        console.log();
        if (message.body.toLowerCase() === 'ping') {
            message.reply('pong');
        }
    });
    return client;
})();
/* const media_msg = MessageMedia.fromFilePath('./logo.png'); */
/*
http://127.0.0.1:9222/json/version
C:\"Program Files (x86)\Microsoft\Edge\Application\msedge.exe" -"remote-debugging-port=9222"
C:\"Program Files\Google\Chrome\Application\chrome.exe" -"remote-debugging-port=9222"
-remote-debugging-port=9222
node_modules\puppeteer\.local-chromium\win64-1022525\chrome-win\chrome.exe -remote-debugging-port=9222
*/ 
//# sourceMappingURL=whatsapp-api.js.map