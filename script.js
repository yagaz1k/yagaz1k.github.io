// Данные кейсов (в реальности приходят с сервера)
const casesData = [
    { id: 1, name: 'Crimson Leaf', price: 39, color: '#8b0000' },
    { id: 2, name: 'Morpheus', price: 79, color: '#32cd32' },
    { id: 3, name: 'Minion', price: 99, color: '#ffd700' },
    { id: 4, name: 'Input Lag', price: 167, color: '#ff8c00' },
    { id: 5, name: 'Rainy Evening', price: 349, color: '#4682b4' },
];

// Данные предметов (что может выпасть)
const itemsPool = [
    { name: 'AK-47 | Redline', rarity: 'Classified', color: '#d32ce6', icon: '🔫' },
    { name: 'AWP | Dragon Lore', rarity: 'Covert', color: '#eb4b4b', icon: '🎯' },
    { name: 'Glock-18 | Fade', rarity: 'Restricted', color: '#8847ff', icon: '🔫' },
    { name: 'Karambit | Doppler', rarity: 'Gold', color: '#ffd700', icon: '🔪' },
    { name: 'P250 | Sand Dune', rarity: 'Consumer', color: '#b0c3d9', icon: '🔫' },
];

let userBalance = 1000;
const inventory = [];

// Инициализация страницы
document.addEventListener('DOMContentLoaded', () => {
    renderCases();
    updateBalance();
});

// Отрисовка сетки кейсов
function renderCases() {
    const container = document.getElementById('cases-container');
    container.innerHTML = '';

    casesData.forEach(box => {
        const card = document.createElement('div');
        card.className = 'case-card';
        card.onclick = () => openCase(box);
        
        card.innerHTML = `
            <div class="case-img" style="background: radial-gradient(circle, ${box.color} 0%, #222 100%);">
                📦
            </div>
            <div class="case-info">
                <span>${box.name}</span>
                <span class="case-price">${box.price} ₽</span>
            </div>
        `;
        container.appendChild(card);
    });
}

// Логика открытия кейса
function openCase(box) {
    if (userBalance < box.price) {
        alert("Недостаточно средств!");
        return;
    }

    // Списываем деньги
    userBalance -= box.price;
    updateBalance();

    // Показываем модальное окно
    const modal = document.getElementById('case-modal');
    const strip = document.getElementById('roulette-strip');
    const title = document.getElementById('modal-title');
    
    title.innerText = `Открытие: ${box.name}`;
    modal.style.display = 'flex';
    strip.style.transition = 'none';
    strip.style.transform = 'translateX(0)';
    strip.innerHTML = '';

    // Генерация ленты предметов (например, 50 штук)
    // Выбираем выигрышный предмет заранее
    const winningItem = itemsPool[Math.floor(Math.random() * itemsPool.length)];
    const winningIndex = 45; // Позиция выигрыша в ленте

    for (let i = 0; i < 50; i++) {
        let item;
        if (i === winningIndex) {
            item = winningItem;
        } else {
            item = itemsPool[Math.floor(Math.random() * itemsPool.length)];
        }

        const el = document.createElement('div');
        el.className = 'roulette-item';
        el.style.color = item.color;
        el.innerHTML = `<span title="${item.name}">${item.icon}</span>`;
        // Добавляем цветную полоску снизу для редкости
        el.style.borderBottom = `4px solid ${item.color}`;
        strip.appendChild(el);
    }

    // Анимация прокрутки
    // Ширина одного элемента 120px + бордеры. Центрируем на 50% экрана.
    setTimeout(() => {
        strip.style.transition = 'transform 4s cubic-bezier(0.15, 0.9, 0.2, 1)';
        // Сдвигаем так, чтобы выигрышный элемент оказался под стрелкой
        // (winningIndex * ширина элемента) - (ширина контейнера / 2)
        const offset = (winningIndex * 120) - 300; 
        strip.style.transform = `translateX(-${offset}px)`;
    }, 50);

    // Обработка закрытия и добавления в инвентарь
    const closeBtn = document.getElementById('close-modal');
    closeBtn.onclick = () => {
        modal.style.display = 'none';
        addToInventory(winningItem);
    };
}

// Добавление предмета в инвентарь (сайдбар)
function addToInventory(item) {
    const invList = document.getElementById('inventory');
    // Удаляем сообщение "Пусто", если оно есть
    const emptyMsg = invList.querySelector('.empty-msg');
    if (emptyMsg) emptyMsg.remove();

    const div = document.createElement('div');
    div.className = 'inv-item';
    div.style.borderLeftColor = item.color;
    div.innerHTML = `
        <div><strong>${item.name}</strong></div>
        <div style="font-size:10px; color:#888">${item.rarity}</div>
    `;
    invList.prepend(div);
}

// Обновление баланса
function updateBalance() {
    document.getElementById('user-balance').innerText = userBalance + ' ₽';
}

// Заглушка для авторизации
document.getElementById('login-btn').addEventListener('click', () => {
    alert("Перенаправление на Steam OpenID...\n(В реальном проекте здесь редирект на API Steam)");
});