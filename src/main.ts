import { Client, LocalAuth } from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import { login } from "./apis/login";
import { LoginResponse } from './types/LoginResponse';

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
		logInfo?: LoginResponse
		transaction?: {
			amount?: string
			receiveUnit?: string
		}
	}
}

const userStates = new Map<string, UserState>();

client.on("message", async message => {
	const userId = message.from;
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
				const result = await login(userState.data.email!, userState.data.password)
				userState.data.logInfo = result
				
				if(result.responsestring.StatusCode._text === "-1") {
					client.sendMessage(message.from, "Wrong credentials")
					userState.step = 0
					break;
				}
				client.sendMessage(message.from, `Hi ${result.responsestring.MoneySender.SenderFirstName._text} ${result.responsestring.MoneySender.SenderLastName._text}`)
				userState.step = 3
			case 3: 
				const optionsResponse = `1. 🇧🇴 Bolivia (BOB)
				2. 🇧🇴 Bolivia Dolar (BOD)
				3. 🇬🇭 Ghana (GHS)
				4. 🇰🇪 Kenya (KES)
				5. 🇳🇬 Nigeria (NGN)
				6. 🇵🇪 Peru Dolar (PED)
				7. 🇵🇪 Peru (PEN)
				8. 🇵🇭 Philippines Dolar (PHD)
				9. 🇵🇭 Philippines (PHP)
				10. 🇺🇬 Uganda (UGX)
				11. XOF (West African CFA franc)
				12. 🇿🇲 Zambia (ZAR)`

				setTimeout(() => {
					client.sendMessage(message.from, "Where do you want to send money? Please, enter the option number.")
					client.sendMessage(message.from, optionsResponse);
				}, 1500)
				userState.step = 4
				break;
			case 4: 
				const option = parseInt(message.body);
				const units = userState.data.logInfo?.responsestring.LinkInfo.ListLandUnit._text.split(",");

				if(option > 0 && option <= units!.length) {
					const response = "You selected option: " + units![option - 1];
					client.sendMessage(message.from, response);
					break;
				}
				client.sendMessage(message.from, "Invalid option. Please enter a valid option number.")
				break;
			default:
				break;
		}
	}
	await trySwitch(userState.step);
	userStates.set(userId, userState);
})

client.initialize();