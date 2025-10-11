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
}

interface Workout {
  name: string
  day: string
  color: string // classe Tailwind para cor de destaque
  cardio: string
  exercises: Exercise[]
}

type WorkoutKey = 'A' | 'B' | 'C' | 'D' | 'E'

const workouts: Record<WorkoutKey, Workout> = {
  A: {
    name: 'TREINO A - COSTAS E BÍCEPS',
    day: 'Segunda-feira',
    color: 'bg-blue-600',
    cardio: 'Esteira 10 min',
    exercises: [
      { id: 'a1', name: 'Puxada Anterior Aberta', reps: '8 + 8', sets: '4x', type: 'DS' },
      { id: 'a2', name: 'Remada Cavalinho', reps: '12', sets: '3x', type: 'N' },
      { id: 'a3', name: 'Remada na Polia Baixa com Barra Reta', reps: '8 + 8', sets: '3x', type: 'DS' },
      { id: 'a4', name: 'Puxada no Triângulo', reps: '8 + 8', sets: '3x', type: 'DS' },
      { id: 'a5', name: 'Banco Scott com Halter', reps: '8 + 8', sets: '4x', type: 'DS' },
      { id: 'a6', name: 'Rosca Martelo', reps: '10', sets: '3x', type: 'N' },
      { id: 'a7', name: 'Abdominal Supra Declinado com Carga', reps: '15', sets: '4x', type: 'N' },
      { id: 'a8', name: 'Esteira', reps: '10 min', sets: '1x', type: 'CARDIO' },
    ],
  },
  B: {
    name: 'TREINO B - PERNAS "LEG SWEEP"',
    day: 'Terça-feira',
    color: 'bg-red-600',
    cardio: 'Bicicleta 10 min',
    exercises: [
      { id: 'b1', name: 'Agachamento Sumo', reps: '10', sets: '4x', type: 'N' },
      { id: 'b2', name: 'Leg Press (Pés Altos/Afastados)', reps: '12', sets: '4x', type: 'N' },
      { id: 'b3', name: 'Agachamento Búlgaro', reps: '10-12', sets: '3x', type: 'N' },
      { id: 'b4', name: 'Mesa Flexora', reps: '8 + 8', sets: '3x', type: 'DS' },
      { id: 'b5', name: 'Cadeira Extensora (Rotação Externa)', reps: '8 + 8', sets: '3x', type: 'DS' },
      { id: 'b6', name: 'Elevação Pélvica', reps: '15', sets: '4x', type: 'N' },
      { id: 'b7', name: 'Panturrilha em Pé (Rotação Interna)', reps: '15', sets: '4x', type: 'N' },
      { id: 'b8', name: 'Abdução na Máquina', reps: '15', sets: '3x', type: 'N' },
      { id: 'b9', name: 'Adução na Máquina', reps: '15', sets: '3x', type: 'N' },
      { id: 'b10', name: 'Abdominal Infra Banco Declinado', reps: '15', sets: '3x', type: 'N' },
      { id: 'b11', name: 'Bicicleta', reps: '10 min', sets: '1x', type: 'CARDIO' },
    ],
  },
  C: {
    name: 'TREINO C - PEITO, OMBROS E TRÍCEPS',
    day: 'Quarta-feira',
    color: 'bg-green-600',
    cardio: 'Esteira 10 min',
    exercises: [
      { id: 'c1', name: 'Supino Inclinado com Halter', reps: '10', sets: '4x', type: 'N' },
      { id: 'c3', name: 'Supino Reto com Barra', reps: '6-8', sets: '4x', type: 'N' },
      { id: 'c12', name: 'Paralelas (Dip) para Peito', reps: '8-12', sets: '3x', type: 'N' },
      { id: 'c2', name: 'Crucifixo na Máquina', reps: '8 + 8', sets: '3x', type: 'DS' },
      { id: 'c4', name: 'Desenvolvimento Arnold', reps: '8-10', sets: '4x', type: 'N' },
      { id: 'c5', name: 'Elevação Lateral 21s', reps: '7+7+7', sets: '3x', type: 'SP' },
      { id: 'c6', name: 'Crucifixo Inverso na Máquina', reps: '12-15', sets: '4x', type: 'N' },
      { id: 'c7', name: 'Elevação Frontal na Polia', reps: '10', sets: '3x', type: 'N' },
      { id: 'c8', name: 'Tríceps Francês Unilateral', reps: '12', sets: '3x', type: 'N' },
      { id: 'c9', name: 'Tríceps Corda na Polia', reps: '10 + 10', sets: '3x', type: 'DS' },
      { id: 'c10', name: 'Abdominal Supra Declinado com Carga', reps: '12', sets: '4x', type: 'N' },
      { id: 'c11', name: 'Esteira', reps: '10 min', sets: '1x', type: 'CARDIO' },
    ],
  },
  D: {
    name: 'TREINO D - PERNAS VOLUME/BOMBA',
    day: 'Sexta-feira',
    color: 'bg-purple-600',
    cardio: 'Bicicleta 10 min',
    exercises: [
      { id: 'd1', name: 'Agachamento no Smith', reps: '15', sets: '4x', type: 'N' },
      { id: 'd2', name: 'Cadeira Extensora', reps: '15-20', sets: '4x', type: 'N' },
      { id: 'd3', name: 'Leg Press (Pés Juntos)', reps: '20', sets: '3x', type: 'N' },
      { id: 'd4', name: 'Stiff com Halteres', reps: '12', sets: '4x', type: 'N' },
      { id: 'd5', name: 'Mesa Flexora', reps: '15', sets: '3x', type: 'N' },
      { id: 'd6', name: 'Afundo Búlgaro', reps: '12', sets: '3x', type: 'N' },
      { id: 'd7', name: 'Panturrilha Sentado', reps: '20', sets: '4x', type: 'N' },
      { id: 'd8', name: 'Abdução na Máquina', reps: '15', sets: '3x', type: 'N' },
      { id: 'd9', name: 'Adução na Máquina', reps: '15', sets: '3x', type: 'N' },
      { id: 'd10', name: 'Abdominal Oblíquo (Bicicleta)', reps: '15 cada lado', sets: '3x', type: 'N' },
      { id: 'd11', name: 'Bicicleta', reps: '10 min', sets: '1x', type: 'CARDIO' },
    ],
  },
  E: {
    name: 'TREINO E - OMBROS ESPECIALIZADOS',
    day: 'Sábado',
    color: 'bg-orange-600',
    cardio: 'Esteira 10 min',
    exercises: [
      { id: 'e1', name: 'Desenvolvimento com Barra pela Frente', reps: '8-10', sets: '4x', type: 'N' },
      { id: 'e2', name: 'Elevação Lateral com Cabo', reps: '12', sets: '4x', type: 'N' },
      { id: 'e3', name: 'Remada Alta', reps: '10', sets: '3x', type: 'N' },
      { id: 'e4', name: 'Elevação Lateral Inclinada', reps: '12', sets: '3x', type: 'N' },
      { id: 'e5', name: 'Elevação Posterior com Halteres', reps: '12', sets: '3x', type: 'N' },
      { id: 'e6', name: 'Elevação Posterior no Cabo', reps: '12', sets: '3x', type: 'N' },
      { id: 'e7', name: 'Abdominal Infra Banco Declinado', reps: '15', sets: '3x', type: 'N' },
      { id: 'e8', name: 'Esteira', reps: '10 min', sets: '1x', type: 'CARDIO' },
    ],
  },
}

