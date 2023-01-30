
const protocol = require ('./auditor-protocol');

/*
Utilisation du module standard de node.js
*/
const dgram = require('dgram');

/*
Librairie qui permet de manipuler des dates
 */
const dayjs = require('dayjs')

/*
Module permettant de créer un serveur TCP
 */
const net = require('net')

/*
Création du socket UDP
 */
const socketUDP = dgram.createSocket ('udp4');

/*
Tableau associatif pour associer un son à un instrument
 */
const instrument = {
	'ti-ta-ti' : 'piano',
	'pouet' : 'trumpet',
	'trulu' : 'flute',
	'gzi-gzi' : 'violin',
	'boum-boum' : 'drum'
}

/*
Les musiciens qui sont écoutés
 */
var musicians = new Map();

// S'inscrit à l'adresse multicast afin de récupérer les datagrammes des musiciens
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

	// Ajout/mise à jour du musicien écouté
	musicians.set(temp.uuid, musician);
});

// Création du serveur TCP
const serverTCP = net.createServer();
serverTCP.listen(protocol.PROTOCOL_PORT_TCP);

// Action réalisée quand un client se connecte au serveur TCP
serverTCP.on('connection', (socket) => {
	const currentTime = dayjs();
	// Supprime les musiciens inactifs
	musicians.forEach((value, key) => {
		console.log(value.activeSince);
		if(currentTime.diff(value.activeSince) > protocol.ACTIVE_TIME) {
			musicians.delete(key);
		}
	});
	// Envoie les musiciens actifs
	socket.write(JSON.stringify(Array.from(musicians.values())));
	socket.destroy();
});


