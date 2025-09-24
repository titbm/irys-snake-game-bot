// Простой popup script - одна кнопка запуск/остановка
document.addEventListener('DOMContentLoaded', function () {
    const toggleBtn = document.getElementById('toggleBtn');
    const status = document.getElementById('status');
    let botActive = false;

    // Проверяем статус бота при открытии popup
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            func: checkBotStatus
        }, function (results) {
            if (results && results[0] && results[0].result) {
                updateStatus(results[0].result.active);
            }
        });
    });

    // Обработчик единственной кнопки
    toggleBtn.addEventListener('click', function () {
        if (!botActive) {
            // Запускаем бота
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: startSnakeBot
                });
                updateStatus(true);
            });
        } else {
            // Останавливаем бота
            chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    func: stopSnakeBot
                });
                updateStatus(false);
            });
        }
    });

    // Обновление статуса и кнопки
    function updateStatus(active) {
        botActive = active;

        if (active) {
            status.textContent = '� Боот активен';
            status.className = 'status active';
            toggleBtn.textContent = '⏹️ Остановить бота';
            toggleBtn.className = 'button stop-btn';
        } else {
            status.textContent = '🔴 Бот неактивен';
            status.className = 'status inactive';
            toggleBtn.textContent = '🚀 Запустить бота';
            toggleBtn.className = 'button start-btn';
        }
    }
});

// Функция запуска бота (копия instant_response_bot)
function startSnakeBot() {
    // Проверяем, не запущен ли уже
    if (window.instantBot && window.instantBot.active) {
        console.log('🐍 Snake Bot уже запущен!');
        return;
    }

    // Создаем бота
    const InstantResponseBot = {
        active: false,
        direction: 'right',
        moves: 0,
        rowLength: 12,

        instantPress(key) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: key,
                code: key,
                bubbles: true
            }));
        },

        doublePress(key1, key2) {
            this.instantPress(key1);
            setTimeout(() => this.instantPress(key2), 1);
        },

        fastMove() {
            const progressText = document.body.innerText;
            const match = progressText.match(/Progress\s+(\d+)/);
            if (match) {
                const score = parseInt(match[1]);
                if (score >= 1000) {
                    this.stop();
                    console.log('🏆 ЦЕЛЬ ДОСТИГНУТА! Счет:', score);
                    return;
                }
            }

            if (this.moves >= this.rowLength) {
                const newDirection = this.direction === 'right' ? 'left' : 'right';
                const newKey = newDirection === 'right' ? 'ArrowRight' : 'ArrowLeft';

                this.doublePress('ArrowDown', newKey);

                this.direction = newDirection;
                this.moves = 1;

                console.log('⚡ Поворот:', newDirection);
            } else {
                this.instantPress(this.direction === 'right' ? 'ArrowRight' : 'ArrowLeft');
                this.moves++;
            }
        },

        start() {
            this.active = true;
            this.direction = 'right';
            this.moves = 0;

            console.log('🚀 Snake Bot запущен!');

            this.gameTimer = setInterval(() => {
                if (this.active) {
                    this.fastMove();
                }
            }, 70);
        },

        stop() {
            this.active = false;
            if (this.gameTimer) {
                clearInterval(this.gameTimer);
            }
            console.log('⏹️ Snake Bot остановлен');
        }
    };

    window.instantBot = InstantResponseBot;
    InstantResponseBot.start();
}

// Функция остановки бота
function stopSnakeBot() {
    if (window.instantBot) {
        window.instantBot.stop();
    }
}

// Функция проверки статуса бота
function checkBotStatus() {
    if (window.instantBot) {
        return { active: window.instantBot.active };
    }
    return { active: false };
}