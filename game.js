// Constantes do jogo
const GRID_SIZE = 20
const CELL_SIZE = 20
const INITIAL_SPEED = 150
const MAX_SPEED = 70
const SPEED_INCREMENT = 5
const SPEED_THRESHOLD = 5
const PORTAL_DURATION = 10000 // 10 segundos
const LEVEL_SCORE_THRESHOLD = 50 // Pontuação necessária para avançar ao próximo nível
const MAX_LEVEL = 5
const TIME_ATTACK_DURATION = 60 // 60 segundos para o modo contra o tempo

// Modos de jogo
const GameMode = {
  CLASSIC: "classic",
  TIME_ATTACK: "time",
  MAZE: "maze",
}

// Tipos de alimentos
const FoodType = {
  REGULAR: "regular",
  GOLDEN: "golden",
  RAINBOW: "rainbow",
}

// Valores dos alimentos
const FOOD_VALUES = {
  [FoodType.REGULAR]: 1,
  [FoodType.GOLDEN]: 5,
  [FoodType.RAINBOW]: 10,
}

// Cores dos alimentos
const FOOD_COLORS = {
  [FoodType.REGULAR]: "#FF0000",
  [FoodType.GOLDEN]: "#FFCC00",
  [FoodType.RAINBOW]: "rainbow",
}

// Chances de aparecimento dos alimentos (de 100)
const FOOD_CHANCES = {
  [FoodType.REGULAR]: 70,
  [FoodType.GOLDEN]: 25,
  [FoodType.RAINBOW]: 5,
}

// Tipos de power-ups
const PowerUpType = {
  SPEED_BOOST: "speed",
  SCORE_MULTIPLIER: "score",
  INVINCIBILITY: "invincible",
  GHOST_MODE: "ghost",
  SLOW_MOTION: "slow",
  MAGNET: "magnet",
  NONE: "none",
}

// Cores dos power-ups
const POWER_UP_COLORS = {
  [PowerUpType.SPEED_BOOST]: "#00FFFF", // Ciano
  [PowerUpType.SCORE_MULTIPLIER]: "#FFFF00", // Amarelo
  [PowerUpType.INVINCIBILITY]: "#FF00FF", // Magenta
  [PowerUpType.GHOST_MODE]: "#FF8800", // Laranja
  [PowerUpType.SLOW_MOTION]: "#8800FF", // Roxo
  [PowerUpType.MAGNET]: "#00FF88", // Menta
}

// Durações dos power-ups (em milissegundos)
const POWER_UP_DURATIONS = {
  [PowerUpType.SPEED_BOOST]: 5000,
  [PowerUpType.SCORE_MULTIPLIER]: 10000,
  [PowerUpType.INVINCIBILITY]: 7000,
  [PowerUpType.GHOST_MODE]: 8000,
  [PowerUpType.SLOW_MOTION]: 6000,
  [PowerUpType.MAGNET]: 12000,
}

// Descrições dos power-ups
const POWER_UP_DESCRIPTIONS = {
  [PowerUpType.SPEED_BOOST]: "VELOCIDADE!",
  [PowerUpType.SCORE_MULTIPLIER]: "2X PONTOS!",
  [PowerUpType.INVINCIBILITY]: "INVENCÍVEL!",
  [PowerUpType.GHOST_MODE]: "MODO FANTASMA!",
  [PowerUpType.SLOW_MOTION]: "CÂMERA LENTA!",
  [PowerUpType.MAGNET]: "ÍMÃ DE COMIDA!",
}

// Temas dos níveis
const LEVEL_THEMES = [
  {
    // Nível 1
    background: "#000000",
    gridColor: "#111111",
    wallColor: "#333333",
    message: "Bem-vindo ao Cobra Arcade!",
  },
  {
    // Nível 2
    background: "#001122",
    gridColor: "#112233",
    wallColor: "#224466",
    message: "Novos obstáculos e jogabilidade mais rápida!",
  },
  {
    // Nível 3
    background: "#220022",
    gridColor: "#330033",
    wallColor: "#660066",
    message: "Padrões de labirinto e portais especiais!",
  },
  {
    // Nível 4
    background: "#221100",
    gridColor: "#332211",
    wallColor: "#664422",
    message: "Obstáculos em movimento e mais power-ups!",
  },
  {
    // Nível 5
    background: "#002200",
    gridColor: "#003300",
    wallColor: "#006600",
    message: "Nível final! Você consegue dominá-lo?",
  },
]

// Enum de direções
const Direction = {
  UP: 0,
  RIGHT: 1,
  DOWN: 2,
  LEFT: 3,
}

// Tipos de obstáculos
const ObstacleType = {
  WALL: "wall",
  PORTAL: "portal",
  MOVING: "moving",
}

