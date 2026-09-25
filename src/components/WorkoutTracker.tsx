import React, { useState, useEffect } from 'react'
import { CheckSquare, Square, Calendar, Target, Flame, Clock, Bike } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'

// Tipos para garantir compatibilidade com TypeScript estrito
type ExerciseType = 'DS' | 'SP' | 'CARDIO' | 'N'

interface Exercise {
  id: string
  name: string
  reps: string
  sets: string
  type: ExerciseType
  rir?: string
  alternatives?: string[]
}

interface Workout {
  name: string
  day: string
  color: string // classe Tailwind para cor de destaque
  cardio: string
  exercises: Exercise[]
}

type WorkoutKey = 'A' | 'B' | 'C' | 'D' | 'E'

// Início da rotina Upper/Lower. Conclusões anteriores a esta data pertencem à
// rotina antiga (A-E) e são exibidas como "Treino anterior" no histórico.
// IDs de exercício novos (ua*, la*, ub*, lb*, rc*) evitam herdar cargas antigas.
const ROUTINE_START = '2026-09-25'

const workouts: Record<WorkoutKey, Workout> = {
  A: {
    name: 'TREINO A - UPPER A',
    day: 'Segunda-feira',
    color: 'bg-blue-600',
    cardio: 'Esteira 10 min leve (opcional)',
    exercises: [
      { id: 'ua1', name: 'Supino Reto com Barra', reps: '6-8', sets: '3x', type: 'N', rir: '2' },
      { id: 'ua2', name: 'Puxada Aberta (Pegada Pronada)', reps: '6-10', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'ua3', name: 'Supino Inclinado com Halteres', reps: '8-10', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'ua4', name: 'Remada Apoiada no Banco (Halteres)', reps: '8-10', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'ua5', name: 'Elevação Lateral', reps: '10-15', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'ua6', name: 'Tríceps na Polia', reps: '10-15', sets: '2x', type: 'N', rir: '1-2' },
      { id: 'ua7', name: 'Rosca Direta', reps: '8-12', sets: '2x', type: 'N', rir: '1-2' },
    ],
  },
  B: {
    name: 'TREINO B - LOWER A',
    day: 'Terça-feira',
    color: 'bg-red-600',
    cardio: 'Bicicleta 10 min leve',
    exercises: [
      { id: 'la1', name: 'Agachamento Livre', reps: '6-8', sets: '3x', type: 'N', rir: '2', alternatives: ['Agachamento Smith'] },
      { id: 'la2', name: 'Leg Press', reps: '8-12', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'la3', name: 'Stiff com Barra', reps: '6-10', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'la4', name: 'Mesa Flexora', reps: '10-15', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'la5', name: 'Cadeira Extensora', reps: '10-15', sets: '2x', type: 'N', rir: '1-2' },
      { id: 'la6', name: 'Panturrilha em Pé', reps: '8-12', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'la7', name: 'Abdominal', reps: '10-15', sets: '2-3x', type: 'N', rir: '1-2' },
    ],
  },
  C: {
    name: 'TREINO C - UPPER B',
    day: 'Quinta-feira',
    color: 'bg-green-600',
    cardio: 'Esteira 10 min leve',
    exercises: [
      { id: 'ub1', name: 'Remada Cavalinho', reps: '6-10', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'ub2', name: 'Supino Inclinado com Barra', reps: '6-10', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'ub3', name: 'Puxada Triângulo (Neutra)', reps: '8-12', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'ub4', name: 'Crucifixo na Máquina (Peck Deck)', reps: '10-15', sets: '2x', type: 'N', rir: '1-2' },
      { id: 'ub5', name: 'Desenvolvimento com Halteres', reps: '6-10', sets: '2x', type: 'N', rir: '2' },
      { id: 'ub6', name: 'Elevação Lateral', reps: '12-20', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'ub7', name: 'Rosca Martelo', reps: '8-12', sets: '2x', type: 'N', rir: '1-2' },
      { id: 'ub8', name: 'Tríceps Francês na Polia', reps: '8-12', sets: '2x', type: 'N', rir: '1-2' },
    ],
  },
  D: {
    name: 'TREINO D - LOWER B',
    day: 'Sexta-feira',
    color: 'bg-purple-600',
    cardio: 'Bicicleta 10 min leve',
    exercises: [
      // Ordem obrigatória: Hack antes do Stiff
      { id: 'lb1', name: 'Agachamento Hack', reps: '8-10', sets: '3x', type: 'N', rir: '1-2', alternatives: ['Agachamento Smith', 'Leg Press'] },
      { id: 'lb2', name: 'Stiff com Barra', reps: '6-8', sets: '3x', type: 'N', rir: '2' },
      { id: 'lb3', name: 'Hip Thrust', reps: '8-12', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'lb4', name: 'Mesa Flexora', reps: '10-15', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'lb8', name: 'Abdução na Máquina', reps: '12-15', sets: '2-3x', type: 'N', rir: '1-2' },
      { id: 'lb6', name: 'Panturrilha Sentado', reps: '10-15', sets: '3x', type: 'N', rir: '1-2' },
      { id: 'lb7', name: 'Abdominal', reps: '10-15', sets: '2-3x', type: 'N', rir: '1-2' },
    ],
  },
  E: {
    name: 'TREINO E - CARDIO / RECUPERAÇÃO (OPCIONAL)',
    day: 'Sábado',
    color: 'bg-orange-600',
    cardio: 'Caminhada na Esteira 30–45 min (opcional)',
    exercises: [
      { id: 'rc1', name: 'Caminhada na Esteira', reps: '30-45 min', sets: '1x', type: 'CARDIO' },
      { id: 'rc2', name: 'Mobilidade', reps: '5-10 min', sets: '1x', type: 'N' },
    ],
  },
}

