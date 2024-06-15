import {addToTable, resetTable, flashNotification, updateFlashNotification} from './client-utils.js'

// Connect to the server-sent events endpoint
const eventSource = new EventSource('http://localhost:4000/sse');
// Listen for initial data
eventSource.addEventListener("initial", sse => {
    resetTable()
    const data = JSON.parse(sse.data)
    data.forEach(notification => {
        addToTable(notification)
    })
})
// Listen for new notifications
eventSource.addEventListener("notification", sse => {
    const notification = JSON.parse(sse.data)
    addToTable(notification)
    flashNotification(notification)
})
// Listen for updated notifications
eventSource.addEventListener("notification-update", sse => {
    const notification = JSON.parse(sse.data)
    updateFlashNotification(notification)
})