// Classe do jogo
class SnakeGame {
  constructor() {
    // Configuração do canvas
    this.canvas = document.getElementById("game-canvas")
    this.ctx = this.canvas.getContext("2d")
    this.canvas.width = GRID_SIZE * CELL_SIZE
    this.canvas.height = GRID_SIZE * CELL_SIZE

    // Estado do jogo
    this.gameMode = GameMode.CLASSIC
    this.isRunning = false
    this.isPaused = false
    this.gameOver = false
    this.level = 1
    this.score = 0
    this.highScore = localStorage.getItem("snakeHighScore") || 0

    // Elementos do jogo
    this.snake = []
    this.direction = Direction.RIGHT
    this.nextDirection = Direction.RIGHT
    this.food = null
    this.powerUp = null
    this.activePowerUp = PowerUpType.NONE
    this.powerUpTimeLeft = 0
    this.obstacles = []
    this.portals = []
    this.movingObstacles = []

    // Temporização do jogo
    this.lastFrameTime = 0
    this.gameSpeed = INITIAL_SPEED
    this.timeLeft = TIME_ATTACK_DURATION

    // Elementos da UI
    this.startScreen = document.getElementById("start-screen")
    this.gameOverScreen = document.getElementById("game-over-screen")
    this.pauseScreen = document.getElementById("pause-screen")
    this.levelUpScreen = document.getElementById("level-up-screen")
    this.powerUpIndicator = document.getElementById("power-up-indicator")
    this.powerUpBar = document.getElementById("power-up-bar")
    this.powerUpText = document.getElementById("power-up-text")
    this.timeDisplay = document.getElementById("time-display")

    // Elementos de pontuação
    this.scoreElement = document.getElementById("score")
    this.levelElement = document.getElementById("level")
    this.highScoreElement = document.getElementById("high-score")
    this.finalScoreElement = document.getElementById("final-score")
    this.finalLevelElement = document.getElementById("final-level")
    this.newHighScoreElement = document.getElementById("new-high-score")
    this.newLevelElement = document.getElementById("new-level")
    this.levelDescriptionElement = document.querySelector(".level-description")
    this.timeRemainingElement = document.getElementById("time-remaining")

    // Botões
    this.startButton = document.getElementById("start-button")
    this.restartButton = document.getElementById("restart-button")
    this.menuButton = document.getElementById("menu-button")
    this.pauseButton = document.getElementById("pause-button")
    this.resumeButton = document.getElementById("resume-button")
    this.quitButton = document.getElementById("quit-button")
    this.continueButton = document.getElementById("continue-button")

    // Botões de modo
    this.classicModeButton = document.getElementById("classic-mode")
    this.timeModeButton = document.getElementById("time-mode")
    this.mazeModeButton = document.getElementById("maze-mode")

    // Controles móveis
    this.upButton = document.getElementById("up-button")
    this.downButton = document.getElementById("down-button")
    this.leftButton = document.getElementById("left-button")
    this.rightButton = document.getElementById("right-button")

    // Inicializar o jogo
    this.init()
  }

  init() {
    // Definir recorde
    this.highScoreElement.textContent = this.highScore

    // Adicionar event listeners
    this.addEventListeners()

    // Mostrar tela inicial
    this.showStartScreen()
  }

  addEventListeners() {
    // Controles de teclado
    document.addEventListener("keydown", this.handleKeyDown.bind(this))

    // Controles de botões
    this.startButton.addEventListener("click", this.startGame.bind(this))
    this.restartButton.addEventListener("click", this.restartGame.bind(this))
    this.menuButton.addEventListener("click", this.showStartScreen.bind(this))
    this.pauseButton.addEventListener("click", this.togglePause.bind(this))
    this.resumeButton.addEventListener("click", this.resumeGame.bind(this))
    this.quitButton.addEventListener("click", this.quitGame.bind(this))
    this.continueButton.addEventListener("click", this.continueToNextLevel.bind(this))

    // Seleção de modo
    this.classicModeButton.addEventListener("click", () => this.selectGameMode(GameMode.CLASSIC))
    this.timeModeButton.addEventListener("click", () => this.selectGameMode(GameMode.TIME_ATTACK))
    this.mazeModeButton.addEventListener("click", () => this.selectGameMode(GameMode.MAZE))

    // Controles móveis
    this.upButton.addEventListener("click", () => this.setDirection(Direction.UP))
    this.downButton.addEventListener("click", () => this.setDirection(Direction.DOWN))
    this.leftButton.addEventListener("click", () => this.setDirection(Direction.LEFT))
    this.rightButton.addEventListener("click", () => this.setDirection(Direction.RIGHT))
  }

  selectGameMode(mode) {
    this.gameMode = mode

    // Atualizar UI
    this.classicModeButton.classList.remove("selected")
    this.timeModeButton.classList.remove("selected")
    this.mazeModeButton.classList.remove("selected")

    switch (mode) {
      case GameMode.CLASSIC:
        this.classicModeButton.classList.add("selected")
        this.timeDisplay.classList.add("hidden")
        break
      case GameMode.TIME_ATTACK:
        this.timeModeButton.classList.add("selected")
        this.timeDisplay.classList.remove("hidden")
        break
      case GameMode.MAZE:
        this.mazeModeButton.classList.add("selected")
        this.timeDisplay.classList.add("hidden")
        break
    }
  }

