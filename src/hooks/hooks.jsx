import { useEffect } from "react"

export const useSocketEvents = (socket , handlers) => {
    useEffect(() => {

        Object.entries(handlers).forEach(([event, handler]) => {
            socket.on(event , handler)
        });
        return() => {
            Object.entries(handlers).forEach(([event, handler]) => {
                socket.off(event , handler)
            });
        }
    },[socket, handlers]);
} 