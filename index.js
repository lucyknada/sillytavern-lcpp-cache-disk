import { eventSource, event_types } from "../../../../script.js";

// settings

const LCPP_SERVER = "127.0.0.1:8080"

// dont touch anything below that

function hashCode(s) {
    return s.split("").reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
}

const saveChat = (id) => {
    fetch(`http://${LCPP_SERVER}/slots/0?action=restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"filename":"${hashCode(id)}.bin"}`
    })
}

const loadChat = (id) => {
    fetch(`http://${LCPP_SERVER}/slots/0?action=restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"filename":"${hashCode(id)}.bin"}`
    })
}

eventSource.on(event_types.CHAT_CHANGED, loadChat)
eventSource.on(event_types.MESSAGE_RECEIVED, saveChat)
eventSource.on(event_types.MESSAGE_SENT, saveChat)
