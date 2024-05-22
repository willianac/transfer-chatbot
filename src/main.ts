import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { login } from "./apis/login";

const wwebVersion = '2.2412.54';
const client = new Client({
    authStrategy: new LocalAuth(), // your authstrategy here
    puppeteer: {
        // puppeteer args here
    },
    // locking the wweb version
    webVersionCache: {
        type: 'remote',
        remotePath: `https://raw.githubusercontent.com/wppconnect-team/wa-version/main/html/${wwebVersion}.html`,
    },
})

client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('qr', qr => {
    qrcode.generate(qr, {small: true});
});

type UserState = {
	step: number,
	data: {
		email?: string,
		password?: string,
		transaction?: {
			amount?: string
		}
	}
}

const userStates = new Map<string, UserState>();

client.on("message", async message => {
	const userId = message.from;
	console.log(userId);
	let userState: UserState | undefined = userStates.get(userId);

	if(!userState) {
		userState = { step: 0, data: {} }
		userStates.set(userId, userState);
	}

	async function trySwitch(step: number) {
		switch (userState?.step) {
			case 0:
				if(message.body === "ping") return client.sendMessage(message.from, "pong");
				setTimeout(() => {
					client.sendMessage(message.from, `Please log in to your account to send money quickly and easily.`);
					client.sendMessage(message.from, "Type your email. ✉️");
				})
				userState.step = 1;
				break;
			case 1:
				userState.data.email = message.body;
				setTimeout(() => {
					client.sendMessage(message.from, "Email received. Now type your password");
				}, 1500);
				userState.step = 2;
				break;
			case 2:
				userState.data.password = message.body;
				client.sendMessage(message.from, "Password Received, wait a moment...")
				const res = await login(userState.data.email!, userState.data.password)
				
				if(res.responsestring.StatusCode._text === "-1") {
					client.sendMessage(message.from, "Wrong credentials")
					userState.step = 0
					break;
				}
				client.sendMessage(message.from, `Hi ${res.responsestring.MoneySender.SenderFirstName._text} ${res.responsestring.MoneySender.SenderLastName._text}`)
				userState.step = 3
				break;
			case 3: 
				client.sendMessage(message.from, "You are in the step four, congrats!")
				break;
			default:
				break;
		}
	}
	await trySwitch(userState.step);
	userStates.set(userId, userState);
})

client.initialize();