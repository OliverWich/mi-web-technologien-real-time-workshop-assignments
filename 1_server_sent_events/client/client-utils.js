const tableBody = document.querySelector('#notifications-table tbody')
const flashNotifications = document.querySelector('#flash-notifications')

export function resetTable() {
    tableBody.innerHTML = ''
}

export function addToTable(notification) {
    const row = document.createElement('tr')
    const timeCell = document.createElement('td')
    const titleCell = document.createElement('td')
    const messageCell = document.createElement('td')

    timeCell.textContent = notification.time
    titleCell.textContent = notification.title
    messageCell.textContent = notification.message

    row.appendChild(timeCell)
    row.appendChild(titleCell)
    row.appendChild(messageCell)

    tableBody.appendChild(row)
}

function removeFlashNotificationIn(flashNotification, duration=1) {
    setTimeout(() => {
        flashNotification.animate([
            {transform: 'translateX(0%)', opacity: 1},
            {transform: 'translateX(100%)', opacity: 0}
        ], {
            duration: 400,
            easing: 'ease-out'
        }).addEventListener('finish', () => {
            flashNotification.remove()
        })
    }, duration * 1000)
}

export function flashNotification(notification) {
    const flashNotification = document.createElement('div')
    flashNotification.id = `flash-notification-${notification.id}`
    flashNotification.classList.add('flash-notification')
    const title = document.createElement('h4')
    title.textContent = notification.title
    const message = document.createElement('p')
    message.textContent = notification.message

    flashNotification.appendChild(title)
    flashNotification.appendChild(message)

    if (notification.type === "progress") {
        const progress = document.createElement('div')
        progress.classList.add('progress')
        const progressBar = document.createElement('div')
        progressBar.classList.add('progress-bar')
        progressBar.style.width = notification.progress + '%'
        progress.appendChild(progressBar)
        flashNotification.appendChild(progress)
    } else {
        removeFlashNotificationIn(flashNotification, notification.duration)
    }

    flashNotifications.appendChild(flashNotification)
}

export function updateFlashNotification(notification) {
    const flashNotification = document.querySelector(`#flash-notification-${notification.id}`)
    if (!flashNotification) return

    const progressBar = flashNotification.querySelector('.progress-bar')
    if(!progressBar) return
    progressBar.style.width = Math.min(100, notification.progress) + '%'

    if (notification.progress < 100) {
        return;
    }
    removeFlashNotificationIn(flashNotification, notification.duration)
}