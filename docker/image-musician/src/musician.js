

var protocol = require('./musician-protocol');

var dgram = require('dgram');

var socket = dgram.createSocket('udp4');

var uuid = require('uuid');

/*
 * Let's define a javascript class for our thermometer. The constructor accepts
 * a location, an initial temperature and the amplitude of temperature variation
 * at every iteration
 */

var sound = {
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

        var music = {
            uuid: this.uuid,
            sound: this.sound
        };
        var payload = JSON.stringify(music);

        message = new Buffer(payload);
        socket.send(message, 0, message.length, protocol.PROTOCOL_PORT, protocol.PROTOCOL_MULTICAST_ADDRESS, function(err, bytes) {
            console.log("Sending payload: " + payload + " via port " + socket.address().port);
        });

    }


    setInterval(this.update.bind(this), 1000);

}

var musician = new Musician(process.argv[2]);