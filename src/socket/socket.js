import {io} from 'socket.io-client';
import {LOCAL_HOST} from '../utils/Strings';
import {useMemo, createContext, useContext} from 'react';
import {useSelector} from 'react-redux';

const SocketContext = createContext();

const SocketProvide = ({children}) => {
  const token = useSelector(state => state.auth.token); // Move useSelector here

  const socket = useMemo(() => {
    if (token) {
      console.log(token, '====socket===');
      return io(LOCAL_HOST, {
        auth: {
          token: token, // Pass the authentication token here
        },
        transports: ['websocket'],
        pingInterval: 1000 * 60 * 5,
        pingTimeout: 1000 * 60 * 3,
      });
    }
    return null;
  }, [token]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

const getSocket = () => useContext(SocketContext);

export {getSocket, SocketProvide};
