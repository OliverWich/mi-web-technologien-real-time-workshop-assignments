const newTimeStamp = () => {
    const date = new Date()
    const day = date.getDate().toString().padStart(2, "0")
    const month = (date.getMonth() + 1).toString().padStart(2, "0")
    const year = date.getFullYear()
    const hour = date.getHours().toString().padStart(2, "0")
    const minute = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    const milliSeconds = date.getMilliseconds().toString().padStart(3, "0")

    return `${day}.${month}.${year} ${hour}:${minute}:${seconds}.${milliSeconds}`
}

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function handleSSERoute(req, res) {
    // TODO Implement

    // TODO 1: Write response head

    // TODO 2: Write initial message

    // TODO 3: Set interval to send messages

    // TODO 4: Handle client disconnect

    // TODO BONUS: Send a progress message
}