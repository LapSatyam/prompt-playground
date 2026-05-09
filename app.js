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


let activeCategory = "Code";

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
    };

    prompts.push(prompt);

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
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
        themeBtn.textContent = "☀️ Light";
    } else {
        themeBtn.textContent = "🌙 Dark";
    };
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








function renderPrompts() {
    promptList.innerHTML = "";

    const searchText = searchInput.value.toLowerCase();
    const filterPrompts = prompts.filter((prompt) => prompt.text.toLowerCase().includes(searchText));

    if (filterPrompts.length === 0){
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

    [...filterPrompts].reverse().forEach((prompt) => {
        promptList.innerHTML += `
        <div class="border border-zinc-200 rounded-3xl p-5 hover:shadow-md transition-all duration-300 bg-white hover:-translate-y-1">

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
                onclick = "copyPrompt('${prompt.text}')"
                class = "px-4 cursor-pointer py-2 rounded-full bg-zinc-100 text-sm transition hover:bg-zinc-200">
                Copy
                </button>

                <button
                onclick = "deletePrompt(${prompt.id})" 
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
}