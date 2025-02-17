
import {
    logAction
} from "../logger.js";

export function toggleInfoPopup() {
    logAction(`${toggleInfoPopup.name}()`, () => {
        const popup = document.getElementById("infoPopup");
        popup.classList.toggle("show");
    });
}
