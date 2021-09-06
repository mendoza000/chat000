const ulUsuarios = document.querySelector('#ulUsuarios');
const txtMensaje = document.querySelector('#txtMensaje');
const ulHistorial = document.querySelector('#historial');
const txtMensajeUid = document.querySelector('#txtMensajeUid');

let socket;

const getAuthUser = async (token) => {

	const url = (window.location.hostname === 'localhost')
		? 'http://localhost:8080/api/auth'
		: 'https://restmongo000.herokuapp.com/api/auth'

	const resp = await fetch( url, {
        method: 'GET',
        headers: { 'x-token': token },
    })

    const data = await resp.json()
    if (data.msg) {
    	window.location.pathname = './index.html'
    	localStorage.clear()
    }
   	return data

}

const main = async () => {

	const token = localStorage.getItem('token')
	if (!token) {
		window.location.pathname = './index.html'
	}

	const { user } = await getAuthUser(token)
	console.log(user);

	document.title = user.name


	socket = io({
		'extraHeaders':{
			'x-token': token
		}
	})

	socket.on('connect', () => {

		console.log('Server online');

	})

	socket.on('disconnect', (callback) => {

		console.log('Server offline');

	})

	socket.on('mensaje-global', (payload) => {

		listarMensajes(payload)

	})

	socket.on('mensaje-priv', (payload) => {

		console.log(payload);

	})

	socket.on('users-online', listarUsers)

	const listarMensajes = (mensajes) => {

		let mensajesHtml = ''

		mensajes.forEach(({mensaje, nombre, uid}) => {
			mensajesHtml += `
				<li class="${
					(uid === user.uid)
					? "chat_mensaje_li_me"
					: "chat_mensaje_li"
				}">
					<p class="${
						(uid === user.uid)
						? "chat_mensaje_p_me"
						: "chat_mensaje_p"
					}">
						<span class="chat_name">${
							(uid === user.uid)
							? ""
							: nombre + ":"
						} </span>
						<span>${mensaje}</span>
					</p>
				</li>


			`

		})

		ulHistorial.innerHTML = mensajesHtml

	}

	txtMensaje.addEventListener('keyup', ({keyCode}) => {
		const mensaje = txtMensaje.value
		const uid     = null /*txtMensajeUid.value*/

		if (keyCode !== 13) { return; }
		if (mensaje.length === 0) { return; }

		socket.emit('enviar-mensaje', {mensaje, uid})
		txtMensaje.value = ''
	
	});


} 
const listarUsers = (users) => {

	let usersHtml = ''

	users.forEach(({name, uid}) => {

		usersHtml += `
			<li>
				<p>
					<h5 class="text-success">${name}</h5>
					<span class="fs-6 text-muted">${uid}</span>
				</p>
			</li>


		`

	})

	ulUsuarios.innerHTML = usersHtml

}


main()


