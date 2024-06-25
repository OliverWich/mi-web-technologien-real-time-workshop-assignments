import {addToTable, resetTable, flashNotification, updateFlashNotification} from './client-utils.js'

const eventSource = new EventSource('http://localhost:4000/sse');

eventSource.addEventListener('initial', (event) => {
    const initialData = event.data

    if (initialData) {
        const parsedData = JSON.parse(initialData)
        resetTable()
        parsedData.forEach((notification) => {
            addToTable(notification)
        })
    }
})

eventSource.addEventListener('notification', (event) => {
    const data = event.data

    if (data) {
        const parsedData = JSON.parse(data)
        flashNotification(parsedData)
        addToTable(parsedData)
    }
})

eventSource.addEventListener('notification-update', (event) => {
    const data = event.data

    if (data) {
        const parsedData = JSON.parse(data)
        updateFlashNotification(parsedData)
    }
})