  handleKeyDown(event) {
    // Controles do jogo
    switch (event.key) {
      case "ArrowUp":
        this.setDirection(Direction.UP)
        event.preventDefault()
        break
      case "ArrowDown":
        this.setDirection(Direction.DOWN)
        event.preventDefault()
        break
      case "ArrowLeft":
        this.setDirection(Direction.LEFT)
        event.preventDefault()
        break
      case "ArrowRight":
        this.setDirection(Direction.RIGHT)
        event.preventDefault()
        break
      case "p":
      case "P":
        this.togglePause()
        event.preventDefault()
        break
      case "Escape":
        if (this.isPaused) {
          this.resumeGame()
        } else {
          this.togglePause()
        }
        event.preventDefault()
        break
    }
  }

  setDirection(direction) {
    // Impedir giros de 180 graus
    if (
      (this.direction === Direction.UP && direction === Direction.DOWN) ||
      (this.direction === Direction.DOWN && direction === Direction.UP) ||
      (this.direction === Direction.LEFT && direction === Direction.RIGHT) ||
      (this.direction === Direction.RIGHT && direction === Direction.LEFT)
    ) {
      return
    }

    this.nextDirection = direction
  }

  startGame() {
    // Esconder tela inicial
    this.startScreen.classList.add("hidden")

    // Resetar estado do jogo
    this.resetGame()

    // Iniciar loop do jogo
    this.isRunning = true
    this.gameOver = false
    this.lastFrameTime = performance.now()
    requestAnimationFrame(this.gameLoop.bind(this))
  }

  resetGame() {
    // Resetar estado do jogo
    this.score = 0
    this.level = 1
    this.gameSpeed = INITIAL_SPEED
    this.timeLeft = TIME_ATTACK_DURATION
    this.direction = Direction.RIGHT
    this.nextDirection = Direction.RIGHT
    this.activePowerUp = PowerUpType.NONE
    this.powerUpTimeLeft = 0
    this.gameOver = false

    // Resetar UI
    this.scoreElement.textContent = this.score
    this.levelElement.textContent = this.level
    this.timeRemainingElement.textContent = this.timeLeft
    this.powerUpIndicator.classList.add("hidden")

    // Limpar obstáculos
    this.obstacles = []
    this.portals = []
    this.movingObstacles = []

    // Inicializar cobra
    this.initSnake()

    // Inicializar nível
    this.initLevel()

    // Gerar comida
    this.spawnFood()
  }

  initSnake() {
    // Criar cobra com 3 segmentos
    // Posição inicial no centro para o modo labirinto
    if (this.gameMode === GameMode.MAZE) {
      const centerX = Math.floor(GRID_SIZE / 2)
      const centerY = Math.floor(GRID_SIZE / 2)
      this.snake = [
        { x: centerX, y: centerY },
        { x: centerX - 1, y: centerY },
        { x: centerX - 2, y: centerY },
      ]
    } else {
      this.snake = [
        { x: 5, y: 10 },
        { x: 4, y: 10 },
        { x: 3, y: 10 },
      ]
    }
  }

  initLevel() {
    // Limpar obstáculos
    this.obstacles = []
    this.portals = []
    this.movingObstacles = []

    // Definir tema do nível
    const theme = LEVEL_THEMES[this.level - 1]
    document.documentElement.style.setProperty("--level-background", theme.background)
    document.documentElement.style.setProperty("--level-grid", theme.gridColor)
    document.documentElement.style.setProperty("--level-wall", theme.wallColor)

    // Adicionar obstáculos baseados no nível
    if (this.level >= 2 && this.gameMode !== GameMode.MAZE) {
      this.addWalls()
    }

    if (this.level >= 3 && this.gameMode !== GameMode.MAZE) {
      this.addPortals()
    }

    if (this.level >= 4 && this.gameMode !== GameMode.MAZE) {
      this.addMovingObstacles()
    }

    // Adicionar labirinto se estiver no modo labirinto
    if (this.gameMode === GameMode.MAZE) {
      this.generateMaze()
    }
  }

  addWalls() {
    // Adicionar paredes baseadas no nível
    const wallCount = this.level * 3

    for (let i = 0; i < wallCount; i++) {
      const wall = this.getRandomEmptyCell()
      this.obstacles.push({
        type: ObstacleType.WALL,
        x: wall.x,
        y: wall.y,
      })
    }
  }

  addPortals() {
    // Adicionar um par de portais
    const portal1 = this.getRandomEmptyCell()
    let portal2 = this.getRandomEmptyCell()

    // Garantir que os portais não estejam muito próximos
    while (Math.abs(portal1.x - portal2.x) < 5 || Math.abs(portal1.y - portal2.y) < 5) {
      portal2 = this.getRandomEmptyCell()
    }

    this.portals = [
      { x: portal1.x, y: portal1.y, target: { x: portal2.x, y: portal2.y } },
      { x: portal2.x, y: portal2.y, target: { x: portal1.x, y: portal1.y } },
    ]
  }

  addMovingObstacles() {
    // Adicionar obstáculos em movimento baseados no nível
    const obstacleCount = this.level - 3

    for (let i = 0; i < obstacleCount; i++) {
      const obstacle = this.getRandomEmptyCell()
      const direction = Math.floor(Math.random() * 4)

      this.movingObstacles.push({
        x: obstacle.x,
        y: obstacle.y,
        direction: direction,
        moveCounter: 0,
      })
    }
  }

