const { Socket } = require("socket.io");
const { comprobarJWT } = require("../helpers/generar-JWT");
const { ChatMensajes } = require("../models");

chatMensajes = new ChatMensajes();

const socketController = async( socket = new Socket(), io) => {
    const usuario = await comprobarJWT( socket.handshake.headers['x-token'] );
    if ( !usuario ) {
        return socket.disconnect();
    }
    // console.log( 'Se conecto '+ usuario.nombre );
    // Agregar el Usuario coenctado
    chatMensajes.conectarUsuario(usuario);
    io.emit('usuarios-activos', chatMensajes.usuarioArr);
    socket.emit('recibir-mensaje',chatMensajes.ultimos10M);

    //Conectarlo a una sala especial
    socket.join( usuario.id );


    // desconectar usuarios
    socket.on('disconnect', () => {
        chatMensajes.desconectarUsuario(usuario.id);
        io.emit( 'usuarios-activos', chatMensajes.usuarioArr );
    });

    socket.on('enviar-mensaje', ({ uid, mensaje }) => {
        if (uid) {
            //mensaje privado
            socket.to( uid ).emit('mensaje-privado', { de: usuario.nombre, mensaje});
        }{
            chatMensajes.enviarMensaje( usuario.id, usuario.nombre, mensaje );
            io.emit('recibir-mensaje',chatMensajes.ultimos10M);
        }
    });


}

module.exports = {
    socketController
}