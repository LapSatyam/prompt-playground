const promptInput = document.getElementById("promptInput");
const charCount = document.getElementById("charCount");
const saveBtn = document.getElementById("saveBtn");
const promptList = document.getElementById("promptList");
const toast = document.getElementById("toast");
const searchInput = document.getElementById("searchInput");
const themeBtn = document.getElementById("themeBtn");
const codeBtn = document.getElementById("codeBtn");
const writingBtn = document.getElementById("writingBtn");
const studyBtn = document.getElementById("studyBtn");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const fileInput = document.getElementById("fileInput");



applyTheme(localStorage.getItem("theme") || "light");

let draggedId = null;
let activeCategory = "Code";
let editingId = null;
let prompts = JSON.parse(localStorage.getItem("prompts")) || [];

renderPrompts();

promptInput.addEventListener("input", () => {
    charCount.textContent = `${promptInput.value.length} characters`;
});

saveBtn.addEventListener("click", () => {
    const text = promptInput.value.trim();

    if (!text) return;

    const prompt = {
        id: Date.now(),
        text,
        category: activeCategory,
        favorite: false,
    };

    if (editingId) {
        prompts = prompts.map((prompt) =>
            prompt.id === editingId
                ? { ...prompt, text, category: activeCategory }
                : prompt
        );

        editingId = null;

        saveBtn.textContent = "Save Prompt";
        saveBtn.classList.remove("bg-blue-700");
        saveBtn.classList.add("bg-zinc-900");

        showToast("Prompt updated!")
    } else {
        prompts.push(prompt);
        showToast("Prompt saved!");
    };

    localStorage.setItem("prompts", JSON.stringify(prompts));

    renderPrompts();

    const firstCard = promptList.firstElementChild;
    firstCard.classList.add("animate-fadeIn");

    console.log(prompts);

    promptInput.value = "";
    charCount.textContent = "0 characters";

    showToast("Prompt Saved!");
});

promptInput.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
        saveBtn.click();
    };
});

searchInput.addEventListener("input", () => {
    renderPrompts();
});

themeBtn.addEventListener("click", () => {
    const currentTheme = localStorage.getItem("theme") === "dark" ? "light" : "dark"

    applyTheme(currentTheme);
});

codeBtn.addEventListener("click", () => {
    activeCategory = "Code";
    updateCategoryUI();
});

writingBtn.addEventListener("click", () => {
    activeCategory = "Writing";
    updateCategoryUI();
});

studyBtn.addEventListener("click", () => {
    activeCategory = "Study";
    updateCategoryUI();
});

exportBtn.addEventListener("click", () => {
    const data = JSON.stringify(prompts, null, 2);

    const blob = new Blob([data], { type: "application/json" });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "prompts.json";
    a.click();

    URL.revokeObjectURL(url);

    showToast("Exported!");
});

importBtn.addEventListener("click", () => {
    fileInput.click();
});

fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
        try {
            const importedPrompts = JSON.parse(event.target.result);

            prompts = importedPrompts;

            localStorage.setItem("prompts", JSON.stringify(prompts));
            renderPrompts();
            showToast("Imported!");
        } catch {
            showToast("Invalid JSON File!");
        }
    };

    reader.readAsText(file);
});

promptList.addEventListener("click", (e) => {
    const button = e.target.closest("button");

    if (!button) return;

    const action = button.dataset.action;
    const id = Number(button.dataset.id);
    const text = button.dataset.text;

    if (action === "favorite") {
        toggleFavorite(id);
    }

    if (action === "edit") {
        editPrompt(id);
    }

    if (action === "copy") {
        copyPrompt(id);
    }

    if (action === "delete") {
        deletePrompt(id);
    }
});

promptList.addEventListener("dragstart", (e) => {
    const card = e.target.closest("[data-id]");
    if (!card) return;

    draggedId = Number(card.dataset.id);
});

promptList.addEventListener("dragover", (e) => {
    e.preventDefault();
});

promptList.addEventListener("drop", (e) => {
    const targetCard = e.target.closest("[data-id");
    if (!targetCard || draggedId === null) return;

    const targetId = Number(targetCard.dataset.id);

    const draggedIndex = prompts.findIndex((p) => p.id === draggedId);
    const targetIndex = prompts.findIndex((p) => p.id === targetId);

    const [draggedItem] = prompts.splice(draggedIndex, 1);

    prompts.splice(targetIndex, 0, draggedItem);

    localStorage.setItem("prompts", JSON.stringify(prompts));
    renderPrompts();

    draggedId = null;
});






