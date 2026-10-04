const { app, BrowserWindow, ipcMain } = require('electron')
const mineflayer = require('mineflayer')
const path = require('path')

let CONFIG = {
  host: 'domenaserwera.pl',
  port: 25565,
  version: '1.21.1',
  botCount: 20,
  spawnDelayMs: 1000,
  reconnectDelayMs: 5000,
  chatIntervalMs: 5000,
  actionIntervalMs: 2000,
  auth: 'offline',
  botPassword: 'TestPassword123!',
  humanTypingDelay: { min: 2500, max: 6000 },
  messages: [],
  commands: []
}

let activeBots = new Map()
let activeTimeouts = []
let isRunning = false

function stopAllBots() {
  isRunning = false

  activeTimeouts.forEach(clearTimeout)
  activeTimeouts = []

  for (const [username, bot] of activeBots.entries()) {
    try {
      bot.end()
    } catch (e) {}
  }
  activeBots.clear()
  console.log('[!] Zatrzymano wszystkie boty.')
}

function startBots(newConfig) {
  stopAllBots()
  CONFIG = { ...CONFIG, ...newConfig }
  isRunning = true

  console.log(`=== START STRESS TESTERA (${CONFIG.botCount} botów) ===`)

  for (let i = 0; i < CONFIG.botCount; i++) {
    const timer = setTimeout(() => {
      if (!isRunning) return
      const randomNick = generateRandomUsername(10)
      createBot(randomNick, i)
    }, i * CONFIG.spawnDelayMs)

    activeTimeouts.push(timer)
  }
}

