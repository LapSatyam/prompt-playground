const promptInput = document.getElementById("promptInput");
const charCount = document.getElementById("charCount");
const saveBtn = document.getElementById("saveBtn");
const promptList = document.getElementById("promptList");

let prompts = JSON.parse(localStorage.getItem("prompts")) || [];
renderPrompts();

promptInput.addEventListener("input", () => {
    charCount.textContent = `${promptInput.value.length} characters`
});

function renderPrompts() {
    promptList.innerHTML = "";

    prompts.forEach((prompt) => {
        promptList.innerHTML += `
        <div class="border border-zinc-200 rounded-2xl p-4">
        <p class = "text-sm">${prompt.text}</p>

        <button
        onclick = "deletePrompt(${prompt.id})" 
        class = "text-sm text-red-500">
        Delete
        </button>
        </div>
        `;
    });
};

function deletePrompt(id){
    prompts = prompts.filter((prompt) => prompt.id !== id);

    localStorage.setItem("prompts", JSON.stringify(prompts));

    renderPrompts();
}

saveBtn.addEventListener("click", () => {
    const text = promptInput.value.trim();

    if (!text) return;

    const prompt = {
        id: Date.now(),
        text,
    };

    prompts.push(prompt);

    localStorage.setItem("prompts", JSON.stringify(prompts));

    renderPrompts();

    console.log(prompts);

    promptInput.value = "";
    charCount.textContent = "0 characters";
});
