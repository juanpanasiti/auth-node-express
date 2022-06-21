if (process.env.ENVIRONMENT === 'dev') {
    require('colors')
}

class Logger {
    constructor() {}
    
    static log(...messages) {
        console.log(messages.join(' '));
    }
    
    static success(...messages){
        
        if (process.env.ENVIRONMENT === 'dev') {
            const head = 'SUCCESS:'.bgGreen.white.bold
            messages = messages.map(msg => msg.toString().green)
            messages = [head, ...messages]
        }
        this.log(...messages)
    }

    static error(...messages){
        
        if (process.env.ENVIRONMENT === 'dev') {
            const head = 'ERROR:'.bgRed.white.bold
            messages = messages.map(msg => msg.toString().red)
            messages = [head, ...messages]
        }
        this.log(...messages)
    }

    static warning(...messages){
        
        if (process.env.ENVIRONMENT === 'dev') {
            const head = 'WARNING:'.bgYellow.white.bold
            messages = messages.map(msg => msg.toString().yellow)
            messages = [head, ...messages]
        }
        this.log(...messages)
    }

    static info(...messages){
        
        if (process.env.ENVIRONMENT === 'dev') {
            const head = 'INFO:'.bgCyan.white.bold
            messages = messages.map(msg => msg.toString().cyan)
            messages = [head, ...messages]
        }
        this.log(...messages)
    }
}

module.exports = Logger;
