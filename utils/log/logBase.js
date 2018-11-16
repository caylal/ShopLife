import util from '../util'
import { Level } from '../config.js'

const DEFAULT_OPTIONS = {
  name: 'default',
  level: Level.WARN
}

export class LogBase {
  constructor(options){
    let { name, level } = Object.assign({}, DEFAULT_OPTIONS, options);
    this._name = name
    this._level = level
  }

  get level() { return this._level }
  get name() { return this._name }

  isErrorEnabled = () => this.level >= Level.ERROR;
  isWarnEnabled = () => this.level >= Level.WARN;
  isInfoEnabled = () => this.level >= Level.INFO;
  isLogEnabled = () => this.level >= Level.ON

  rebuildArguments(arg){
    arg.length += 1;
    let index = arg.length - 2,
      insertIndex = index;
    while(index >= 0) {
      if(insertIndex > 0) {
        insertIndex = index - 2;
        if(insertIndex < 0) {
          insertIndex = 0;     
        }
      }

      arg[index + 1] = arg[index]
      if(index === insertIndex){
        arg[index] = this.name + ' ' + util.formatTime(new Date()) + ' ' + this.getLevel(this.level) + ':';
        break;
      }
      index --;
    }
  }

  getLevel(level) {
    let result = 'log';
    switch(level) {
      case Level.ERROR:
        result = "error";
        break;
      case Level.INFO:
        result = "info";
        break;
      case Level.WARN: 
        result = "warn";
        break;
      default:
        result = "log";
        break;
    }
    return result;
  }
}