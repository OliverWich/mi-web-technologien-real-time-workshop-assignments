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

let id = 0
const initialData = [
    {
        id: id++,
        time: "12.06.2024 13:20",
        title: "Initial Message",
        message: "This is the initial message of this exercise",
    },
    {
        id: id++,
        time: "12.06.2024 13:25",
        title: "Important Message",
        message: "DO NOT PANIC! This is just a test message",
    },
    {
        id: id++,
        time: "13.06.2024 14:33",
        title: "GOOD JOB!",
        message: "You have successfully implemented the SSE endpoint... At least the initial data part :D",
    }
]

/**
 * @param {IncomingMessage} req
 * @param {ServerResponse} res
 */
export function handleSSERoute(req, res) {
    // Write response head
    res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive'
    });

    // Write initial message
    res.write("event initial\n")
    res.write(`data: ${JSON.stringify(initialData)}\n\n`)

    // Set interval to send messages
    let timeout
    function sendMessage() {
        const message = {
            id: id++,
            time: newTimeStamp(),
            title: "Regular Message",
            message: "This is a kinda regular message (it only varies a bit, I swear)"
        }

        res.write(`event: notification\n`)
        res.write(`data: ${JSON.stringify(message)}\n\n`)

        timeout = setTimeout(sendMessage, Math.random() * 1000 + 1000)
    }
    timeout = setTimeout(sendMessage, 1000)

    // Handle client disconnect
    res.on("close", () => {
        clearTimeout(timeout)
    })

    // Send a progress message
    let progress = 0
    const maxProgress = 10
    const progressId = id++

    function sendProgressMessage() {
        const progressMessage = {
            id: progressId,
            time: newTimeStamp(),
            title: "Progress Message",
            message: `This message is progressing over time...`,
            type: "progress",
            progress: progress / maxProgress * 100,
        }
        res.write(`event: ${progress++ ? "notification-update" : "notification"}\n`)
        res.write(`data: ${JSON.stringify(progressMessage)}\n\n`)
    }

    const interval = setInterval(() => {
        sendProgressMessage()

        if (progress <= maxProgress) {
            return;
        }

        clearInterval(interval)
    }, 1000);

    sendProgressMessage()
}