  generateMaze() {
    // Limpar obstáculos existentes para evitar sobreposições
    this.obstacles = []

    // Definir área segura ao redor da posição inicial da cobra
    const safeZone = []
    const centerX = Math.floor(GRID_SIZE / 2)
    const centerY = Math.floor(GRID_SIZE / 2)

    // Criar uma zona segura de 5x5 no centro
    for (let x = centerX - 2; x <= centerX + 2; x++) {
      for (let y = centerY - 2; y <= centerY + 2; y++) {
        if (x >= 0 && x < GRID_SIZE && y >= 0 && y < GRID_SIZE) {
          safeZone.push({ x, y })
        }
      }
    }

    // Função para verificar se uma posição está na zona segura
    const isInSafeZone = (x, y) => {
      return safeZone.some((pos) => pos.x === x && pos.y === y)
    }

    // Adicionar bordas externas
    for (let x = 0; x < GRID_SIZE; x++) {
      // Borda superior e inferior
      if (x % 3 !== 0) {
        // Deixar algumas aberturas
        if (!isInSafeZone(x, 0)) {
          this.obstacles.push({
            type: ObstacleType.WALL,
            x: x,
            y: 0,
          })
        }

        if (!isInSafeZone(x, GRID_SIZE - 1)) {
          this.obstacles.push({
            type: ObstacleType.WALL,
            x: x,
            y: GRID_SIZE - 1,
          })
        }
      }
    }

    for (let y = 0; y < GRID_SIZE; y++) {
      // Borda esquerda e direita
      if (y % 3 !== 0) {
        // Deixar algumas aberturas
        if (!isInSafeZone(0, y)) {
          this.obstacles.push({
            type: ObstacleType.WALL,
            x: 0,
            y: y,
          })
        }

        if (!isInSafeZone(GRID_SIZE - 1, y)) {
          this.obstacles.push({
            type: ObstacleType.WALL,
            x: GRID_SIZE - 1,
            y: y,
          })
        }
      }
    }

    // Adicionar paredes horizontais internas
    for (let i = 0; i < 3; i++) {
      const y = 5 + i * 5
      for (let x = 0; x < GRID_SIZE; x++) {
        if (x % 4 !== 0 && !isInSafeZone(x, y) && !this.isSnakeCell(x, y)) {
          this.obstacles.push({
            type: ObstacleType.WALL,
            x: x,
            y: y,
          })
        }
      }
    }

    // Adicionar paredes verticais internas
    for (let i = 0; i < 3; i++) {
      const x = 5 + i * 5
      for (let y = 0; y < GRID_SIZE; y++) {
        if (y % 4 !== 0 && !isInSafeZone(x, y) && !this.isSnakeCell(x, y) && !this.isObstacle(x, y)) {
          this.obstacles.push({
            type: ObstacleType.WALL,
            x: x,
            y: y,
          })
        }
      }
    }

    // Adicionar alguns blocos aleatórios para tornar o labirinto mais interessante
    const randomBlocks = 10
    for (let i = 0; i < randomBlocks; i++) {
      const x = 2 + Math.floor(Math.random() * (GRID_SIZE - 4))
      const y = 2 + Math.floor(Math.random() * (GRID_SIZE - 4))

      if (!isInSafeZone(x, y) && !this.isSnakeCell(x, y) && !this.isObstacle(x, y)) {
        this.obstacles.push({
          type: ObstacleType.WALL,
          x: x,
          y: y,
        })
      }
    }

    // Adicionar um par de portais no modo labirinto
    this.addPortals()
  }

  spawnFood() {
    // Determinar tipo de comida baseado nas chances
    const rand = Math.random() * 100
    let foodType = FoodType.REGULAR

    if (rand < FOOD_CHANCES[FoodType.RAINBOW]) {
      foodType = FoodType.RAINBOW
    } else if (rand < FOOD_CHANCES[FoodType.RAINBOW] + FOOD_CHANCES[FoodType.GOLDEN]) {
      foodType = FoodType.GOLDEN
    }

    // Obter célula vazia aleatória
    const cell = this.getRandomEmptyCell()

    // Criar comida
    this.food = {
      x: cell.x,
      y: cell.y,
      type: foodType,
    }

    // Chance de gerar power-up
    if (Math.random() < 0.1 && this.level > 1) {
      this.spawnPowerUp()
    }
  }

