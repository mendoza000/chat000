const ChatMensajes = require('../models/chat-info'); 

const comprobarJWT = require('../helpers/comprobar-jwt');

const chatMensajes = new ChatMensajes()

const socketController = async (socket, io) => {

	const token = socket.handshake.headers['x-token']

	if (!token) {
		return console.error('El token no esta en la peticion')
	}

	const user = await comprobarJWT(token)
	
	// Agregar usuario conectado a la lita
	chatMensajes.conectarUser(user)
	io.emit('users-online', chatMensajes.usersArr)
	// enviamos el historial de mensajes que haya
	io.emit('mensaje-global', chatMensajes.ultimos10)

	// Eliminar al usuario cuando se desconecte
	socket.on('disconnect', () => {
		chatMensajes.desconectarUser(user.id)
		io.emit('users-online', chatMensajes.usersArr)
	})

	// agregar usuario a una sala especial
	socket.join(user.id)

	// Enviar mensaje global
	socket.on('enviar-mensaje', ({mensaje, uid, by}) => {

		if(uid){
			socket.to(uid).emit('mensaje-priv', {de: user.name, mensaje, by})
			return
		}

		chatMensajes.enviarMensaje(user.id, user.name, mensaje, by)
		io.emit('mensaje-global', chatMensajes.ultimos10)

	})


}

module.exports = {socketController}