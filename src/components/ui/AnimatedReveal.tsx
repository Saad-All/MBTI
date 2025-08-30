'use client'

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { prefersReducedMotion } from '@/lib/utils/animations'

interface AnimatedRevealProps {
  children: React.ReactNode
  delay?: number
  duration?: number
  className?: string
  onRevealComplete?: () => void
}

export function AnimatedReveal({
  children,
  delay = 0,
  duration = 2000,
  className = '',
  onRevealComplete
}: AnimatedRevealProps) {
  const [isRevealed, setIsRevealed] = useState(false)
  const reducedMotion = prefersReducedMotion()
  
  useEffect(() => {
    const actualDelay = reducedMotion ? 0 : delay
    const actualDuration = reducedMotion ? 0 : duration
    
    const timer = setTimeout(() => {
      setIsRevealed(true)
      
      if (onRevealComplete) {
        const completeTimer = setTimeout(onRevealComplete, actualDuration)
        return () => clearTimeout(completeTimer)
      }
    }, actualDelay)
    
    return () => clearTimeout(timer)
  }, [delay, duration, onRevealComplete, reducedMotion])
  
  return (
    <div
      className={clsx(
        'transition-all ease-in-out',
        isRevealed ? 'opacity-100 scale-100' : 'opacity-0 scale-95',
        className
      )}
      style={{
        transitionDuration: reducedMotion ? '0ms' : `${duration}ms`
      }}
    >
      {children}
    </div>
  )
}

// Staggered reveal for lists
interface StaggeredRevealProps {
  children: React.ReactNode[]
  staggerDelay?: number
  itemDuration?: number
  className?: string
}

export function StaggeredReveal({
  children,
  staggerDelay = 100,
  itemDuration = 300,
  className = ''
}: StaggeredRevealProps) {
  const reducedMotion = prefersReducedMotion()
  const actualStagger = reducedMotion ? 0 : staggerDelay
  
  return (
    <div className={className}>
      {children.map((child, index) => (
        <AnimatedReveal
          key={index}
          delay={index * actualStagger}
          duration={itemDuration}
        >
          {child}
        </AnimatedReveal>
      ))}
    </div>
  )
}

// MBTI Type reveal animation
interface TypeRevealProps {
  type: string
  className?: string
  onComplete?: () => void
}

export function TypeReveal({ type, className = '', onComplete }: TypeRevealProps) {
  const [revealedLetters, setRevealedLetters] = useState(0)
  const reducedMotion = prefersReducedMotion()
  
  useEffect(() => {
    if (reducedMotion) {
      setRevealedLetters(type.length)
      onComplete?.()
      return
    }
    
    const revealDuration = 2000
    const letterDelay = revealDuration / type.length
    
    const timers: NodeJS.Timeout[] = []
    
    type.split('').forEach((_, index) => {
      const timer = setTimeout(() => {
        setRevealedLetters(index + 1)
        
        if (index === type.length - 1) {
          onComplete?.()
        }
      }, letterDelay * (index + 1))
      
      timers.push(timer)
    })
    
    return () => timers.forEach(clearTimeout)
  }, [type, onComplete, reducedMotion])
  
  return (
    <div className={clsx('font-mono text-6xl font-bold', className)}>
      {type.split('').map((letter, index) => (
        <span
          key={index}
          className={clsx(
            'inline-block transition-all duration-500',
            index < revealedLetters
              ? 'opacity-100 transform translate-y-0'
              : 'opacity-0 transform translate-y-4'
          )}
        >
          {letter}
        </span>
      ))}
    </div>
  )
}