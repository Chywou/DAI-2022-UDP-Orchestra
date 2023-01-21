

const protocol = require('./musician-protocol');

/*
Utilisation du module standard de node.js
 */
const dgram = require('dgram');

/*
Création du socket UDP
 */
const socket = dgram.createSocket('udp4');

// Package utilisé pour générer l'uuid
const uuid = require('uuid');

/*
Tableau associatif pour associer un instrument à un son
 */
const sound = {
    piano : 'ti-ta-ti',
    trumpet : 'pouet',
    flute : 'trulu',
    violin : 'gzi-gzi',
    drum : 'boum-boum'
}
function Musician(instrument) {

    this.sound = sound[instrument];
    this.uuid = uuid.v4();

    Musician.prototype.update = function() {
		
        /*
        Information à envoie
         */
        const music = {
            uuid: this.uuid,
            sound: this.sound
        };
		
		/*
        Sérialisation des informations dans un string JSON
         */
        const payload = JSON.stringify(music);

		/*
        Encapsulation du payload dans un datagrame et envoie à l'adresse multicast
         */
        const message = new Buffer(payload);
        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
            console.log("Sending payload: " + payload + " via port " + socket.address().port);
        });

    }

    /*
     Permet l'envoi du datagrame toutes les 1000ms
     */
    setInterval(this.update.bind(this), 1000);

}

var musician = new Musician(process.argv[2]);