  spawnPowerUp() {
    // Só gerar se não houver power-up ativo
    if (this.powerUp || this.activePowerUp !== PowerUpType.NONE) {
      return
    }

    // Obter célula vazia aleatória
    const cell = this.getRandomEmptyCell()

    // Obter tipo de power-up aleatório
    const powerUpTypes = Object.values(PowerUpType).filter((type) => type !== PowerUpType.NONE)
    const randomType = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)]

    // Criar power-up
    this.powerUp = {
      x: cell.x,
      y: cell.y,
      type: randomType,
    }
  }

  getRandomEmptyCell() {
    let cell
    let isOccupied
    let attempts = 0
    const maxAttempts = 100 // Evitar loop infinito

    do {
      cell = {
        x: Math.floor(Math.random() * GRID_SIZE),
        y: Math.floor(Math.random() * GRID_SIZE),
      }

      isOccupied =
        this.isSnakeCell(cell.x, cell.y) ||
        this.isObstacle(cell.x, cell.y) ||
        this.isPortal(cell.x, cell.y) ||
        (this.food && this.food.x === cell.x && this.food.y === cell.y) ||
        (this.powerUp && this.powerUp.x === cell.x && this.powerUp.y === cell.y)

      attempts++

      // Se não conseguir encontrar uma célula vazia após muitas tentativas
      if (attempts >= maxAttempts) {
        // Procurar sistematicamente por uma célula vazia
        for (let x = 0; x < GRID_SIZE; x++) {
          for (let y = 0; y < GRID_SIZE; y++) {
            if (
              !this.isSnakeCell(x, y) &&
              !this.isObstacle(x, y) &&
              !this.isPortal(x, y) &&
              !(this.food && this.food.x === x && this.food.y === y) &&
              !(this.powerUp && this.powerUp.x === x && this.powerUp.y === y)
            ) {
              return { x, y }
            }
          }
        }
        // Se ainda não encontrou, retornar uma posição padrão
        return { x: 1, y: 1 }
      }
    } while (isOccupied)

    return cell
  }

  isSnakeCell(x, y) {
    return this.snake.some((segment) => segment.x === x && segment.y === y)
  }

  isObstacle(x, y) {
    return this.obstacles.some((obstacle) => obstacle.x === x && obstacle.y === y)
  }

  isPortal(x, y) {
    return this.portals.some((portal) => portal.x === x && portal.y === y)
  }

  isMovingObstacle(x, y) {
    return this.movingObstacles.some((obstacle) => obstacle.x === x && obstacle.y === y)
  }

  gameLoop(timestamp) {
    if (!this.isRunning) return

    // Calcular delta time
    const deltaTime = timestamp - this.lastFrameTime

    // Atualizar jogo em intervalos fixos
    if (deltaTime >= this.gameSpeed) {
      this.lastFrameTime = timestamp

      // Atualizar estado do jogo
      if (!this.isPaused) {
        this.update()
      }

      // Desenhar jogo
      this.draw()
    }

    // Continuar loop do jogo
    if (!this.gameOver) {
      requestAnimationFrame(this.gameLoop.bind(this))
    }
  }

  update() {
    // Atualizar direção
    this.direction = this.nextDirection

    // Mover cobra
    this.moveSnake()

    // Verificar colisões
    this.checkCollisions()

    // Atualizar timer do power-up
    this.updatePowerUp()

    // Atualizar obstáculos em movimento
    this.updateMovingObstacles()

    // Atualizar tempo no modo contra o tempo
    if (this.gameMode === GameMode.TIME_ATTACK) {
      this.updateTimeAttack()
    }
  }

  moveSnake() {
    // Obter posição da cabeça
    const head = { ...this.snake[0] }

    // Mover cabeça baseado na direção
    switch (this.direction) {
      case Direction.UP:
        head.y--
        break
      case Direction.DOWN:
        head.y++
        break
      case Direction.LEFT:
        head.x--
        break
      case Direction.RIGHT:
        head.x++
        break
    }

    // Verificar teleporte por portal
    const portal = this.portals.find((p) => p.x === head.x && p.y === head.y)
    if (portal) {
      head.x = portal.target.x
      head.y = portal.target.y
    }

    // Verificar limites da tela
    if (head.x < 0) head.x = GRID_SIZE - 1
    if (head.x >= GRID_SIZE) head.x = 0
    if (head.y < 0) head.y = GRID_SIZE - 1
    if (head.y >= GRID_SIZE) head.y = 0

    // Adicionar nova cabeça
    this.snake.unshift(head)

    // Verificar se comida foi comida
    if (this.food && head.x === this.food.x && head.y === this.food.y) {
      this.eatFood()
    } else {
      // Remover cauda se nenhuma comida foi comida
      this.snake.pop()
    }

    // Verificar se power-up foi coletado
    if (this.powerUp && head.x === this.powerUp.x && head.y === this.powerUp.y) {
      this.collectPowerUp()
    }
  }

  eatFood() {
    // Aumentar pontuação baseado no tipo de comida
    const baseValue = FOOD_VALUES[this.food.type]
    const multiplier = this.activePowerUp === PowerUpType.SCORE_MULTIPLIER ? 2 : 1
    const points = baseValue * multiplier

    this.score += points
    this.scoreElement.textContent = this.score

    // Verificar subida de nível
    if (this.score >= this.level * LEVEL_SCORE_THRESHOLD && this.level < MAX_LEVEL) {
      this.levelUp()
    }

    // Gerar nova comida
    this.spawnFood()

    // Acelerar cobra levemente
    if (this.gameSpeed > MAX_SPEED && this.snake.length % SPEED_THRESHOLD === 0) {
      if (this.gameMode === GameMode.MAZE) {
        // Aceleração mais gradual no modo labirinto
        this.gameSpeed -= SPEED_INCREMENT / 2
      } else {
        this.gameSpeed -= SPEED_INCREMENT
      }
    }
  }

  collectPowerUp() {
    // Ativar power-up
    this.activePowerUp = this.powerUp.type
    this.powerUpTimeLeft = POWER_UP_DURATIONS[this.powerUp.type]

    // Atualizar UI
    this.powerUpIndicator.classList.remove("hidden")
    this.powerUpBar.style.backgroundColor = POWER_UP_COLORS[this.powerUp.type]
    this.powerUpText.textContent = POWER_UP_DESCRIPTIONS[this.powerUp.type]

    // Aplicar efeitos do power-up
    this.applyPowerUpEffects()

    // Remover power-up
    this.powerUp = null
  }

  applyPowerUpEffects() {
    switch (this.activePowerUp) {
      case PowerUpType.SPEED_BOOST:
        this.gameSpeed = Math.max(MAX_SPEED, this.gameSpeed - 30)
        break
      case PowerUpType.SLOW_MOTION:
        this.gameSpeed = this.gameSpeed + 50
        break
    }
  }

  removePowerUpEffects() {
    switch (this.activePowerUp) {
      case PowerUpType.SPEED_BOOST:
      case PowerUpType.SLOW_MOTION:
        this.gameSpeed = INITIAL_SPEED - (this.level - 1) * SPEED_INCREMENT * 2
        break
    }
  }

  updatePowerUp() {
    if (this.activePowerUp === PowerUpType.NONE) return

    // Diminuir tempo do power-up
    this.powerUpTimeLeft -= this.gameSpeed

    // Atualizar barra de power-up
    const percentage = (this.powerUpTimeLeft / POWER_UP_DURATIONS[this.activePowerUp]) * 100
    this.powerUpBar.style.width = `${percentage}%`

    // Verificar se power-up expirou
    if (this.powerUpTimeLeft <= 0) {
      this.removePowerUpEffects()
      this.activePowerUp = PowerUpType.NONE
      this.powerUpIndicator.classList.add("hidden")
    }
  }

  updateMovingObstacles() {
    for (const obstacle of this.movingObstacles) {
      obstacle.moveCounter++

      // Mover obstáculo a cada 10 frames
      if (obstacle.moveCounter >= 10) {
        obstacle.moveCounter = 0

        // Salvar posição antiga
        const oldX = obstacle.x
        const oldY = obstacle.y

        // Mover baseado na direção
        switch (obstacle.direction) {
          case Direction.UP:
            obstacle.y--
            break
          case Direction.DOWN:
            obstacle.y++
            break
          case Direction.LEFT:
            obstacle.x--
            break
          case Direction.RIGHT:
            obstacle.x++
            break
        }

        // Verificar limites da tela
        if (obstacle.x < 0) obstacle.x = GRID_SIZE - 1
        if (obstacle.x >= GRID_SIZE) obstacle.x = 0
        if (obstacle.y < 0) obstacle.y = GRID_SIZE - 1
        if (obstacle.y >= GRID_SIZE) obstacle.y = 0

        // Verificar colisão com paredes ou outros obstáculos
        if (
          this.isObstacle(obstacle.x, obstacle.y) ||
          this.isPortal(obstacle.x, obstacle.y) ||
          this.isMovingObstacle(obstacle.x, obstacle.y)
        ) {
          // Reverter posição
          obstacle.x = oldX
          obstacle.y = oldY

          // Mudar direção
          obstacle.direction = (obstacle.direction + 1) % 4
        }
      }
    }
  }

  updateTimeAttack() {
    this.timeLeft -= this.gameSpeed / 1000
    this.timeRemainingElement.textContent = Math.ceil(this.timeLeft)

    if (this.timeLeft <= 0) {
      this.gameOver = true
      this.showGameOver()
    }
  }

  checkCollisions() {
    // Obter posição da cabeça
    const head = this.snake[0]

    // Verificar colisão com si mesma
    for (let i = 1; i < this.snake.length; i++) {
      if (head.x === this.snake[i].x && head.y === this.snake[i].y) {
        if (this.activePowerUp !== PowerUpType.GHOST_MODE && this.activePowerUp !== PowerUpType.INVINCIBILITY) {
          this.gameOver = true
        }
      }
    }

    // Verificar colisão com obstáculos
    if (this.isObstacle(head.x, head.y) || this.isMovingObstacle(head.x, head.y)) {
      if (this.activePowerUp !== PowerUpType.GHOST_MODE && this.activePowerUp !== PowerUpType.INVINCIBILITY) {
        this.gameOver = true
      }
    }

    // Verificar game over
    if (this.gameOver) {
      this.showGameOver()
    }
  }

  draw() {
    // Limpar canvas
    this.ctx.fillStyle = LEVEL_THEMES[this.level - 1].background
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height)

    // Desenhar grade
    this.drawGrid()

    // Desenhar obstáculos
    this.drawObstacles()

    // Desenhar portais
    this.drawPortals()

    // Desenhar obstáculos em movimento
    this.drawMovingObstacles()

    // Desenhar comida
    this.drawFood()

    // Desenhar power-up
    this.drawPowerUp()

    // Desenhar cobra
    this.drawSnake()
  }

  drawGrid() {
    this.ctx.strokeStyle = LEVEL_THEMES[this.level - 1].gridColor
    this.ctx.lineWidth = 0.5

    // Desenhar linhas verticais
    for (let x = 0; x <= this.canvas.width; x += CELL_SIZE) {
      this.ctx.beginPath()
      this.ctx.moveTo(x, 0)
      this.ctx.lineTo(x, this.canvas.height)
      this.ctx.stroke()
    }

    // Desenhar linhas horizontais
    for (let y = 0; y <= this.canvas.height; y += CELL_SIZE) {
      this.ctx.beginPath()
      this.ctx.moveTo(0, y)
      this.ctx.lineTo(this.canvas.width, y)
      this.ctx.stroke()
    }
  }

  drawObstacles() {
    this.ctx.fillStyle = LEVEL_THEMES[this.level - 1].wallColor

    for (const obstacle of this.obstacles) {
      this.ctx.fillRect(obstacle.x * CELL_SIZE, obstacle.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }
  }

  drawPortals() {
    for (let i = 0; i < this.portals.length; i++) {
      const portal = this.portals[i]
      const gradient = this.ctx.createRadialGradient(
        portal.x * CELL_SIZE + CELL_SIZE / 2,
        portal.y * CELL_SIZE + CELL_SIZE / 2,
        0,
        portal.x * CELL_SIZE + CELL_SIZE / 2,
        portal.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE,
      )

      // Cores diferentes para cada par de portais
      if (i % 2 === 0) {
        gradient.addColorStop(0, "#00FFFF")
        gradient.addColorStop(1, "#0000FF")
      } else {
        gradient.addColorStop(0, "#FF00FF")
        gradient.addColorStop(1, "#FF0000")
      }

      this.ctx.fillStyle = gradient
      this.ctx.beginPath()
      this.ctx.arc(
        portal.x * CELL_SIZE + CELL_SIZE / 2,
        portal.y * CELL_SIZE + CELL_SIZE / 2,
        CELL_SIZE / 2,
        0,
        Math.PI * 2,
      )
      this.ctx.fill()
    }
  }

  drawMovingObstacles() {
    this.ctx.fillStyle = "#FF6600"

    for (const obstacle of this.movingObstacles) {
      this.ctx.fillRect(obstacle.x * CELL_SIZE, obstacle.y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }
  }

  drawFood() {
    if (!this.food) return

    // Desenhar comida baseado no tipo
    if (this.food.type === FoodType.RAINBOW) {
      // Gradiente arco-íris
      const gradient = this.ctx.createLinearGradient(
        this.food.x * CELL_SIZE,
        this.food.y * CELL_SIZE,
        this.food.x * CELL_SIZE + CELL_SIZE,
        this.food.y * CELL_SIZE + CELL_SIZE,
      )
      gradient.addColorStop(0, "red")
      gradient.addColorStop(0.2, "orange")
      gradient.addColorStop(0.4, "yellow")
      gradient.addColorStop(0.6, "green")
      gradient.addColorStop(0.8, "blue")
      gradient.addColorStop(1, "purple")

      this.ctx.fillStyle = gradient
    } else {
      this.ctx.fillStyle = FOOD_COLORS[this.food.type]
    }

    this.ctx.beginPath()
    this.ctx.arc(
      this.food.x * CELL_SIZE + CELL_SIZE / 2,
      this.food.y * CELL_SIZE + CELL_SIZE / 2,
      CELL_SIZE / 2,
      0,
      Math.PI * 2,
    )
    this.ctx.fill()
  }

  drawPowerUp() {
    if (!this.powerUp) return

    this.ctx.fillStyle = POWER_UP_COLORS[this.powerUp.type]
    this.ctx.fillRect(this.powerUp.x * CELL_SIZE + 2, this.powerUp.y * CELL_SIZE + 2, CELL_SIZE - 4, CELL_SIZE - 4)
  }

  drawSnake() {
    // Desenhar corpo da cobra
    for (let i = 1; i < this.snake.length; i++) {
      // Cor diferente para modo fantasma
      if (this.activePowerUp === PowerUpType.GHOST_MODE) {
        this.ctx.fillStyle = "rgba(0, 255, 0, 0.5)"
      } else if (this.activePowerUp === PowerUpType.INVINCIBILITY) {
        this.ctx.fillStyle = "#FF00FF"
      } else {
        this.ctx.fillStyle = "#00FF00"
      }

      this.ctx.fillRect(this.snake[i].x * CELL_SIZE, this.snake[i].y * CELL_SIZE, CELL_SIZE, CELL_SIZE)
    }

    // Desenhar cabeça da cobra
    if (this.activePowerUp === PowerUpType.GHOST_MODE) {
      this.ctx.fillStyle = "rgba(0, 200, 0, 0.7)"
    } else if (this.activePowerUp === PowerUpType.INVINCIBILITY) {
      this.ctx.fillStyle = "#FF00FF"
    } else {
      this.ctx.fillStyle = "#00CC00"
    }

    this.ctx.fillRect(this.snake[0].x * CELL_SIZE, this.snake[0].y * CELL_SIZE, CELL_SIZE, CELL_SIZE)

    // Desenhar olhos
    this.ctx.fillStyle = "#000"

    // Posicionar olhos baseado na direção
    let eyeX1, eyeY1, eyeX2, eyeY2
    const eyeSize = CELL_SIZE / 5
    const eyeOffset = CELL_SIZE / 4

    switch (this.direction) {
      case Direction.UP:
        eyeX1 = this.snake[0].x * CELL_SIZE + eyeOffset
        eyeY1 = this.snake[0].y * CELL_SIZE + eyeOffset
        eyeX2 = this.snake[0].x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize
        eyeY2 = this.snake[0].y * CELL_SIZE + eyeOffset
        break
      case Direction.DOWN:
        eyeX1 = this.snake[0].x * CELL_SIZE + eyeOffset
        eyeY1 = this.snake[0].y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize
        eyeX2 = this.snake[0].x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize
        eyeY2 = this.snake[0].y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize
        break
      case Direction.LEFT:
        eyeX1 = this.snake[0].x * CELL_SIZE + eyeOffset
        eyeY1 = this.snake[0].y * CELL_SIZE + eyeOffset
        eyeX2 = this.snake[0].x * CELL_SIZE + eyeOffset
        eyeY2 = this.snake[0].y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize
        break
      case Direction.RIGHT:
        eyeX1 = this.snake[0].x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize
        eyeY1 = this.snake[0].y * CELL_SIZE + eyeOffset
        eyeX2 = this.snake[0].x * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize
        eyeY2 = this.snake[0].y * CELL_SIZE + CELL_SIZE - eyeOffset - eyeSize
        break
    }

    this.ctx.fillRect(eyeX1, eyeY1, eyeSize, eyeSize)
    this.ctx.fillRect(eyeX2, eyeY2, eyeSize, eyeSize)
  }

  levelUp() {
    // Aumentar nível
    this.level++
    this.levelElement.textContent = this.level

    // Pausar jogo
    this.isPaused = true

    // Mostrar tela de subida de nível
    this.newLevelElement.textContent = this.level
    this.levelDescriptionElement.textContent = LEVEL_THEMES[this.level - 1].message
    this.levelUpScreen.classList.remove("hidden")

    // Aumentar velocidade do jogo
    if (this.gameMode === GameMode.MAZE) {
      // Aceleração mais gradual ao subir de nível no modo labirinto
      this.gameSpeed = Math.max(MAX_SPEED, this.gameSpeed - SPEED_INCREMENT)
    } else {
      this.gameSpeed = Math.max(MAX_SPEED, this.gameSpeed - SPEED_INCREMENT * 2)
    }
  }

  continueToNextLevel() {
    // Esconder tela de subida de nível
    this.levelUpScreen.classList.add("hidden")

    // Inicializar novo nível
    this.initLevel()

    // Retomar jogo
    this.isPaused = false
  }

  showGameOver() {
    // Parar jogo
    this.isRunning = false

    // Atualizar recorde
    if (this.score > this.highScore) {
      this.highScore = this.score
      localStorage.setItem("snakeHighScore", this.highScore)
      this.highScoreElement.textContent = this.highScore
      this.newHighScoreElement.classList.remove("hidden")
    } else {
      this.newHighScoreElement.classList.add("hidden")
    }

    // Atualizar tela de game over
    this.finalScoreElement.textContent = this.score
    this.finalLevelElement.textContent = this.level

    // Mostrar tela de game over
    this.gameOverScreen.classList.remove("hidden")
  }

  restartGame() {
    // Esconder tela de game over
    this.gameOverScreen.classList.add("hidden")

    // Resetar e iniciar jogo
    this.resetGame()
    this.isRunning = true
    this.gameOver = false
    this.lastFrameTime = performance.now()
    requestAnimationFrame(this.gameLoop.bind(this))
  }

  togglePause() {
    if (this.gameOver) return

    this.isPaused = !this.isPaused

    if (this.isPaused) {
      this.pauseScreen.classList.remove("hidden")
    } else {
      this.pauseScreen.classList.add("hidden")
    }
  }

  resumeGame() {
    this.isPaused = false
    this.pauseScreen.classList.add("hidden")
  }

  quitGame() {
    this.isRunning = false
    this.pauseScreen.classList.add("hidden")
    this.showStartScreen()
  }

  showStartScreen() {
    // Esconder todas as telas
    this.gameOverScreen.classList.add("hidden")
    this.pauseScreen.classList.add("hidden")
    this.levelUpScreen.classList.add("hidden")

    // Mostrar tela inicial
    this.startScreen.classList.remove("hidden")

    // Resetar modo de jogo
    this.selectGameMode(GameMode.CLASSIC)
  }
}

// Inicializar jogo quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  new SnakeGame()
})

