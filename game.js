// 게임 상태 관리
const GameState = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAMEOVER: 'gameover',
    LEADERBOARD: 'leaderboard'
};

// Firebase 설정 (무료 백엔드)
const FIREBASE_URL = 'https://endless-runner-default-rtdb.firebaseio.com';

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.state = GameState.MENU;
        
        // 플레이어 설정
        this.player = {
            x: 50,
            y: 300,
            width: 40,
            height: 40,
            velocityY: 0,
            jumping: false,
            color: '#FF6B6B'
        };
        
        // 게임 설정
        this.gravity = 0.6;
        this.jumpStrength = -12;
        this.groundY = 300;
        this.gameSpeed = 5;
        this.score = 0;
        this.highScore = this.loadHighScore();
        
        // 장애물 배열
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.obstacleInterval = 100;
        
        // 배경 요소
        this.clouds = [];
        this.groundOffset = 0;
        
        this.initClouds();
        this.setupEventListeners();
        this.updateHighScoreDisplay();
    }
    
    initClouds() {
        for (let i = 0; i < 5; i++) {
            this.clouds.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * 150,
                width: 60 + Math.random() * 40,
                speed: 0.5 + Math.random() * 0.5
            });
        }
    }
    
    setupEventListeners() {
        // 키보드 이벤트
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && this.state === GameState.PLAYING) {
                e.preventDefault();
                this.jump();
            }
        });
        
        // 버튼 이벤트
        document.getElementById('startBtn').addEventListener('click', () => this.startGame());
        document.getElementById('restartBtn').addEventListener('click', () => this.startGame());
        document.getElementById('mainMenuBtn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('leaderboardBtn').addEventListener('click', () => this.showLeaderboard());
        document.getElementById('backBtn').addEventListener('click', () => this.showMainMenu());
        document.getElementById('saveScoreBtn').addEventListener('click', () => this.saveScore());
        document.getElementById('clearLeaderboardBtn').addEventListener('click', () => this.clearLeaderboard());
        
        // 캔버스 클릭으로 점프
        this.canvas.addEventListener('click', () => {
            if (this.state === GameState.PLAYING) {
                this.jump();
            }
        });
    }
    
    startGame() {
        this.state = GameState.PLAYING;
        this.score = 0;
        this.gameSpeed = 5;
        this.obstacles = [];
        this.obstacleTimer = 0;
        
        // 플레이어 초기화
        this.player.y = this.groundY;
        this.player.velocityY = 0;
        this.player.jumping = false;
        
        this.showScreen('gameScreen');
        this.gameLoop();
    }
    
    jump() {
        if (!this.player.jumping) {
            this.player.velocityY = this.jumpStrength;
            this.player.jumping = true;
        }
    }
    
    update() {
        if (this.state !== GameState.PLAYING) return;
        
        // 점수 증가
        this.score++;
        document.getElementById('score').textContent = Math.floor(this.score / 10);
        
        // 난이도 증가
        if (this.score % 500 === 0) {
            this.gameSpeed += 0.5;
        }
        
        // 플레이어 물리
        this.player.velocityY += this.gravity;
        this.player.y += this.player.velocityY;
        
        // 땅 충돌
        if (this.player.y >= this.groundY) {
            this.player.y = this.groundY;
            this.player.velocityY = 0;
            this.player.jumping = false;
        }
        
        // 장애물 생성
        this.obstacleTimer++;
        if (this.obstacleTimer > this.obstacleInterval) {
            this.createObstacle();
            this.obstacleTimer = 0;
            this.obstacleInterval = 80 + Math.random() * 40;
        }
        
        // 장애물 업데이트
        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            this.obstacles[i].x -= this.gameSpeed;
            
            // 화면 밖으로 나간 장애물 제거
            if (this.obstacles[i].x + this.obstacles[i].width < 0) {
                this.obstacles.splice(i, 1);
            }
            // 충돌 감지
            else if (this.checkCollision(this.player, this.obstacles[i])) {
                this.gameOver();
            }
        }
        
        // 구름 업데이트
        this.clouds.forEach(cloud => {
            cloud.x -= cloud.speed;
            if (cloud.x + cloud.width < 0) {
                cloud.x = this.canvas.width;
                cloud.y = Math.random() * 150;
            }
        });
        
        // 땅 스크롤
        this.groundOffset -= this.gameSpeed;
        if (this.groundOffset <= -40) {
            this.groundOffset = 0;
        }
    }
    
    createObstacle() {
        const types = ['cactus', 'rock', 'tall'];
        const type = types[Math.floor(Math.random() * types.length)];
        
        let obstacle = {
            x: this.canvas.width,
            type: type
        };
        
        switch(type) {
            case 'cactus':
                obstacle.width = 30;
                obstacle.height = 50;
                obstacle.y = this.groundY - obstacle.height;
                obstacle.color = '#2ECC71';
                break;
            case 'rock':
                obstacle.width = 40;
                obstacle.height = 35;
                obstacle.y = this.groundY - obstacle.height;
                obstacle.color = '#95A5A6';
                break;
            case 'tall':
                obstacle.width = 25;
                obstacle.height = 70;
                obstacle.y = this.groundY - obstacle.height;
                obstacle.color = '#27AE60';
                break;
        }
        
        this.obstacles.push(obstacle);
    }
    
    checkCollision(player, obstacle) {
        return player.x < obstacle.x + obstacle.width &&
               player.x + player.width > obstacle.x &&
               player.y < obstacle.y + obstacle.height &&
               player.y + player.height > obstacle.y;
    }
    
    draw() {
        // 배경
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // 구름
        this.clouds.forEach(cloud => {
            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.beginPath();
            this.ctx.arc(cloud.x, cloud.y, cloud.width / 3, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.width / 3, cloud.y, cloud.width / 2.5, 0, Math.PI * 2);
            this.ctx.arc(cloud.x + cloud.width / 1.5, cloud.y, cloud.width / 3, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        // 땅
        this.ctx.fillStyle = '#C9A66B';
        this.ctx.fillRect(0, this.groundY + this.player.height, this.canvas.width, this.canvas.height);
        
        // 땅 무늬
        this.ctx.strokeStyle = '#A0826D';
        this.ctx.lineWidth = 2;
        for (let i = this.groundOffset; i < this.canvas.width; i += 40) {
            this.ctx.beginPath();
            this.ctx.moveTo(i, this.groundY + this.player.height);
            this.ctx.lineTo(i, this.canvas.height);
            this.ctx.stroke();
        }
        
        // 플레이어
        this.ctx.fillStyle = this.player.color;
        this.ctx.fillRect(this.player.x, this.player.y, this.player.width, this.player.height);
        
        // 플레이어 눈
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.player.x + 10, this.player.y + 10, 8, 8);
        this.ctx.fillRect(this.player.x + 22, this.player.y + 10, 8, 8);
        this.ctx.fillStyle = '#000000';
        this.ctx.fillRect(this.player.x + 13, this.player.y + 13, 4, 4);
        this.ctx.fillRect(this.player.x + 25, this.player.y + 13, 4, 4);
        
        // 장애물
        this.obstacles.forEach(obstacle => {
            this.ctx.fillStyle = obstacle.color;
            this.ctx.fillRect(obstacle.x, obstacle.y, obstacle.width, obstacle.height);
            
            // 장애물 디테일
            if (obstacle.type === 'cactus') {
                this.ctx.fillStyle = '#229954';
                this.ctx.fillRect(obstacle.x + 5, obstacle.y + 10, 5, 5);
                this.ctx.fillRect(obstacle.x + 20, obstacle.y + 15, 5, 5);
            }
        });
    }
    
    gameLoop() {
        if (this.state === GameState.PLAYING) {
            this.update();
            this.draw();
            requestAnimationFrame(() => this.gameLoop());
        }
    }
    
    gameOver() {
        this.state = GameState.GAMEOVER;
        const finalScore = Math.floor(this.score / 10);
        document.getElementById('finalScore').textContent = finalScore;
        
        if (finalScore > this.highScore) {
            this.highScore = finalScore;
            this.saveHighScore(this.highScore);
            this.updateHighScoreDisplay();
        }
        
        this.showScreen('gameOverScreen');
        document.getElementById('playerName').value = '';
    }
    
    showScreen(screenId) {
        const screens = ['startScreen', 'gameScreen', 'gameOverScreen', 'leaderboardScreen'];
        screens.forEach(id => {
            document.getElementById(id).classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    }
    
    showMainMenu() {
        this.state = GameState.MENU;
        this.showScreen('startScreen');
    }
    
    showLeaderboard() {
        this.state = GameState.LEADERBOARD;
        this.displayLeaderboard();
        this.showScreen('leaderboardScreen');
    }
    
    saveScore() {
        const playerName = document.getElementById('playerName').value.trim();
        if (!playerName) {
            alert('이름을 입력해주세요!');
            return;
        }
        
        const score = Math.floor(this.score / 10);
        
        // 로컬 리더보드에도 저장
        const leaderboard = this.loadLeaderboard();
        leaderboard.push({
            name: playerName,
            score: score,
            date: new Date().toLocaleDateString('ko-KR')
        });
        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard.splice(10);
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        
        // 전역 리더보드에 저장
        this.saveToGlobalLeaderboard(playerName, score);
    }
    
    async saveToGlobalLeaderboard(playerName, score) {
        try {
            const entry = {
                name: playerName,
                score: score,
                date: new Date().toISOString(),
                timestamp: Date.now()
            };
            
            const response = await fetch(`${FIREBASE_URL}/leaderboard.json`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(entry)
            });
            
            if (response.ok) {
                alert('점수가 전역 리더보드에 저장되었습니다! 🌍');
                this.showLeaderboard();
            } else {
                throw new Error('저장 실패');
            }
        } catch (error) {
            console.error('전역 리더보드 저장 오류:', error);
            alert('점수가 로컬에 저장되었습니다. (온라인 연결 확인 필요)');
            this.showLeaderboard();
        }
    }
    
    async loadGlobalLeaderboard() {
        try {
            const response = await fetch(`${FIREBASE_URL}/leaderboard.json`);
            const data = await response.json();
            
            if (!data) return [];
            
            // 객체를 배열로 변환
            const leaderboard = Object.values(data);
            
            // 점수 순으로 정렬하고 상위 10개만 반환
            leaderboard.sort((a, b) => b.score - a.score);
            return leaderboard.slice(0, 10);
        } catch (error) {
            console.error('전역 리더보드 로드 오류:', error);
            return [];
        }
    }
    
    loadLeaderboard() {
        const data = localStorage.getItem('leaderboard');
        return data ? JSON.parse(data) : [];
    }
    
    async displayLeaderboard() {
        const listElement = document.getElementById('leaderboardList');
        listElement.innerHTML = '<p>로딩 중...</p>';
        
        // 전역 리더보드 로드
        const globalLeaderboard = await this.loadGlobalLeaderboard();
        
        if (globalLeaderboard.length === 0) {
            listElement.innerHTML = '<p>아직 기록이 없습니다.</p>';
            return;
        }
        
        let html = '<h3>🌍 전역 리더보드</h3>';
        html += '<table><thead><tr><th>순위</th><th>이름</th><th>점수</th><th>날짜</th></tr></thead><tbody>';
        
        globalLeaderboard.forEach((entry, index) => {
            const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '';
            const date = new Date(entry.date).toLocaleDateString('ko-KR');
            html += `<tr>
                <td>${medal} ${index + 1}</td>
                <td>${entry.name}</td>
                <td>${entry.score}</td>
                <td>${date}</td>
            </tr>`;
        });
        
        html += '</tbody></table>';
        
        // 로컬 리더보드도 표시
        const localLeaderboard = this.loadLeaderboard();
        if (localLeaderboard.length > 0) {
            html += '<br><h3>📱 내 기록</h3>';
            html += '<table><thead><tr><th>순위</th><th>이름</th><th>점수</th><th>날짜</th></tr></thead><tbody>';
            
            localLeaderboard.forEach((entry, index) => {
                html += `<tr>
                    <td>${index + 1}</td>
                    <td>${entry.name}</td>
                    <td>${entry.score}</td>
                    <td>${entry.date}</td>
                </tr>`;
            });
            
            html += '</tbody></table>';
        }
        
        listElement.innerHTML = html;
    }
    
    clearLeaderboard() {
        if (confirm('로컬 기록만 삭제됩니다. 계속하시겠습니까?')) {
            localStorage.removeItem('leaderboard');
            this.displayLeaderboard();
            alert('로컬 기록이 삭제되었습니다.');
        }
    }
    
    saveHighScore(score) {
        localStorage.setItem('highScore', score.toString());
    }
    
    loadHighScore() {
        const score = localStorage.getItem('highScore');
        return score ? parseInt(score) : 0;
    }
    
    updateHighScoreDisplay() {
        document.getElementById('highScore').textContent = this.highScore;
    }
}

// 게임 초기화
window.addEventListener('load', () => {
    new Game();
});
