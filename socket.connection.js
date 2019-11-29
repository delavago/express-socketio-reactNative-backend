let messages = [];

exports.startMessageingService = (io) => {
    let chat = io
    .of('/chat')//append '/chat' to url to specifically access this point
    .on('connect',socket => {
        socket.emit('welcome', {
            sender: 'Server',
            groupNumber: 0,
            message: 'Welcome to our messaging server'
        })

        socket.on('message',data => messageOperation(data,socket));
    })
}


let messageOperation = (data,socket) => {
    socket.join(`chatRoom${data.groupNumber}`);
    socket.broadcast.to(`chatRoom${data.groupNumber}`).emit('message',data);
}
