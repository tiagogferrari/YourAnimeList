let connection;
let channel;

async function connect() {
  if (connection && connection.isConnected()) {
    return Promise.resolve(channel);
  }

  try {
    connection = await require('amqplib').connect("amqp://localhost");
    process.once('SIGINT', () => { connection.close(); });
    channel = await connection.createChannel();
    return channel;
  } catch (error) {
    console.error('Erro ao conectar ao RabbitMQ:', error);
    throw error;
  }
}

async function createQueue(queue) {
  try {
    const ch = await connect();
    await ch.assertQueue(queue, { durable: true });
    return ch;
  } catch (error) {
    console.error('Erro ao criar fila:', error);
    throw error;
  }
}

async function sendMessageToQueue(queue, message) {
  try {
    const ch = await createQueue(queue);
    await ch.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Mensagem enviada para a fila ${queue}: ${JSON.stringify(message)}`);
  } catch (error) {
    console.error('Erro ao enviar mensagem para a fila:', error);
  } finally {
    // Certifique-se de fechar a conexão após o uso
    if (connection) {
      connection.close();
    }
  }
}

async function consume(queue, callback) {
  try {
    const ch = await createQueue(queue);
    await ch.consume(queue, callback, { noAck: true });
  } catch (error) {
    console.error('Erro ao consumir mensagem da fila:', error);
  } finally {
    // Certifique-se de fechar a conexão após o uso
    if (connection) {
      connection.close();
    }
  }
}

module.exports = {
  sendMessageToQueue,
  consume
};

/*
let channel;

function connect() {
    return require('amqplib').connect("amqp://localhost")
        .then(conn => {
            process.once('SIGINT', () => { conn.close(); });
            return conn.createChannel();
        })
        .then(ch => {
            channel = ch;
            return ch;
        });
}

function createQueue(queue) {
    return new Promise((resolve, reject) => {
        try {
            channel.assertQueue(queue, { durable: true })
                .then(() => resolve(channel))
                .catch(reject);
        } catch (err) {
            reject(err);
        }
    });
}

function sendToQueue(queue, message) {
    connect()
        .then(() => createQueue(queue))
        .then(() => channel.sendToQueue(queue, Buffer.from(JSON.stringify(message))))
        .catch(err => console.log(err))
        .finally(() => {
            // Certifique-se de fechar a conexão e o canal após o uso
            if (channel) {
                channel.close();
            }
        });
}

function consume(queue, callback) {
    connect()
        .then(() => createQueue(queue))
        .then(() => channel.consume(queue, callback, { noAck: true }))
        .catch(err => console.log(err))
        .finally(() => {
            // Certifique-se de fechar a conexão e o canal após o uso
            if (channel) {
                channel.close();
            }
        });
}

module.exports = {
    sendToQueue,
    consume
};
*/