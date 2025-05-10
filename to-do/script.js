// Görevleri ve tema ayarını localStorage'dan yükle
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
const theme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', theme);
updateThemeButton();

// Sayfa yüklendiğinde görevleri göster ve tema değiştiriciyi ayarla
document.addEventListener('DOMContentLoaded', () => {
    renderTasks();
    setupThemeToggle();
    setupEnterKey();
});

// Tema değiştirme butonunu ayarla
function setupThemeToggle() {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeButton();
    });
}

// Tema butonunu güncelle
function updateThemeButton() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    themeToggle.textContent = currentTheme === 'light' ? '🌙' : '☀️';
}

// Enter tuşu ile görev ekleme
function setupEnterKey() {
    document.getElementById('taskInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
}

// Yeni görev ekleme
function addTask() {
    const taskInput = document.getElementById('taskInput');
    const taskText = taskInput.value.trim();

    if (taskText) {
        tasks.push({
            id: Date.now(),
            text: taskText,
            completed: false
        });
        saveTasks();
        renderTasks();
        taskInput.value = '';
    }
}

// Görevleri kaydet
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

const toggle = document.getElementById("darkModeToggle");

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");

  // Karanlık mod tercihinin kaydedilmesi
  const isDark = document.body.classList.contains("dark-mode");
  localStorage.setItem("darkMode", isDark);
});

// Sayfa yüklenince daha önceki tercih yüklenir
window.addEventListener("load", () => {
  const savedMode = localStorage.getItem("darkMode");
  if (savedMode === "true") {
    document.body.classList.add("dark-mode");
  }
});

// Görevleri görüntüle
function renderTasks() {
    const taskList = document.getElementById('taskList');
    taskList.innerHTML = '';

    tasks.forEach(task => {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <input type="checkbox" ${task.completed ? 'checked' : ''} 
                   onchange="toggleTask(${task.id})">
            <span>${task.text}</span>
            <div class="task-buttons">
                <button class="edit-btn" onclick="editTask(${task.id})">✏️</button>
                <button class="delete-btn" onclick="deleteTask(${task.id})">Sil</button>
            </div>
        `;

        taskList.appendChild(li);
    });
}

// Görev durumunu değiştir
function toggleTask(id) {
    tasks = tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
}

// Görevi düzenle
function editTask(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    const newText = prompt('Görevi düzenle:', task.text);
    if (newText && newText.trim() !== '') {
        task.text = newText.trim();
        saveTasks();
        renderTasks();
    }
}

// Görevi sil
function deleteTask(id) {
    tasks = tasks.filter(task => task.id !== id);
    saveTasks();
    renderTasks();
} 