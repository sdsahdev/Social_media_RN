/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import FirestAnim from './src/Animastions/FirestAnim';
import Draggable from './src/Animastions/Draggable';
import LikeAnimation from './src/Animastions/LikeAnimation';
import SearchbarAnim from './src/Animastions/SearchbarAnim';
import MainNavigator from './src/navigation/MainNavigator';

AppRegistry.registerComponent(appName, () => App);