function renderPrompts() {
    promptList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const filterPrompts = prompts.filter((prompt) => prompt.text.toLowerCase().includes(searchText));

    if (filterPrompts.length === 0) {
        promptList.innerHTML = `
        <div class = "text-center py-16 border border-dashed border-zinc-300 rounded-3xl">
            <div class = "text-5xl mb-4">📝</div>
            <h3 class = "text-lg font-medium">No prompts found</h3>
            <p class = "text-sm text-zinc-500 mt-2">
              Save your first prompt or try another search.
            </p>
        </div>
        `;
        return;
    }

    const sortedPrompts = [...filterPrompts].sort((a, b) => {
        const favoriteDiff = b.favorite - a.favorite;

        if (favoriteDiff !== 0) {
            return favoriteDiff;
        }

        return b.id - a.id;
    });

    sortedPrompts.forEach((prompt) => {

        promptList.innerHTML += `
        <div class="border border-zinc-200 rounded-3xl p-5 hover:shadow-md transition-all duration-300 bg-zinc-50 hover:-translate-y-1"
        draggable = "true"
        data-id = "${prompt.id}">

          <div class = "flex justify-between items-start gap-4">

            <div class = "flex-1">
                <span class = "text-xs font-medium px-3 py-1 rounded-full bg-zinc-100 text-zinc-700 inline-block mb-3">
                ${prompt.category}
                </span>

                <p class = "text-[15px] leading-7 text-zinc-800 wrap-break-word">${prompt.text}
                </p>
            </div>

            <div class = "flex gap-2 shrink-0">

                <button
                data-action = "favorite" data-id = "${prompt.id}"
                class = "w-10 cursor-pointer h-10 flex items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 transition text-lg">
                ${prompt.favorite ? "⭐" : "☆"}    
                </button>

                <button
                data-action = "copy" data-text = "${prompt.text}"
                class = "px-4 cursor-pointer py-2 rounded-full bg-zinc-100 text-sm transition hover:bg-zinc-200">
                Copy
                </button>

                <button
                data-action = "edit" data-id = "${prompt.id}"
                class = "px-4 py-2 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-500 text-sm transition">
                Edit
                </button>

                <button
                data-action = "delete" data-id = "${prompt.id}"
                class = "px-4 cursor-pointer py-2 rounded-full bg-red-50 hover:bg-red-100 text-red-500 text-sm transition">
                Delete
                </button>
            </div>
          </div>
        </div>
        `;
    });
};

function deletePrompt(id) {
    prompts = prompts.filter((prompt) => prompt.id !== id);

    localStorage.setItem("prompts", JSON.stringify(prompts));

    renderPrompts();
    showToast("Prompt Deleted!");
};

function copyPrompt(text) {
    navigator.clipboard.writeText(text);
    showToast("Copied!");
};

function showToast(message) {
    toast.textContent = message;
    toast.classList.remove("opacity-0");

    setTimeout(() => {
        toast.classList.add("opacity-0");
    }, 2000);
};

function updateCategoryUI() {
    const buttons = [codeBtn, writingBtn, studyBtn];

    buttons.forEach((btn) => {
        btn.classList.remove("bg-zinc-900", "text-white");
        btn.classList.add("bg-zinc-100");
    });

    if (activeCategory === "Code") {
        codeBtn.classList.add("bg-zinc-900", "text-white");
        codeBtn.classList.remove("bg-zinc-100");
    }

    if (activeCategory === "Writing") {
        writingBtn.classList.add("bg-zinc-900", "text-white");
        writingBtn.classList.remove("bg-zinc-100");
    }

    if (activeCategory === "Study") {
        studyBtn.classList.add("bg-zinc-900", "text-white");
        studyBtn.classList.remove("bg-zinc-100");
    }
};

function toggleFavorite(id) {
    prompts = prompts.map((prompt) => {
        if (prompt.id === id) {
            return {
                ...prompt,
                favorite: !prompt.favorite,
            };
        }

        return prompt;
    });

    localStorage.setItem("prompts", JSON.stringify(prompts));
    renderPrompts();
};

function editPrompt(id) {
    const prompt = prompts.find((p) => p.id === id);

    if (!prompt) return;

    promptInput.value = prompt.text;
    charCount.textContent = `${prompt.text.length} characters`;

    activeCategory = prompt.category;
    updateCategoryUI();

    editingId = id;

    saveBtn.textContent = "✏️ Update Prompt";
    saveBtn.classList.remove("bg-zinc-900");
    saveBtn.classList.add("bg-zinc-700");

    promptInput.focus();
};

function applyTheme(theme) {
    const isDark = theme === "dark";

    document.body.classList.toggle("bg-zinc-950", isDark);
    document.body.classList.toggle("text-white", isDark);

    document.body.classList.toggle("bg-zinc-50", !isDark);
    document.body.classList.toggle("text-zinc-900", !isDark);

    themeBtn.textContent = isDark ? "☀️" : "🌙";

    localStorage.setItem("theme", theme);
};