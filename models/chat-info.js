class Mensaje {
    constructor( uid, nombre, mensaje ) {
        this.uid     = uid;
        this.nombre  = nombre;
        this.mensaje = mensaje;
    }
}


class ChatMensajes {

    constructor() {
        this.mensajes = [];
        this.usuarios = {};
    }

    get ultimos10() {
        if (this.mensajes.length === 10) {
            this.mensajes.shift()
        }
        return this.mensajes;
    }

    get usersArr() {
        return Object.values( this.usuarios ); // [ {}, {}, {}]
    }

    enviarMensaje( uid, nombre, mensaje ) {
        this.mensajes.push(
            new Mensaje(uid, nombre, mensaje)
        );
    }

    conectarUser( usuario ) {
        this.usuarios[usuario.id] = usuario
    }

    desconectarUser( id ) {
        delete this.usuarios[id];
    }

}

module.exports = ChatMensajes;