// Lê do localStorage na inicialização do estado, antes que os efeitos de persistência gravem o estado vazio
const readLocal = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

const WorkoutTracker: React.FC = () => {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutKey>(() => {
    const saved = localStorage.getItem('currentWorkout') as WorkoutKey | null
    return saved && saved in workouts ? saved : 'A'
  })
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>(() => readLocal('completedExercises', {}))
  const [workoutHistory, setWorkoutHistory] = useState<Array<{ workout: WorkoutKey; date: string; completed: boolean }>>(() => readLocal('workoutHistory', []))

  // Filtro e dados do calendário visual
  const [calendarFilter, setCalendarFilter] = useState<'week' | 'month' | 'year'>('month')
  const [anchorDate] = useState<Date>(new Date())
  const [calendarCompletions, setCalendarCompletions] = useState<Set<string>>(new Set())
  const [calendarMisses, setCalendarMisses] = useState<Set<string>>(new Set())

  // Timer de descanso com duração configurável (sem som, com vibração)
  const [timerDuration, setTimerDuration] = useState<number>(() => readLocal('timerDuration', 60))
  const [timerSeconds, setTimerSeconds] = useState<number>(0)
  const [timerActive, setTimerActive] = useState<boolean>(false)
  // Horário de término: mantém o tempo correto mesmo com a tela bloqueada/aba em segundo plano
  const [timerEndAt, setTimerEndAt] = useState<number | null>(null)
  const [isTimerOpen, setIsTimerOpen] = useState(false)

  const formatSeconds = (s: number) => {
    const mm = Math.floor(s / 60)
    const ss = s % 60
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
  }

  const startTimer = () => {
    setTimerSeconds(timerDuration)
    setTimerEndAt(Date.now() + timerDuration * 1000)
    setTimerActive(true)
  }
  const pauseTimer = () => {
    setTimerActive(false)
    setTimerEndAt(null)
  }
  const resumeTimer = () => {
    if (timerSeconds <= 0) return
    setTimerEndAt(Date.now() + timerSeconds * 1000)
    setTimerActive(true)
  }
  const stopTimer = () => {
    setTimerActive(false)
    setTimerEndAt(null)
    setTimerSeconds(0)
  }
  const changeTimerDuration = (seconds: number) => {
    const next = Math.min(Math.max(seconds, 5), 60 * 60)
    setTimerDuration(next)
    try {
      localStorage.setItem('timerDuration', JSON.stringify(next))
    } catch (err) {
      void err
    }
  }

  useEffect(() => {
    if (!timerActive || timerEndAt === null) return
    const tick = () => {
      const remaining = Math.max(0, Math.ceil((timerEndAt - Date.now()) / 1000))
      setTimerSeconds(remaining)
      if (remaining === 0) {
        setTimerActive(false)
        setTimerEndAt(null)
        // Vibração ao finalizar (sem som)
        if (typeof navigator.vibrate === 'function') navigator.vibrate([200, 100, 200])
      }
    }
    tick()
    const id = setInterval(tick, 250)
    return () => clearInterval(id)
  }, [timerActive, timerEndAt])

  // Mantém a tela acesa enquanto o timer em tela cheia está aberto
  useEffect(() => {
    if (!isTimerOpen) return
    type WakeLock = { release: () => Promise<void> }
    const wakeLockApi = (navigator as Navigator & { wakeLock?: { request: (type: 'screen') => Promise<WakeLock> } }).wakeLock
    let lock: WakeLock | null = null
    wakeLockApi?.request('screen').then(l => { lock = l }).catch(() => {})
    return () => { lock?.release().catch(() => {}) }
  }, [isTimerOpen])

  // Estado para carga e anotação por exercício
  const [exerciseNotes, setExerciseNotes] = useState<Record<string, { load: string; note: string }>>(() => readLocal('exerciseNotes', {}))
  // Controle de modal e seleção atual
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selected, setSelected] = useState<{ workoutId: WorkoutKey; exercise: Exercise } | null>(null)
  // Estados temporários do formulário do modal
  const [tempLoad, setTempLoad] = useState('')
  const [tempNote, setTempNote] = useState('')
  // User id autenticado (para RLS)
  const [userId, setUserId] = useState<string | null>(null)

  // Persistência/Hidratação: carregar últimos estados ao montar
  useEffect(() => {
    const hydrate = async () => {
      try {
        const { data: userRes } = await supabase.auth.getUser()
        const userId = userRes?.user?.id || null
        setUserId(userId)

        // server hydration (últimas cargas/anotações + histórico)
        if (userId) {
          const { data: latest, error: latestErr } = await supabase
            .from('exercise_entries_latest')
            .select('workout_id, exercise_id, load, note')
            .eq('user_id', userId)
          if (!latestErr && latest) {
            const notesMap: Record<string, { load: string; note: string }> = {}
            ;(latest as Array<{ workout_id: string; exercise_id: string; load: string | null; note: string | null }>).forEach(row => {
              const key = `${row.workout_id}-${row.exercise_id}`
              notesMap[key] = { load: row.load || '', note: row.note || '' }
            })
            if (Object.keys(notesMap).length > 0) setExerciseNotes(prev => ({ ...prev, ...notesMap }))
          }
          const { data: comp, error: compErr } = await supabase
            .from('workout_completions')
            .select('workout_id, date')
            .eq('user_id', userId)
            .order('date', { ascending: false })
            .limit(10)
          if (!compErr && comp) {
            const compRows = comp as Array<{ workout_id: string; date: string }>
            setWorkoutHistory(compRows.map(h => ({
              workout: h.workout_id as WorkoutKey,
              date: new Date(h.date).toLocaleDateString('pt-BR'),
              completed: true,
            })))
          }
        }
      } catch (err) {
        void err
      }
    }
    hydrate()
    try {
      const savedComp = localStorage.getItem('calendarCompletions')
      const savedMiss = localStorage.getItem('calendarMisses')
      if (savedComp) setCalendarCompletions(new Set(JSON.parse(savedComp)))
      if (savedMiss) setCalendarMisses(new Set(JSON.parse(savedMiss)))
    } catch (err) {
      void err
    }
  }, [])

  // Helpers de calendário
  const toISODate = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }
  const parsePtBrToISO = (dStr: string) => {
    const [dd, mm, yyyy] = dStr.split('/')
    if (!dd || !mm || !yyyy) return ''
    return `${yyyy}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`
  }
  const startOfDay = (d: Date) => {
    const nd = new Date(d)
    nd.setHours(0, 0, 0, 0)
    return nd
  }
  const addDays = (d: Date, days: number) => {
    const nd = new Date(d)
    nd.setDate(nd.getDate() + days)
    return nd
  }
  const getMonday = (d: Date) => {
    const nd = startOfDay(d)
    const day = nd.getDay()
    const diff = (day === 0 ? -6 : 1 - day)
    return addDays(nd, diff)
  }
  const getMonthRange = (d: Date) => {
    const start = startOfDay(new Date(d.getFullYear(), d.getMonth(), 1))
    const end = startOfDay(new Date(d.getFullYear(), d.getMonth() + 1, 0))
    return { start, end }
  }
  const getYearRange = (d: Date) => {
    const start = startOfDay(new Date(d.getFullYear(), 0, 1))
    const end = startOfDay(new Date(d.getFullYear(), 11, 31))
    return { start, end }
  }
  const getRangeForFilter = (d: Date, filter: 'week' | 'month' | 'year') => {
    if (filter === 'week') {
      const start = getMonday(d)
      const end = addDays(start, 6)
      return { start, end }
    }
    if (filter === 'month') return getMonthRange(d)
    return getYearRange(d)
  }
  const generateDaysForRange = (start: Date, end: Date) => {
    const days: Date[] = []
    let cur = new Date(start)
    while (cur <= end) {
      days.push(new Date(cur))
      cur = addDays(cur, 1)
    }
    return days
  }

  // Persistir marcação de calendário no Supabase
  const persistCalendarMark = async (iso: string, status: 'completed' | 'missed' | 'none') => {
    try {
      // Se não estiver autenticado, não tenta salvar no Supabase; persiste apenas localmente
      if (!userId) return

      if (status === 'none') {
        // Remover marcação para este dia
        const { error } = await supabase
          .from('calendar_marks')
          .delete()
          .eq('date', iso)
          .eq('user_id', userId)
        if (error) console.error('Erro ao remover marcação de calendário:', error.message)
      } else {
        const payload = { date: iso, status, user_id: userId }
        const { error } = await supabase
          .from('calendar_marks')
          .upsert(payload, { onConflict: 'user_id,date' })
        if (error) console.error('Erro ao salvar marcação de calendário:', error.message)
      }
    } catch (e) {
      console.error('Falha ao comunicar com Supabase (calendar_marks):', e)
    }
  }

  const toggleCalendarDay = (iso: string) => {
    // Determinar próximo estado com base nos conjuntos atuais
    const inComp = calendarCompletions.has(iso)
    const inMiss = calendarMisses.has(iso)

    let nextStatus: 'completed' | 'missed' | 'none'
    const newComp = new Set(calendarCompletions)
    const newMiss = new Set(calendarMisses)

    if (inComp) {
      // Verde -> Vermelho
      newComp.delete(iso)
      newMiss.add(iso)
      nextStatus = 'missed'
    } else if (inMiss) {
      // Vermelho -> Cinza
      newMiss.delete(iso)
      nextStatus = 'none'
    } else {
      // Cinza -> Verde
      newComp.add(iso)
      nextStatus = 'completed'
    }

    setCalendarCompletions(newComp)
    setCalendarMisses(newMiss)

    // Persistir no banco
    persistCalendarMark(iso, nextStatus)
  }

  // Carregar conclusões no intervalo do filtro
  useEffect(() => {
    const loadCompletions = async () => {
      const { start, end } = getRangeForFilter(anchorDate, calendarFilter)
      const startISO = toISODate(start)
      const endISO = toISODate(end)
      const compSet = new Set<string>()
      const missSet = new Set<string>()

      // 1) Carregar conclusões de treinos (workout_completions)
      if (userId) {
        try {
          const { data: wc, error: wcErr } = await supabase
            .from('workout_completions')
            .select('date')
            .eq('user_id', userId)
            .gte('date', startISO)
            .lte('date', endISO)
          if (!wcErr && wc) {
            ;(wc as Array<{ date: string }>).forEach(row => {
              const iso = String(row.date)
              compSet.add(iso)
            })
          }
        } catch (err) {
          void err
          workoutHistory.forEach(h => {
            const iso = parsePtBrToISO(h.date)
            if (iso) compSet.add(iso)
          })
        }
      } else {
        workoutHistory.forEach(h => {
          const iso = parsePtBrToISO(h.date)
          if (iso) compSet.add(iso)
        })
      }

      // 2) Carregar marcações do calendário (calendar_marks)
      try {
        let q = supabase
          .from('calendar_marks')
          .select('date, status')
          .gte('date', startISO)
          .lte('date', endISO)
        if (userId) q = q.eq('user_id', userId)
        const { data: cm, error: cmErr } = await q
        if (!cmErr && cm) {
          ;(cm as Array<{ date: string; status: string }>).forEach(row => {
            const iso = String(row.date)
            if (row.status === 'missed') {
              missSet.add(iso)
              // Remover de completos se estava lá
              compSet.delete(iso)
            } else if (row.status === 'completed') {
              compSet.add(iso)
              // Garantir que não esteja em misses
              missSet.delete(iso)
            }
          })
        }
      } catch (e) {
        // Se falhar, mantém apenas os conjuntos anteriores (workoutHistory)
        console.warn('Não foi possível carregar calendar_marks do Supabase:', e)
      }

      // 3) Se não estiver autenticado, mesclar com o que está salvo localmente para manter persistência pós-reload
      if (!userId) {
        try {
          const savedComp = localStorage.getItem('calendarCompletions')
          const savedMiss = localStorage.getItem('calendarMisses')
          if (savedComp) {
            const parsed: string[] = JSON.parse(savedComp)
            parsed.forEach(iso => compSet.add(iso))
          }
          if (savedMiss) {
            const parsed: string[] = JSON.parse(savedMiss)
            parsed.forEach(iso => {
              missSet.add(iso)
              compSet.delete(iso)
            })
          }
        } catch (err) {
          void err
        }
      }

      setCalendarCompletions(compSet)
      setCalendarMisses(missSet)
    }
    loadCompletions()
  }, [calendarFilter, anchorDate, userId, workoutHistory])

  // Persistência automática em localStorage
  useEffect(() => {
    localStorage.setItem('completedExercises', JSON.stringify(completedExercises))
  }, [completedExercises])
  useEffect(() => {
    localStorage.setItem('workoutHistory', JSON.stringify(workoutHistory))
  }, [workoutHistory])
  useEffect(() => {
    if (currentWorkout) localStorage.setItem('currentWorkout', currentWorkout)
  }, [currentWorkout])
  useEffect(() => {
    localStorage.setItem('exerciseNotes', JSON.stringify(exerciseNotes))
  }, [exerciseNotes])
  useEffect(() => {
    localStorage.setItem('calendarCompletions', JSON.stringify(Array.from(calendarCompletions)))
  }, [calendarCompletions])
  useEffect(() => {
    localStorage.setItem('calendarMisses', JSON.stringify(Array.from(calendarMisses)))
  }, [calendarMisses])
  const toggleExercise = (workoutId: WorkoutKey, exerciseId: string) => {
    const key = `${workoutId}-${exerciseId}`
    setCompletedExercises(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  // Abrir modal para editar carga/anotação
  const openExerciseModal = async (workoutId: WorkoutKey, exercise: Exercise) => {
    const key = `${workoutId}-${exercise.id}`

    // Pré-preenche com estado local, e tenta substituir com servidor se disponível
    const existing = exerciseNotes[key] || { load: '', note: '' }
    setTempLoad(existing.load || '')
    setTempNote(existing.note || '')

    try {
      // Tenta usar a view com o último registro
      const viewBase = supabase
        .from('exercise_entries_latest')
        .select('load, note')
        .eq('workout_id', workoutId)
        .eq('exercise_id', exercise.id)
        .limit(1)
      const { data, error } = await (userId ? viewBase.eq('user_id', userId) : viewBase)

      if (!error && data && data.length > 0) {
        setTempLoad(data[0].load || '')
        setTempNote(data[0].note || '')
      } else {
        // Fallback para a tabela base
        const baseQuery = supabase
          .from('exercise_entries')
          .select('load, note')
          .eq('workout_id', workoutId)
          .eq('exercise_id', exercise.id)
          .order('date', { ascending: false })
          .limit(1)
        const { data: dataBase, error: errorBase } = await (userId ? baseQuery.eq('user_id', userId) : baseQuery)
        if (!errorBase && dataBase && dataBase.length > 0) {
          setTempLoad(dataBase[0].load || '')
          setTempNote(dataBase[0].note || '')
        }
      }
    } catch (err) {
      void err
    }

    setSelected({ workoutId, exercise })
    setIsModalOpen(true)
  }

  // Salvar dados do modal
  const saveExerciseModal = async () => {
    if (!selected) return
    const key = `${selected.workoutId}-${selected.exercise.id}`

    // Atualiza estado local sempre
    setExerciseNotes(prev => ({
      ...prev,
      [key]: { load: tempLoad, note: tempNote },
    }))

    // Persistir no Supabase (requer usuário autenticado por RLS)
    if (!userId) {
      console.warn('Usuário não autenticado — salvando apenas local.')
    } else {
      try {
        const { error } = await supabase
          .from('exercise_entries')
          .insert({
            user_id: userId,
            workout_id: selected.workoutId,
            exercise_id: selected.exercise.id,
            load: tempLoad || null,
            note: tempNote || null,
            date: new Date().toISOString().slice(0, 10),
          })
        if (error) {
          console.error('Erro ao salvar no Supabase:', error.message)
        }
      } catch (e) {
        console.error('Falha ao comunicar com Supabase:', e)
      }
    }

    setIsModalOpen(false)
    setSelected(null)
  }

  const completeWorkout = async () => {
    const progress = getProgress(currentWorkout)
    if (progress === 100) {
      const newEntry = {
        workout: currentWorkout,
        date: new Date().toLocaleDateString('pt-BR'),
        completed: true,
      }
      setWorkoutHistory(prev => [newEntry, ...prev].slice(0, 10))

      // Resetar exercícios do treino atual
      const exercises = workouts[currentWorkout].exercises
      exercises.forEach(ex => {
        const key = `${currentWorkout}-${ex.id}`
        setCompletedExercises(prev => ({
          ...prev,
          [key]: false,
        }))
      })

      // Persistir conclusão no Supabase (modo sem autenticação)
      try {
        const today = new Date().toISOString().slice(0, 10)
        const payload = userId
          ? { workout_id: currentWorkout, date: today, user_id: userId }
          : { workout_id: currentWorkout, date: today }
        const { error } = await supabase
          .from('workout_completions')
          .insert(payload)
        if (error) {
          console.error('Erro ao registrar conclusão no Supabase:', error.message)
        }
      } catch (e) {
        console.error('Falha ao comunicar com Supabase (workout_completions):', e)
      }

      alert(`🔥 Treino ${currentWorkout} concluído! Excelente trabalho! 💪`)
      // Avançar automaticamente para o próximo treino
      setCurrentWorkout(getNextWorkout(currentWorkout))
    } else {
      alert('Complete todos os exercícios antes de finalizar o treino!')
    }
  }

  const getTypeColor = (type: ExerciseType) => {
    switch (type) {
      case 'DS':
        return 'text-orange-600 bg-orange-100'
      case 'SP':
        return 'text-purple-600 bg-purple-100'
      case 'CARDIO':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-blue-600 bg-blue-100'
    }
  }

  const getTypeLabel = (type: ExerciseType) => {
    switch (type) {
      case 'DS':
        return 'DROP SET'
      case 'SP':
        return 'ESPECIAL'
      case 'CARDIO':
        return 'CARDIO'
      default:
        return 'NORMAL'
    }
  }

  // Cor dinâmica da barra de progresso conforme percentual
  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-600'
    if (progress >= 50) return 'bg-yellow-500'
    return 'bg-gray-400'
  }

  // Próximo treino em sequência A → B → C → D → E → A
  const getNextWorkout = (wk: WorkoutKey): WorkoutKey => {
    switch (wk) {
      case 'A': return 'B'
      case 'B': return 'C'
      case 'C': return 'D'
      case 'D': return 'E'
      default: return 'A'
    }
  }

  // Percentual de conclusão do treino atual
  const getProgress = (workoutId: WorkoutKey) => {
    const exercises = workouts[workoutId].exercises
    const completed = exercises.filter(ex => completedExercises[`${workoutId}-${ex.id}`]).length
    return Math.round((completed / exercises.length) * 100)
  }

  const currentProgress = getProgress(currentWorkout)

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-blue-600" size={28} />
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-800">Workout Tracker</h1>
              <p className="text-gray-600 text-sm">Não negocie com a sua mente. Just Do It</p>
            </div>
            <button
              onClick={async () => { await supabase.auth.signOut(); }}
              className="text-xs text-blue-600 hover:text-blue-700"
            >
              Sair
            </button>
          </div>
          
          {/* Seleção de treino */}
          <div className="flex gap-2 mb-4">
            {(Object.keys(workouts) as WorkoutKey[]).map(key => (
              <button
                key={key}
                onClick={() => setCurrentWorkout(key)}
                className={`flex-1 py-2 px-3 rounded font-semibold text-sm ${
                  currentWorkout === key ? `${workouts[key].color} text-white` : 'bg-gray-200 text-gray-700'
                }`}
              >
                {key}
              </button>
            ))}
          </div>

          {/* Barra de progresso */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700">Progresso</span>
              <span className="text-sm font-bold text-gray-900">{currentProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div className={`h-3 rounded-full transition-all duration-300 ${getProgressColor(currentProgress)}`} style={{ width: `${currentProgress}%` }}></div>
            </div>
          </div>
        </div>

        {/* Treino atual */}
        <div className="bg-white rounded-lg shadow-md mb-4">
          <div className={`${workouts[currentWorkout].color} text-white p-4 rounded-t-lg`}>
            <h2 className="font-bold text-lg">{workouts[currentWorkout].name}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Calendar size={16} />
              <span className="text-sm">{workouts[currentWorkout].day}</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              {workouts[currentWorkout].cardio.includes('Bicicleta') ? (
                <Bike size={16} />
              ) : (
                <Clock size={16} />
              )}
              <span className="text-sm">{workouts[currentWorkout].cardio}</span>
              {/* Timer de descanso — tocar no tempo abre a tela cheia */}
              <div className="ml-auto flex items-center gap-2">
                <button onClick={() => setIsTimerOpen(true)} aria-label="Abrir timer em tela cheia" className="text-xs bg-white/20 px-2 py-1 rounded hover:bg-white/30">{formatSeconds(timerSeconds)}</button>
                {!timerActive ? (
                  <button onClick={startTimer} className="text-xs bg-white text-blue-700 font-bold px-2 py-1 rounded hover:bg-blue-50 border border-white/60">Iniciar {formatSeconds(timerDuration)}</button>
                ) : (
                  <button onClick={stopTimer} className="text-xs bg-white text-red-700 font-bold px-2 py-1 rounded hover:bg-red-50 border border-white/60">Parar</button>
                )}
              </div>
            </div>
          </div>

          <div className="p-4">
            {workouts[currentWorkout].exercises.map(exercise => (
              <div key={exercise.id} className="flex items-center gap-3 p-3 border-b border-gray-100 last:border-b-0">
                <button onClick={() => toggleExercise(currentWorkout, exercise.id)} className="flex-shrink-0">
                  {completedExercises[`${currentWorkout}-${exercise.id}`] ? (
                    <CheckSquare className="text-green-600" size={24} />
                  ) : (
                    <Square className="text-gray-400" size={24} />
                  )}
                </button>

                <div className="flex-1 min-w-0 cursor-pointer" onClick={() => openExerciseModal(currentWorkout, exercise)}>
                  <h3
                    className={`font-medium text-sm ${
                      completedExercises[`${currentWorkout}-${exercise.id}`]
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {exercise.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-gray-600">{exercise.sets} × {exercise.reps}</span>
                    {exercise.rir && (
                      <span className="text-xs text-gray-600">• RIR {exercise.rir}</span>
                    )}
                    {exerciseNotes[`${currentWorkout}-${exercise.id}`]?.load && (
                      <span className="text-xs text-gray-600">• carga: {exerciseNotes[`${currentWorkout}-${exercise.id}`]?.load}</span>
                    )}
                    {exerciseNotes[`${currentWorkout}-${exercise.id}`]?.note && (
                      <span className="text-xs text-gray-500 truncate max-w-[160px]">• {exerciseNotes[`${currentWorkout}-${exercise.id}`]?.note}</span>
                    )}
                  </div>
                </div>

                <span className={`px-2 py-1 rounded text-xs font-bold ${getTypeColor(exercise.type)}`}>{getTypeLabel(exercise.type)}</span>
              </div>
            ))}

            <button
              onClick={completeWorkout}
              disabled={currentProgress !== 100}
              className={`w-full mt-4 py-3 px-4 rounded-lg font-bold text-white transition-all ${
                currentProgress === 100 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              {currentProgress === 100
                ? '🔥 FINALIZAR TREINO 🔥'
                : `Faltam ${
                    workouts[currentWorkout].exercises.filter(ex => !completedExercises[`${currentWorkout}-${ex.id}`]).length
                  } exercícios`}
            </button>
          </div>
        </div>

        {/* Histórico */}
        {workoutHistory.length > 0 && (
          <div className="bg-white rounded-lg shadow-md mb-4">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <Flame className="text-orange-600" size={20} />
                Histórico de Treinos
              </h3>
            </div>
            <div className="p-4">
              {workoutHistory.map((entry, index) => {
                // Sessões da rotina antiga não recebem o nome dos novos treinos
                const isLegacy = parsePtBrToISO(entry.date) < ROUTINE_START
                return (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full ${isLegacy ? 'bg-gray-400' : workouts[entry.workout].color} flex items-center justify-center text-white font-bold text-sm`}>
                        {entry.workout}
                      </div>
                      <span className={`font-medium text-sm ${isLegacy ? 'text-gray-500' : 'text-gray-800'}`}>
                        {isLegacy ? 'Treino anterior' : workouts[entry.workout].name.split(' - ')[1]}
                      </span>
                    </div>
                    <span className="text-gray-600 text-xs">{entry.date}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Calendário visual */}
        <div className="bg-white rounded-lg shadow-md mb-4">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Calendar className="text-blue-600" size={20} />
              Calendário
            </h3>
            <div className="flex gap-2">
              {(['week','month','year'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setCalendarFilter(f)}
                  className={`px-3 py-1 rounded text-sm font-semibold border ${calendarFilter === f ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-300'}`}
                >
                  {f === 'week' ? 'Semana' : f === 'month' ? 'Mês' : 'Ano'}
                </button>
              ))}
            </div>
          </div>
          <div className="p-4">
            {/* Grid de dias conforme filtro */}
            {(() => {
              const { start, end } = getRangeForFilter(anchorDate, calendarFilter)
              const days = generateDaysForRange(start, end)
              const cellClass = (iso: string) => {
                if (calendarCompletions.has(iso)) return 'bg-green-100 text-green-700 border-green-300'
                if (calendarMisses.has(iso)) return 'bg-red-100 text-red-700 border-red-300'
                return 'bg-gray-100 text-gray-700 border-gray-300'
              }

              if (calendarFilter === 'year') {
                // Ano: grade compacta (12 linhas, cada uma com os dias dos meses)
                const months = Array.from({ length: 12 }, (_, i) => new Date(anchorDate.getFullYear(), i, 1))
                return (
                  <div className="space-y-3">
                    {months.map((m, idx) => {
                      const { start: ms, end: me } = getMonthRange(m)
                      const mdays = generateDaysForRange(ms, me)
                      return (
                        <div key={idx}>
                          <div className="text-xs font-bold text-gray-700 mb-1">{m.toLocaleDateString('pt-BR', { month: 'long' }).toUpperCase()}</div>
                          <div className="grid grid-cols-7 gap-1">
                            {['S','T','Q','Q','S','S','D'].map((d, i) => (
                              <div key={i} className="text-[10px] text-gray-500 text-center">{d}</div>
                            ))}
                            {/* offset inicial */}
                            {Array.from({ length: startOfDay(ms).getDay() === 0 ? 0 : startOfDay(ms).getDay() - 1 }).map((_, i) => (
                              <div key={`off-${i}`}></div>
                            ))}
                            {mdays.map((d, i) => {
                              const iso = toISODate(d)
                              return (
                                <div key={i} className={`border rounded p-1 text-center text-xs cursor-pointer hover:opacity-80 ${cellClass(iso)}`} onClick={() => toggleCalendarDay(iso)}>{d.getDate()}</div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )
              }

              // Semana/Mês
              const showWeekHeaders = true
              return (
                <div>
                  {showWeekHeaders && (
                    <div className="grid grid-cols-7 gap-1 mb-2">
                      {['S','T','Q','Q','S','S','D'].map((d, i) => (
                        <div key={i} className="text-[10px] text-gray-500 text-center">{d}</div>
                      ))}
                    </div>
                  )}
                  <div className="grid grid-cols-7 gap-1">
                    {/* offset inicial para mês */}
                    {calendarFilter === 'month' && Array.from({ length: startOfDay(start).getDay() === 0 ? 0 : startOfDay(start).getDay() - 1 }).map((_, i) => (
                      <div key={`off-${i}`}></div>
                    ))}
                    {days.map((d, i) => {
                      const iso = toISODate(d)
                      return (
                        <div key={i} className={`border rounded p-2 text-center text-xs cursor-pointer hover:opacity-80 ${cellClass(iso)}`} onClick={() => toggleCalendarDay(iso)}>{d.getDate()}</div>
                      )
                    })}
                  </div>
                </div>
              )
            })()}

            {/* Legenda */}
            <div className="flex items-center gap-4 mt-4">
              <div className="flex items-center gap-2 text-xs text-gray-700"><span className="w-3 h-3 rounded bg-green-200 border border-green-400"></span> Concluído</div>
              <div className="flex items-center gap-2 text-xs text-gray-700"><span className="w-3 h-3 rounded bg-red-200 border border-red-400"></span> Passado sem conclusão</div>
              <div className="flex items-center gap-2 text-xs text-gray-700"><span className="w-3 h-3 rounded bg-gray-200 border border-gray-400"></span> Hoje/Futuro</div>
            </div>
          </div>
        </div>

        {/* Cronograma semanal */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4">
          <h3 className="font-bold text-gray-800 mb-3">📅 Cronograma Semanal</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-600"></div>
              <span className="text-sm text-gray-700">Segunda - A: Upper A</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-sm text-gray-700">Terça - B: Lower A</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-700">Quarta - Descanso/Cardio (30–45 min leve)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-sm text-gray-700">Quinta - C: Upper B</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span className="text-sm text-gray-700">Sexta - D: Lower B</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <span className="text-sm text-gray-700">Sábado - E: Cardio/Mobilidade (opcional)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-700">Domingo - Descanso (Meal Prep)</span>
            </div>
          </div>
        </div>

        {/* Timer em tela cheia */}
        {isTimerOpen && (() => {
          const isIdle = !timerActive && timerSeconds === 0
          const shown = isIdle ? timerDuration : timerSeconds
          const pct = isIdle ? 100 : Math.round((timerSeconds / Math.max(timerDuration, timerSeconds, 1)) * 100)
          return (
            <div className={`fixed inset-0 z-50 ${workouts[currentWorkout].color} text-white flex flex-col`}>
              <div className="flex items-center justify-between p-4">
                <span className="font-bold text-sm">Timer de descanso</span>
                <button onClick={() => setIsTimerOpen(false)} className="text-sm font-semibold bg-white/20 px-3 py-1 rounded hover:bg-white/30">Fechar</button>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center px-4">
                <span className="font-bold tabular-nums leading-none text-[26vw] sm:text-[160px]">{formatSeconds(shown)}</span>
                <div className="w-full max-w-md bg-white/20 rounded-full h-3 mt-6">
                  <div className="h-3 rounded-full bg-white transition-all duration-300" style={{ width: `${pct}%` }}></div>
                </div>
              </div>

              <div className="p-4 max-w-md w-full mx-auto space-y-3">
                {/* Escolha do tempo */}
                <div className="grid grid-cols-5 gap-2">
                  {[30, 60, 90, 120, 180].map(sec => (
                    <button
                      key={sec}
                      onClick={() => changeTimerDuration(sec)}
                      disabled={!isIdle}
                      className={`py-2 rounded text-sm font-semibold disabled:opacity-40 ${timerDuration === sec ? 'bg-white text-gray-900' : 'bg-white/20 hover:bg-white/30'}`}
                    >
                      {formatSeconds(sec).replace(/^0/, '')}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => changeTimerDuration(timerDuration - 15)} disabled={!isIdle} className="flex-1 py-2 rounded bg-white/20 hover:bg-white/30 font-semibold text-sm disabled:opacity-40">−15s</button>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={60}
                    aria-label="Minutos"
                    value={Math.floor(timerDuration / 60)}
                    disabled={!isIdle}
                    onChange={e => changeTimerDuration((Number(e.target.value) || 0) * 60 + (timerDuration % 60))}
                    className="w-14 py-2 rounded bg-white/90 text-gray-900 text-center text-sm font-bold disabled:opacity-40"
                  />
                  <span className="font-bold">:</span>
                  <input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={59}
                    aria-label="Segundos"
                    value={timerDuration % 60}
                    disabled={!isIdle}
                    onChange={e => changeTimerDuration(Math.floor(timerDuration / 60) * 60 + Math.min(Number(e.target.value) || 0, 59))}
                    className="w-14 py-2 rounded bg-white/90 text-gray-900 text-center text-sm font-bold disabled:opacity-40"
                  />
                  <button onClick={() => changeTimerDuration(timerDuration + 15)} disabled={!isIdle} className="flex-1 py-2 rounded bg-white/20 hover:bg-white/30 font-semibold text-sm disabled:opacity-40">+15s</button>
                </div>

                {/* Controles */}
                <div className="flex gap-2 pt-2">
                  {isIdle ? (
                    <button onClick={startTimer} className="flex-1 py-4 rounded-lg bg-white text-gray-900 font-bold text-lg">Iniciar</button>
                  ) : (
                    <>
                      <button onClick={stopTimer} className="flex-1 py-4 rounded-lg bg-white/20 hover:bg-white/30 font-bold text-lg">Zerar</button>
                      {timerActive ? (
                        <button onClick={pauseTimer} className="flex-1 py-4 rounded-lg bg-white text-gray-900 font-bold text-lg">Pausar</button>
                      ) : (
                        <button onClick={resumeTimer} className="flex-1 py-4 rounded-lg bg-white text-gray-900 font-bold text-lg">Continuar</button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          )
        })()}

        {isModalOpen && selected && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => { setIsModalOpen(false); setSelected(null); }}>
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-sm" onClick={e => e.stopPropagation()}>
              <div className={`${workouts[selected.workoutId].color} text-white p-4 rounded-t-lg`}>
                <h4 className="font-bold text-sm">{selected.exercise.name}</h4>
                <p className="text-xs opacity-90">{selected.exercise.sets} × {selected.exercise.reps}{selected.exercise.rir ? ` · RIR ${selected.exercise.rir}` : ''}</p>
              </div>
              <div className="p-4 space-y-3">
                <div>
                  <label className="text-xs font-medium text-gray-700">Carga</label>
                  <input
                    type="text"
                    inputMode="decimal"
                    placeholder="ex: 20 kg"
                    value={tempLoad}
                    onChange={e => setTempLoad(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700">Anotação</label>
                  <textarea
                    rows={3}
                    placeholder="Notas rápidas..."
                    value={tempNote}
                    onChange={e => setTempNote(e.target.value)}
                    className="mt-1 w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={() => { setIsModalOpen(false); setSelected(null); }} className="flex-1 py-2 rounded bg-gray-200 text-gray-800 font-semibold">Cancelar</button>
                  <button onClick={saveExerciseModal} className="flex-1 py-2 rounded bg-blue-600 text-white font-bold">Salvar</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Dicas */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <h4 className="font-bold text-blue-800 mb-2">💡 Dicas Importantes:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Foque na técnica perfeita</li>
            <li>• RIR = repetições que ainda sobrariam antes da falha</li>
            <li>• Compostos RIR 2, isoladores RIR 1-2 — sem falha em tudo</li>
            <li>• Progressão dupla: bateu o topo da faixa em todas as séries? Suba a carga e volte ao início da faixa</li>
            <li>• Carga inicial nova: escolha pelo RIR alvo, não pela carga antiga</li>
            <li>• Sessões de 60-75 min: não adicione exercícios</li>
            <li>• Descanso: 2-3 min nos compostos, 1-1:30 nos isoladores (toque no timer para ajustar)</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WorkoutTracker