function getHumanDelay(min = CONFIG.humanTypingDelay.min, max = CONFIG.humanTypingDelay.max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatKickReason(reason) {
  if (!reason) return 'Brak podanego powodu'
  if (typeof reason === 'string') return reason
  try {
    if (typeof reason === 'object') {
      if (reason.text) return reason.text
      return JSON.stringify(reason)
    }
  } catch (e) {
    return String(reason)
  }
  return String(reason)
}

function generateRandomUsername(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

function createBot(username, index) {
  if (!isRunning) return

  const bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: username,
    version: CONFIG.version,
    auth: CONFIG.auth
  })

  activeBots.set(username, bot)
  const activeIntervals = []
  let isRateLimited = false
  let hasAttemptedRegister = false
  let hasAttemptedLogin = false

  function safeSetInterval(fn, ms) {
    const timer = setInterval(fn, ms)
    activeIntervals.push(timer)
    return timer
  }

  function cleanup() {
    activeIntervals.forEach(clearInterval)
    activeIntervals.length = 0
  }

  bot.on('message', (jsonMsg) => {
    const text = jsonMsg.toString().toLowerCase()

    if ((text.includes('/register') || text.includes('zarejestruj')) && !hasAttemptedRegister) {
      hasAttemptedRegister = true
      const delay = getHumanDelay()
      console.log(`[i] [${username}] Prośba o rejestrację. Wpisywanie za ${(delay / 1000).toFixed(1)}s...`)

      setTimeout(() => {
        if (bot && bot.entity) {
          bot.chat(`/register ${CONFIG.botPassword} ${CONFIG.botPassword}`)
        }
      }, delay)
    } else if ((text.includes('/login') || text.includes('zaloguj')) && !hasAttemptedLogin) {
      hasAttemptedLogin = true
      const delay = getHumanDelay()
      console.log(`[i] [${username}] Prośba o logowanie. Wpisywanie za ${(delay / 1000).toFixed(1)}s...`)

      setTimeout(() => {
        if (bot && bot.entity) {
          bot.chat(`/login ${CONFIG.botPassword}`)
        }
      }, delay)
    }
  })

  bot.once('spawn', () => {
    console.log(`[+] [${username}] Zalogowano pomyślnie.`)

    setTimeout(() => {
      if (!hasAttemptedRegister && !hasAttemptedLogin) {
        hasAttemptedRegister = true
        bot.chat(`/register ${CONFIG.botPassword} ${CONFIG.botPassword}`)
      }
    }, getHumanDelay(3000, 7000))

    safeSetInterval(() => {
      if (!bot.entity) return
      const directions = ['forward', 'back', 'left', 'right']
      const randomDirection = directions[Math.floor(Math.random() * directions.length)]

      bot.setControlState('sprint', Math.random() > 0.4)
      bot.setControlState('jump', Math.random() > 0.5)
      bot.setControlState('sneak', Math.random() > 0.8)

      bot.setControlState(randomDirection, true)
      setTimeout(() => {
        if (bot && bot.entity) bot.setControlState(randomDirection, false)
      }, 500 + Math.random() * 1000)

      if (Math.random() > 0.3) bot.swingArm('mainhand')
    }, CONFIG.actionIntervalMs + Math.random() * 2000)

    safeSetInterval(() => {
      if (!bot.entity) return
      const yaw = (Math.random() * Math.PI * 2) - Math.PI
      const pitch = (Math.random() * Math.PI) - (Math.PI / 2)
      bot.look(yaw, pitch, true).catch(() => {})
    }, 1500 + Math.random() * 1000)

    safeSetInterval(() => {
      if (!bot.entity) return
      if (CONFIG.messages.length > 0 && Math.random() < 0.7) {
        const msg = CONFIG.messages[Math.floor(Math.random() * CONFIG.messages.length)]
        bot.chat(`${msg} [${Math.floor(Math.random() * 8999 + 1000)}]`)
      } else if (CONFIG.commands.length > 0) {
        const cmd = CONFIG.commands[Math.floor(Math.random() * CONFIG.commands.length)]
        bot.chat(cmd)
      }
    }, CONFIG.chatIntervalMs + Math.random() * 4000)
  })

  bot.on('kicked', (reason) => {
    const parsedReason = formatKickReason(reason)
    console.log(`[!] [${username}] Wyrzucony: ${parsedReason}`)
    if (parsedReason.toLowerCase().includes('zbyt często') || parsedReason.toLowerCase().includes('frequently')) {
      isRateLimited = true
    }
  })

  bot.on('error', (err) => console.log(`[X] [${username}] Błąd: ${err.message}`))

  bot.once('end', () => {
    cleanup()
    activeBots.delete(username)

    if (!isRunning) return

    const waitTime = isRateLimited
      ? 30000 + Math.random() * 10000
      : CONFIG.reconnectDelayMs + (index * 1000)

    console.log(`[-] [${username}] Rozłączono. Ponowne łączenie za ${Math.round(waitTime / 1000)}s...`)

    const timer = setTimeout(() => {
      if (isRunning) createBot(generateRandomUsername(10), index)
    }, waitTime)

    activeTimeouts.push(timer)
  })
}

// GUI ELECTRON
let guiWindow = null
let guiLogs = []

const originalConsoleLog = console.log
console.log = (...args) => {
  const message = args.map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ')
  guiLogs.push(message)
  if (guiLogs.length > 500) guiLogs.shift()
  originalConsoleLog(...args)

  if (guiWindow && !guiWindow.isDestroyed()) {
    guiWindow.webContents.send('gui-log', message)
  }
}

ipcMain.on('start-test', (_, userConfig) => startBots(userConfig))
ipcMain.on('stop-test', () => stopAllBots())

function createGUI() {
  guiWindow = new BrowserWindow({
    width: 1100,
    height: 800,
    minWidth: 850,
    minHeight: 600,
    title: 'Mineflayer Control Panel',
    backgroundColor: '#11151c',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  })

  // Ładowanie z pliku rozwiązuje problem braku możliwości wpisywania tekstu
  guiWindow.loadFile(path.join(__dirname, 'index.html'))

  guiWindow.on('closed', () => { guiWindow = null })

  guiWindow.webContents.once('did-finish-load', () => {
    for (const message of guiLogs) {
      guiWindow.webContents.send('gui-log', message)
    }
  })
}

app.whenReady().then(createGUI)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
})