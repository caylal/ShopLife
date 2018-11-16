import { logConfig, Level } from '../config.js'
import { ConsoleLog } from '../log/logConsole'

export  class logFactory{
   static get(name) {
        let result, key;
        if(!!name && typeof name === 'string'){
            key = !!name ? name : 'default'
        }
        let lschema = logConfig[key];
        if(!lschema){
            lschema = logConfig['default']
        }

        const level = !!lschema.level ? lschema.level : 'on';
        const type = !!lschema.type ? lschema.type : 'console';
        if(type === 'console'){
            result = new ConsoleLog({
              name: key,
              level: logFactory.transeLevel(level)
            });
        }
        return result;
    }

    static transeLevel(level) {
        let result = Level.OFF;
        switch(level.toLowerCase()){
            case 'on':
                result = Level.ON;
                break;
            case 'info':
                result = Level.INFO;
                break;
            case 'warn': 
                result = Level.WARN;
                break;
            case 'error':
                result = Level.ERROR;
                break;
            default:
                result = Level.OFF;
                break; 
        }
        return result;
    }
}