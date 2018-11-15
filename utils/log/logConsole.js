import { LogBase } from '../log/logBase.js'

export class ConsoleLog extends LogBase{
    constructor(options){
        super(options)
    }

    error(message, ...params){
        this.rebuildArguments(arguments);
        this.isErrorEnabled() && console.error.apply(console, arguments);
    }

    warn(message, ...params){
        this.rebuildArguments(arguments)
        this.isWarnEnabled() && console.warn.apply(console, arguments)
    }

    info(message, ...params) {
        this.rebuildArguments(arguments)
        this.isInfoEnabled() && console.info.apply(console, arguments);
    }

    log(message, ...params) {
        this.rebuildArguments(arguments)
        this.isLogEnabled() && console.log.apply(console, arguments)
    }
}