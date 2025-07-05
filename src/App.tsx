import { useState, useEffect, useCallback, useRef } from 'react'
import './App.css'
import { SettingsMenu } from './components'

function App() {
  const [time, setTime] = useState(25 * 60) // 25 minutes
  const [isRunning, setIsRunning] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [currentSession, setCurrentSession] = useState(0) // Track completed work sessions
  const [isBreakTime, setIsBreakTime] = useState(false) // Track if currently in break
  
  // Settings state
  const [workDuration, setWorkDuration] = useState(25)
  const [shortBreakDuration, setShortBreakDuration] = useState(5)
  const [longBreakDuration, setLongBreakDuration] = useState(15)
  const [sessionsBeforeLongBreak, setSessionsBeforeLongBreak] = useState(4)

  // Use refs to access latest state values in the interval callback
  const timeRef = useRef(time)
  const isBreakTimeRef = useRef(isBreakTime)
  const currentSessionRef = useRef(currentSession)
  const workDurationRef = useRef(workDuration)
  const shortBreakDurationRef = useRef(shortBreakDuration)
  const longBreakDurationRef = useRef(longBreakDuration)
  const sessionsBeforeLongBreakRef = useRef(sessionsBeforeLongBreak)

  // Update refs when state changes
  timeRef.current = time
  isBreakTimeRef.current = isBreakTime
  currentSessionRef.current = currentSession
  workDurationRef.current = workDuration
  shortBreakDurationRef.current = shortBreakDuration
  longBreakDurationRef.current = longBreakDuration
  sessionsBeforeLongBreakRef.current = sessionsBeforeLongBreak

  useEffect(() => {
    if (!isRunning) return

    const interval = setInterval(() => {
      const currentTime = timeRef.current
      
      if (currentTime === 0) {
        // Timer finished - auto switch between work and break
        if (isBreakTimeRef.current) {
          // Break finished, start new work session
          setIsBreakTime(false)
          setTime(workDurationRef.current * 60)
        } else {
          // Work session finished, start break
          const completedSessions = currentSessionRef.current + 1
          setCurrentSession(completedSessions)
          setIsBreakTime(true)
          
          // Determine if it's time for long break
          if (completedSessions % sessionsBeforeLongBreakRef.current === 0) {
            setTime(longBreakDurationRef.current * 60)
          } else {
            setTime(shortBreakDurationRef.current * 60)
          }
        }
      } else {
        setTime(prev => prev - 1)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [isRunning]) // Only depend on isRunning

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const toggleMenu = () => {
    setIsMenuOpen(prev => !prev)
  }

  const updateWorkDuration = useCallback((minutes: number) => {
    setWorkDuration(minutes)
    if (!isRunning && !isBreakTime) {
      setTime(minutes * 60)
    }
  }, [isRunning, isBreakTime])

  const resetTimer = () => {
    setTime(workDuration * 60)
    setIsRunning(false)
    setIsBreakTime(false)
    setCurrentSession(0)
  }

  const getCurrentPhase = () => {
    if (!isBreakTime) return 'Work Session'
    const isLongBreak = currentSession % sessionsBeforeLongBreak === 0
    return isLongBreak ? 'Long Break' : 'Short Break'
  }

  return (
    <div className="app">
      <div className="content-wrapper">
        {/* Menu Button */}
        <button 
          className={`menu-toggle ${isMenuOpen ? 'hidden' : ''}`}
          onClick={toggleMenu}
          aria-label="Toggle Settings Menu"
          aria-expanded={isMenuOpen}
          aria-controls="settings-menu"
        >
          <svg className="menu-icon" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 8C9.79 8 8 9.79 8 12C8 14.21 9.79 16 12 16C14.21 16 16 14.21 16 12C16 9.79 14.21 8 12 8ZM12 14C10.9 14 10 13.1 10 12C10 10.9 10.9 10 12 10C13.1 10 14 10.9 14 12C14 13.1 13.1 14 12 14Z" fill="white"/>
            <path d="M19.43 12.98C19.47 12.66 19.5 12.34 19.5 12C19.5 11.66 19.47 11.34 19.43 11.02L21.54 9.37C21.73 9.22 21.78 8.95 21.66 8.73L19.66 5.27C19.54 5.05 19.27 4.97 19.05 5.05L16.56 6.05C16.04 5.65 15.48 5.32 14.87 5.07L14.49 2.42C14.46 2.18 14.25 2 14 2H10C9.75 2 9.54 2.18 9.51 2.42L9.13 5.07C8.52 5.32 7.96 5.66 7.44 6.05L4.95 5.05C4.72 4.96 4.46 5.05 4.34 5.27L2.34 8.73C2.21 8.95 2.27 9.22 2.46 9.37L4.57 11.02C4.53 11.34 4.5 11.67 4.5 12C4.5 12.33 4.53 12.66 4.57 12.98L2.46 14.63C2.27 14.78 2.21 15.05 2.34 15.27L4.34 18.73C4.46 18.95 4.73 19.03 4.95 18.95L7.44 17.95C7.96 18.35 8.52 18.68 9.13 18.93L9.51 21.58C9.54 21.82 9.75 22 10 22H14C14.25 22 14.46 21.82 14.49 21.58L14.87 18.93C15.48 18.68 16.04 18.34 16.56 17.95L19.05 18.95C19.28 19.04 19.54 18.95 19.66 18.73L21.66 15.27C21.78 15.05 21.73 14.78 21.54 14.63L19.43 12.98Z" fill="white"/>
          </svg>
        </button>

        <SettingsMenu
          isOpen={isMenuOpen}
          onClose={toggleMenu}
          workDuration={workDuration}
          shortBreakDuration={shortBreakDuration}
          longBreakDuration={longBreakDuration}
          sessionsBeforeLongBreak={sessionsBeforeLongBreak}
          onWorkDurationChange={updateWorkDuration}
          onShortBreakChange={setShortBreakDuration}
          onLongBreakChange={setLongBreakDuration}
          onSessionsChange={setSessionsBeforeLongBreak}
        />

        <header className={`hero-section ${isMenuOpen ? 'menu-open' : ''}`}>
          <div className="hero-text">
            <h1 className="hero-title">Fomoduct</h1>
            <p className="hero-subtitle">Focus & Productivity Made Simple</p>
          </div>
        </header>
        
        <main className={`timer-section ${isMenuOpen ? 'menu-open' : ''}`}>
          <div className="timer-card">
            <div className="session-info">
              <div className="current-phase">{getCurrentPhase()}</div>
              <div className="session-counter">
                Session {currentSession + (isBreakTime ? 0 : 1)} • Completed: {currentSession}
              </div>
            </div>
            <div className="timer-display">
              {formatTime(time)}
            </div>
            <div className="timer-controls">
              <button 
                className={`control-btn primary ${isRunning ? 'pause' : 'start'}`}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? 'Pause' : 'Start'}
              </button>
              <button 
                className="control-btn secondary reset"
                onClick={resetTimer}
              >
                Reset
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default App