const WorkoutTracker: React.FC = () => {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutKey>('A')
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({})
  const [workoutHistory, setWorkoutHistory] = useState<Array<{ workout: WorkoutKey; date: string; completed: boolean }>>([])

  // Filtro e dados do calendário visual
  const [calendarFilter, setCalendarFilter] = useState<'week' | 'month' | 'year'>('month')
  const [anchorDate] = useState<Date>(new Date())
  const [calendarCompletions, setCalendarCompletions] = useState<Set<string>>(new Set())
  const [calendarMisses, setCalendarMisses] = useState<Set<string>>(new Set())

  // Timer 1 min (sem som, com vibração)
  const [timerSeconds, setTimerSeconds] = useState<number>(0)
  const [timerActive, setTimerActive] = useState<boolean>(false)

  const formatSeconds = (s: number) => {
    const mm = Math.floor(s / 60)
    const ss = s % 60
    return `${String(mm).padStart(2, '0')}:${String(ss).padStart(2, '0')}`
  }

  const startOneMinuteTimer = () => {
    setTimerSeconds(60)
    setTimerActive(true)
  }
  const stopTimer = () => {
    setTimerActive(false)
    setTimerSeconds(0)
  }

  useEffect(() => {
    if (!timerActive) return
    const id = setInterval(() => {
      setTimerSeconds(prev => {
        if (prev <= 1) {
          clearInterval(id)
          setTimerActive(false)
          // Vibração ao finalizar (sem som)
          try {
            if ('vibrate' in navigator) {
              navigator.vibrate([200, 100, 200])
            }
          } catch (_) {}
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [timerActive])

  // Estado para carga e anotação por exercício
  const [exerciseNotes, setExerciseNotes] = useState<Record<string, { load: string; note: string }>>({})
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

        // localStorage hydration
        const savedCompleted = localStorage.getItem('completedExercises')
        if (savedCompleted) setCompletedExercises(JSON.parse(savedCompleted))
        const savedHistory = localStorage.getItem('workoutHistory')
        if (savedHistory) setWorkoutHistory(JSON.parse(savedHistory))
        const savedWorkout = localStorage.getItem('currentWorkout') as WorkoutKey | null
        if (savedWorkout) setCurrentWorkout(savedWorkout)
        const savedNotes = localStorage.getItem('exerciseNotes')
        if (savedNotes) setExerciseNotes(JSON.parse(savedNotes))

        // server hydration (últimas cargas/anotações + histórico)
        if (userId) {
          const { data: latest, error: latestErr } = await supabase
            .from('exercise_entries_latest')
            .select('workout_id, exercise_id, load, note')
            .eq('user_id', userId)
          if (!latestErr && latest) {
            const notesMap: Record<string, { load: string; note: string }> = {}
            latest.forEach((row: any) => {
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
            setWorkoutHistory(
              comp.map((h: any) => ({ workout: h.workout_id as WorkoutKey, date: new Date(h.date).toLocaleDateString('pt-BR'), completed: true }))
            )
          }
        }
      } catch (_) {}
    }
    hydrate()
    try {
      const savedComp = localStorage.getItem('calendarCompletions')
      const savedMiss = localStorage.getItem('calendarMisses')
      if (savedComp) setCalendarCompletions(new Set(JSON.parse(savedComp)))
      if (savedMiss) setCalendarMisses(new Set(JSON.parse(savedMiss)))
    } catch (_) {}
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
        const payload: any = { date: iso, status, user_id: userId }
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
            wc.forEach((row: any) => {
              const iso = String(row.date)
              compSet.add(iso)
            })
          }
        } catch (_) {
          // fallback local
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
          cm.forEach((row: any) => {
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
        } catch (_) {}
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
    } catch (e) {
      // Mantém valores locais em caso de erro de rede/servidor
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
        const payload: any = { workout_id: currentWorkout, date: today }
        if (userId) payload.user_id = userId
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
              {/* Timer 1 min */}
              <div className="ml-auto flex items-center gap-2">
                <span className="text-xs bg-white/20 px-2 py-1 rounded">{formatSeconds(timerSeconds)}</span>
                {!timerActive ? (
                  <button onClick={startOneMinuteTimer} className="text-xs bg-white text-blue-700 font-bold px-2 py-1 rounded hover:bg-blue-50 border border-white/60">Iniciar 1:00</button>
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
              {workoutHistory.map((entry, index) => (
                <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full ${workouts[entry.workout].color} flex items-center justify-center text-white font-bold text-sm`}>
                      {entry.workout}
                    </div>
                    <span className="text-gray-800 font-medium text-sm">
                      {workouts[entry.workout].name.split(' - ')[1]}
                    </span>
                  </div>
                  <span className="text-gray-600 text-xs">{entry.date}</span>
                </div>
              ))}
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
              <span className="text-sm text-gray-700">Segunda - Costas/Bíceps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-600"></div>
              <span className="text-sm text-gray-700">Terça - Pernas (Leg Sweep)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-600"></div>
              <span className="text-sm text-gray-700">Quarta - Peito/Ombros/Tríceps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-700">Quinta - Descanso/Cardio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-purple-600"></div>
              <span className="text-sm text-gray-700">Sexta - Pernas (Volume/Bomba)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-orange-600"></div>
              <span className="text-sm text-gray-700">Sábado - Ombros Especializados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-gray-400"></div>
              <span className="text-sm text-gray-700">Domingo - Descanso Total</span>
            </div>
          </div>
        </div>

        {isModalOpen && selected && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => { setIsModalOpen(false); setSelected(null); }}>
            <div className="bg-white rounded-lg shadow-lg w-11/12 max-w-sm" onClick={e => e.stopPropagation()}>
              <div className={`${workouts[selected.workoutId].color} text-white p-4 rounded-t-lg`}>
                <h4 className="font-bold text-sm">{selected.exercise.name}</h4>
                <p className="text-xs opacity-90">{selected.exercise.sets} × {selected.exercise.reps}</p>
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
            <li>• DS = Drop Set (reduza 30-40% do peso)</li>
            <li>• Elevação Lateral 21s = técnica especial</li>
            <li>• Agachamento Búlgaro = pé traseiro no banco</li>
            <li>• Abdução: glúteo médio (formato redondo)</li>
            <li>• Adução: adutores (fechamento das pernas)</li>
            <li>• Pernas 2x/semana = máxima hipertrofia</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WorkoutTracker