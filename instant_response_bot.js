// БОТ С МГНОВЕННОЙ РЕАКЦИЕЙ
// Отправляет команды без задержек между ними
// Скопируйте в консоль браузера (F12)

(function() {
    const InstantResponseBot = {
        active: false,
        direction: 'right',
        moves: 0,
        rowLength: 12,
        
        // Мгновенная отправка команды
        instantPress(key) {
            document.dispatchEvent(new KeyboardEvent('keydown', {
                key: key,
                code: key,
                bubbles: true
            }));
        },
        
        // Отправка двух команд подряд без задержки
        doublePress(key1, key2) {
            this.instantPress(key1);
            // Мгновенно следующая команда
            setTimeout(() => this.instantPress(key2), 1); // 1мс задержка
        },
        
        // Основная логика
        fastMove() {
            // Проверяем счет
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
                // Завершили строку - мгновенный поворот
                const newDirection = this.direction === 'right' ? 'left' : 'right';
                const newKey = newDirection === 'right' ? 'ArrowRight' : 'ArrowLeft';
                
                // Отправляем ДВЕ команды подряд: вниз + поворот
                this.doublePress('ArrowDown', newKey);
                
                this.direction = newDirection;
                this.moves = 1; // уже сделали 1 ход в новом направлении
                
                console.log('⚡ Мгновенный поворот:', newDirection);
                
            } else {
                // Обычное движение по строке
                this.instantPress(this.direction === 'right' ? 'ArrowRight' : 'ArrowLeft');
                this.moves++;
            }
        },
        
        // Запуск
        start() {
            this.active = true;
            this.direction = 'right';
            this.moves = 0;
            
            console.log('⚡ БОТ С МГНОВЕННОЙ РЕАКЦИЕЙ ЗАПУЩЕН!');
            console.log('🚀 Отправляет команды без задержек');
            
            // Быстрый игровой цикл
            this.gameTimer = setInterval(() => {
                if (this.active) {
                    this.fastMove();
                }
            }, 70); // 70мс основной цикл
        },
        
        // Остановка
        stop() {
            this.active = false;
            if (this.gameTimer) {
                clearInterval(this.gameTimer);
            }
            console.log('⏹️ Мгновенный бот остановлен');
        }
    };
    
    // Глобальный доступ
    window.instantBot = InstantResponseBot;
    
    // АВТОЗАПУСК
    InstantResponseBot.start();
    
    console.log('⚡ МГНОВЕННЫЙ БОТ АКТИВИРОВАН!');
    console.log('🎮 Команды: instantBot.stop() для остановки');
})();