import { useCallback, useRef } from 'react'
import { useScrollLock, useFocusTrap } from '../hooks'

interface SettingsMenuProps {
  isOpen: boolean
  onClose: () => void
  workDuration: number
  shortBreakDuration: number
  longBreakDuration: number
  sessionsBeforeLongBreak: number
  onWorkDurationChange: (minutes: number) => void
  onShortBreakChange: (minutes: number) => void
  onLongBreakChange: (minutes: number) => void
  onSessionsChange: (sessions: number) => void
}

export const SettingsMenu = ({
  isOpen,
  onClose,
  workDuration,
  shortBreakDuration,
  longBreakDuration,
  sessionsBeforeLongBreak,
  onWorkDurationChange,
  onShortBreakChange,
  onLongBreakChange,
  onSessionsChange
}: SettingsMenuProps) => {
  // Ref for the settings menu container
  const menuRef = useRef<HTMLDivElement>(null)

  // Custom hooks for scroll lock and focus trap
  useScrollLock(isOpen)
  
  const handleMenuEscape = useCallback(() => {
    onClose()
  }, [onClose])
  
  useFocusTrap({
    isEnabled: isOpen,
    containerRef: menuRef,
    onEscape: handleMenuEscape
  })

  const updateWorkDuration = useCallback((minutes: number) => {
    onWorkDurationChange(minutes)
  }, [onWorkDurationChange])

  // Generic helper to parse and clamp input values
  const clampInput = (value: string, min: number, max: number, defaultValue: number = min): number => {
    const num = parseInt(value, 10) || defaultValue
    return Math.max(min, Math.min(max, num))
  }

  const handleWorkDurationInput = (value: string) => {
    const validNum = clampInput(value, 1, 180, 1)
    updateWorkDuration(validNum)
  }

  const handleShortBreakInput = (value: string) => {
    const validNum = clampInput(value, 1, 60, 1)
    onShortBreakChange(validNum)
  }

  const handleLongBreakInput = (value: string) => {
    const validNum = clampInput(value, 1, 120, 1)
    onLongBreakChange(validNum)
  }

  const handleSessionsInput = (value: string) => {
    const validNum = clampInput(value, 2, 20, 2)
    onSessionsChange(validNum)
  }

  return (
    <>
      {/* Sliding Menu */}
      <div 
        id="settings-menu"
        ref={menuRef}
        className={`settings-menu ${isOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-menu-title"
        aria-hidden={!isOpen}
      >
        <div className="menu-header">
          <h3 id="settings-menu-title">Settings</h3>
          <button 
            className="close-btn"
            onClick={onClose}
            aria-label="Close Menu"
          >
            ×
          </button>
        </div>
        
        <div className="menu-content">
          <div className="setting-group">
            <label htmlFor="work-duration-input">Work Duration (minutes)</label>
            <div className="duration-controls">
              <button 
                onClick={() => updateWorkDuration(Math.max(1, workDuration - 1))}
                className="duration-btn"
              >
                -
              </button>
              <input
                id="work-duration-input"
                type="number"
                value={workDuration}
                onChange={(e) => handleWorkDurationInput(e.target.value)}
                className="duration-input"
                min="1"
                max="180"
              />
              <button 
                onClick={() => updateWorkDuration(workDuration + 1)}
                className="duration-btn"
              >
                +
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label htmlFor="short-break-input">Short Break Duration (minutes)</label>
            <div className="duration-controls">
              <button 
                onClick={() => onShortBreakChange(Math.max(1, shortBreakDuration - 1))}
                className="duration-btn"
              >
                -
              </button>
              <input
                id="short-break-input"
                type="number"
                value={shortBreakDuration}
                onChange={(e) => handleShortBreakInput(e.target.value)}
                className="duration-input"
                min="1"
                max="60"
              />
              <button 
                onClick={() => onShortBreakChange(shortBreakDuration + 1)}
                className="duration-btn"
              >
                +
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label htmlFor="long-break-input">Long Break Duration (minutes)</label>
            <div className="duration-controls">
              <button 
                onClick={() => onLongBreakChange(Math.max(1, longBreakDuration - 1))}
                className="duration-btn"
              >
                -
              </button>
              <input
                id="long-break-input"
                type="number"
                value={longBreakDuration}
                onChange={(e) => handleLongBreakInput(e.target.value)}
                className="duration-input"
                min="1"
                max="120"
              />
              <button 
                onClick={() => onLongBreakChange(longBreakDuration + 1)}
                className="duration-btn"
              >
                +
              </button>
            </div>
          </div>

          <div className="setting-group">
            <label htmlFor="sessions-input">Sessions Before Long Break</label>
            <div className="duration-controls">
              <button 
                onClick={() => onSessionsChange(Math.max(2, sessionsBeforeLongBreak - 1))}
                className="duration-btn"
              >
                -
              </button>
              <input
                id="sessions-input"
                type="number"
                value={sessionsBeforeLongBreak}
                onChange={(e) => handleSessionsInput(e.target.value)}
                className="duration-input"
                min="2"
                max="20"
              />
              <button 
                onClick={() => onSessionsChange(sessionsBeforeLongBreak + 1)}
                className="duration-btn"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Full Screen Overlay - Blocks all interactions */}
      {isOpen && (
        <div 
          className="menu-overlay" 
          onClick={onClose}
          onWheel={(e) => e.preventDefault()}
          onTouchMove={(e) => e.preventDefault()}
          aria-hidden="true"
        ></div>
      )}
    </>
  )
}
