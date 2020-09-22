class Logger {
  constructor () {
    this._memory = [];
    this.log = this.log.bind(this);
  }

  log (propName) {
    return ([element] = []) => {
      this._memory.push(element[propName]);
    };
  }

  get logs () {
    return this._memory;
  }
}

export default Logger;
