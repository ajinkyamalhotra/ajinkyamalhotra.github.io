
import {
    logAction
} from "../logger.js";

export function toggleInfoPopup(event) {
    logAction(`${toggleInfoPopup.name}()`, () => {
        const popup = document.getElementById("infoPopup");
        popup.classList.toggle("show");

        document.removeEventListener("click", handleClickOutside);
        function handleClickOutside(event) {
            if (!popup.contains(event.target) && event.target.id !== "infoButton") {
                popup.classList.remove("show");
                document.removeEventListener("click", handleClickOutside);
            }
        }
        document.addEventListener("click", handleClickOutside);
    });
}
