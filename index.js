import { eventSource, event_types } from "../../../../script.js";
import { getContext } from "../../../extensions.js";

// settings

const LCPP_SERVER = "127.0.0.1:8080"

// dont touch anything below that

const hashCode = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for (let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

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

eventSource.on(event_types.CHAT_CHANGED, async (id) => {
    await loadChat(id);
})

eventSource.on(event_types.MESSAGE_RECEIVED, async () => {
    await saveChat();
})
