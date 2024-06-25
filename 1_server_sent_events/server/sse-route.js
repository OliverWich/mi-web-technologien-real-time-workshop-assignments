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

const initialData = [
    {
        id: 1,
        title: "Initial Notification 1",
        message: "Initial Message 1, whohoo",
        time: newTimeStamp()
    },
    {
        id: 2,
        title: "Initial Notification 2",
        message: "Initial Message 2, whohoo",
        time: newTimeStamp()
    },
    {
        id: 3,
        title: "Initial Notification 3",
        message: "Initial Message 3, whohoo",
        time: newTimeStamp()
    }
]

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function handleSSERoute(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
    })

    res.write("event: initial\n")
    res.write(`data: ${JSON.stringify(initialData)}\n`)
    res.write("\n")

    let messageId = 10

    const interval = setInterval(() => {
        const newNotification = {
            id: messageId++,
            title: `Message ${messageId}`,
            message: "Another Message, yeah!",
            time: newTimeStamp(),
            duration: 5
        }

        res.write("event: notification\n")
        res.write(`data: ${JSON.stringify(newNotification)}\n`)
        res.write("\n")
    }, 2000)


    const initialProgressNotification = {
        id: 9999,
        title: "Progress Message",
        message: "We are progressing...",
        type: "progress",
        progress: 0,
        time: newTimeStamp()
    }
    res.write("event: notification\n")
    res.write(`data: ${JSON.stringify(initialProgressNotification)}\n`)
    res.write("\n")

    let currentProgress = 0
    const progressInterval = setInterval(() => {
        const progressNotification = {
            id: 9999,
            title: `Progress Notification`,
            message: "Progressing...",
            time: newTimeStamp(),
            type: "progress",
            progress: currentProgress += 10,
        }

        res.write("event: notification-update\n")
        res.write(`data: ${JSON.stringify(progressNotification)}\n`)
        res.write("\n")
    }, 2000)

    req.on("close", () => {
        clearInterval(interval)
        clearInterval(progressInterval)
    })
}
