/**
 * @format
 */
import 'react-native-gesture-handler';
import {AppRegistry} from 'react-native';
import App from './src/App';
import {name as appName} from './app.json';
import AuthContext from './src/Component/ContextApi/AuthContext/AuthContext';


const AppWithAuthProvider = () => (
  
    <AuthContext>
      <App />
    </AuthContext>
    
  );

AppRegistry.registerComponent(appName, () => AppWithAuthProvider);
