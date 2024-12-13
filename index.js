// import { getContext } from "../../../extensions.js";

// settings

const LCPP_SERVER = "127.0.0.1:8080"

// dont touch anything below that

function hashCode(s) {
    return s.split("").reduce(function (a, b) {
        a = ((a << 5) - a) + b.charCodeAt(0);
        return a & a;
    }, 0);
}

const saveChat = async () => {
    await fetch(`http://${LCPP_SERVER}/slots/0?action=save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"filename":"${hashCode(getContext().chatId)}.bin"}`
    })
}

const loadChat = async (id) => {
    const req = await fetch(`http://${LCPP_SERVER}/slots/0?action=restore`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: `{"filename":"${hashCode(id)}.bin"}`
    })
    if (!req.ok) {
        await saveChat()
    }
}

eventSource.on(event_types.CHAT_CHANGED, (id) => {
    (async () => {
        loadChat(id);
    })
})
eventSource.on(event_types.MESSAGE_RECEIVED, () => {
    (async () => {
        saveChat();
    })
})
