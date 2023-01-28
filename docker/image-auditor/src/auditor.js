
const protocol = require ('./auditor-protocol');

/*
Utilisation du module standard de node.js
 */
const dgram = require('dgram');

// Package utilisé pour générer l'uuid
const uuid = require('uuid');

/*
Création du socket UDP
 */
const socket = dgram.createSocket ('udp4');

// Ecoute sur multicast afin de récupérer les datagrammes des musiciens
socket.bind(protocol.PROTOCOL_PORT , function() {
		console.log("Joining multicast group");
		socket.addMembership(protocol.PROTOCOL_MULTICAST_ADDRESS);
});

// fonction appelée quand un datagramme est reçu
socket.on('message', function(msg, source) {
	console.log("Data has arrived: " + msg + ". Source IP: " + source.address +
				". Source port: " + source.port);
});

const music = JSON.parse(msg);
let date = new Date().toJSON();
