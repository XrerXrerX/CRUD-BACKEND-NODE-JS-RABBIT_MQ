require('dotenv').config();
const amqp = require('amqplib');
const PlaylistService = require('./PlaylistService');
const MailSender = require('./MailSender');
const Listener = require('./listener');

const init = async () => {
    const playlistservice = new PlaylistService();
    const mailSender = new MailSender();
    const listener = new Listener(playlistservice, mailSender);

    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = await connection.createChannel();

    await channel.assertQueue('export:playlist', {
        durable: true,
    });

    channel.consume('export:playlist', listener.listen, { noAck: true });
};

init();