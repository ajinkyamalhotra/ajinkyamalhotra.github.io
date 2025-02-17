import {
    logAction
} from "../logger.js";

export function initContentSearch({ searchContainer, searchIcon,
    searchBox, contentDiv, matchCounter }) {
    logAction(`${initContentSearch.name}()`, () => {
        let currentMatchIndex = 0;

        function highlightText(searchTerm) {
            clearHighlights();
            if (!searchTerm) return;
            const regex = new RegExp(`(${searchTerm})`, "gi");

            function walkNodes(node) {
                if (node.nodeType === 3) {
                    const match = node.nodeValue.match(regex);
                    if (match) {
                        const newHTML = node.nodeValue.replace(
                            regex, '<mark>$1</mark>');
                        const tempElement = document.createElement("span");
                        tempElement.innerHTML = newHTML;
                        while (tempElement.firstChild) {
                            node.parentNode.insertBefore(
                                tempElement.firstChild, node);
                        }
                        node.remove();
                    }
                } else if (node.nodeType === 1 && node.childNodes.length > 0) {
                    node.childNodes.forEach(walkNodes);
                }
            }

            walkNodes(contentDiv);
        }

        function clearHighlights() {
            contentDiv.querySelectorAll("mark").forEach((mark) => {
                const parent = mark.parentNode;
                parent.replaceChild(
                    document.createTextNode(mark.textContent), mark);
                parent.normalize();
            });
        }

        function updateMatchCounter(marks) {
            if (!searchBox.value.trim()) {
                matchCounter.textContent = "";
                return;
            }
            if (marks.length === 0) {
                matchCounter.textContent = "0 of 0";
            } else {
                matchCounter.textContent =
                    `${currentMatchIndex + 1} of ${marks.length}`;
            }
        }

        // Toggle search input visibility
        searchIcon.addEventListener("click", (event) => {
            searchContainer.classList.toggle("showSearch");
            searchBox.focus();
            highlightText(searchBox.value.trim());
            event.stopPropagation();
        });

        searchBox.addEventListener("click", (event) => event.stopPropagation());

        document.addEventListener("mousedown", (event) => {
            if (event.target.closest("mark")) {
                event.preventDefault();
            }
        }, true);

        document.addEventListener("click", (event) => {
            if (event.target.tagName.toLowerCase() !== "mark") {
                searchBox.blur();
                searchContainer.classList.remove("showSearch");
                clearHighlights();
                searchBox.value = "";
                matchCounter.textContent = "";
            }
        });

        searchBox.addEventListener("input", () => {
            clearHighlights();
            const searchTerm = searchBox.value.trim();
            if (!searchTerm) {
                matchCounter.textContent = "";
                return;
            }
            highlightText(searchTerm);
            const marks = contentDiv.querySelectorAll("mark");
            if (marks.length > 0) {
                currentMatchIndex = 0;
                marks[currentMatchIndex].classList.add("active-match");
                marks[currentMatchIndex].scrollIntoView(
                    { behavior: "smooth", block: "center" });
            }
            updateMatchCounter(marks);
        });

        searchBox.addEventListener("keydown", (e) => {
            const marks = contentDiv.querySelectorAll("mark");
            if (e.key === "Enter") {
                e.preventDefault();
                if (marks.length === 0) return;
                marks[currentMatchIndex].classList.remove("active-match");
                if (e.shiftKey) {
                    currentMatchIndex =
                        (currentMatchIndex - 1 + marks.length) % marks.length;
                } else {
                    currentMatchIndex = (currentMatchIndex + 1) % marks.length;
                }
                marks[currentMatchIndex].classList.add("active-match");
                marks[currentMatchIndex].scrollIntoView(
                    { behavior: "smooth", block: "center" });
                updateMatchCounter(marks);
            } else if (e.key === "Escape") {
                e.preventDefault();
                searchBox.blur();
                clearHighlights();
                searchBox.value = "";
                matchCounter.textContent = "";
            }
        });
    });
}
