
const protocol = require ('./auditor-protocol');

/*
Utilisation du module standard de node.js
 */
const dgram = require('dgram');

const dayjs = require('dayjs')

const net = require('net')

/*
Création du socket UDP
 */
const socketUDP = dgram.createSocket ('udp4');

const instrument = {
	'ti-ta-ti' : 'piano',
	'pouet' : 'trumpet',
	'trulu' : 'flute',
	'gzi-gzi' : 'violin',
	'boum-boum' : 'drum'
}

var musicians = new Map();

// Ecoute sur le multicast afin de récupérer les datagrammes des musiciens
socketUDP.bind(protocol.PROTOCOL_PORT_UDP, () => {
		console.log("Joining multicast group");
		socketUDP.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

// Fonction appelée quand un datagramme est reçu
socketUDP.on('message', (msg, source) => {
	let temp = JSON.parse(msg.toString());

	// Information à stocker
	let musician = {
		uuid : temp.uuid,
		instrument: instrument[temp.sound],
		activeSince : dayjs().format('YYYY-MM-DD HH:mm:ss.SSS')
	};

	console.log("Data has arrived: " + msg + ". Source IP: " + source.address + ". Source port: " + source.port);
	musicians.set(temp.uuid, musician);
});

const serverTCP = net.createServer();
serverTCP.listen(protocol.PROTOCOL_PORT_TCP);

serverTCP.on('connection', (socket) => {
	const currentTime = dayjs();
	musicians.forEach((value, key) => {
		console.log(value.activeSince);
		if(currentTime.diff(value.activeSince) > protocol.ACTIVE_TIME) {
			musicians.delete(key);
		}
	});
	socket.write(JSON.stringify(Array.from(musicians.values())));
	socket.destroy();
});


