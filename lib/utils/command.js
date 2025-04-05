function createCommandRegex(commandWithAlias, paramPatterns = []) {

    const [command, alias] = commandWithAlias.split('/').map(cmd => cmd.trim())
    const commandPattern = `(?:~|～)(?:${command}|${alias})`

    const fullPattern = `^${commandPattern}${paramPatterns.map(param => `(\\s+${param}\\s*)?`).join('')}$`
    return new RegExp(fullPattern, 'i')
}

export { createCommandRegex }