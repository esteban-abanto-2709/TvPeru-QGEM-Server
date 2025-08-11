const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m'
};
function formatMessage(level, module, message, error = null) {
    const timestamp = new Date().toISOString();
    const colorMap = {
        INFO: colors.green,
        ERROR: colors.red,
        WARN: colors.yellow,
        DEBUG: colors.blue
    };
    const color = colorMap[level] || colors.reset;
    let logMessage = `${color}[${timestamp}] ${level} [${module}]: ${message}${colors.reset}`;
    if (error) {
        logMessage += `\n${colors.red}Error: ${error.message}${colors.reset}`;
        if (error.stack) {
            logMessage += `\n${colors.red}Stack: ${error.stack}${colors.reset}`;
        }
    }
    return logMessage;
}
export const logger = {
    info: (module, message) => {
        console.log(formatMessage('INFO', module, message));
    },
    error: (module, message, error = null) => {
        console.error(formatMessage('ERROR', module, message, error));
    },
    warn: (module, message) => {
        console.warn(formatMessage('WARN', module, message));
    },
    debug: (module, message) => {
        if (process.env.NODE_ENV === 'development') {
            console.log(formatMessage('DEBUG', module, message));
        }
    }
};
