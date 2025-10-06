import React, { useState } from 'react'
import { CheckSquare, Square, Calendar, Target, Flame, Clock, Bike } from 'lucide-react'

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
      { id: 'a7', name: 'Abdominal Infra Banco Declinado', reps: '15', sets: '4x', type: 'N' },
      { id: 'a8', name: 'Esteira', reps: '10 min', sets: '1x', type: 'CARDIO' },
    ],
  },
  B: {
    name: 'TREINO B - PEITO, OMBROS E TRÍCEPS',
    day: 'Terça-feira',
    color: 'bg-red-600',
    cardio: 'Esteira 10 min',
    exercises: [
      { id: 'b1', name: 'Supino Inclinado com Halter', reps: '10', sets: '4x', type: 'N' },
      { id: 'b2', name: 'Crucifixo na Máquina', reps: '8 + 8', sets: '3x', type: 'DS' },
      { id: 'b3', name: 'Chest Press Hammer', reps: '10', sets: '3x', type: 'N' },
      { id: 'b4', name: 'Desenvolvimento Arnold', reps: '8-10', sets: '4x', type: 'N' },
      { id: 'b5', name: 'Elevação Lateral 21s', reps: '7+7+7', sets: '3x', type: 'SP' },
      { id: 'b6', name: 'Crucifixo Inverso na Máquina', reps: '12-15', sets: '4x', type: 'N' },
      { id: 'b7', name: 'Elevação Frontal na Polia', reps: '10', sets: '3x', type: 'N' },
      { id: 'b8', name: 'Tríceps Francês Unilateral', reps: '12', sets: '3x', type: 'N' },
      { id: 'b9', name: 'Tríceps Corda na Polia', reps: '10 + 10', sets: '3x', type: 'DS' },
      { id: 'b10', name: 'Abdominal Supra Declinado com Carga', reps: '12', sets: '4x', type: 'N' },
      { id: 'b11', name: 'Esteira', reps: '10 min', sets: '1x', type: 'CARDIO' },
    ],
  },
  C: {
    name: 'TREINO C - PERNAS "LEG SWEEP"',
    day: 'Quarta-feira',
    color: 'bg-green-600',
    cardio: 'Bicicleta 10 min',
    exercises: [
      { id: 'c1', name: 'Agachamento Sumo', reps: '10', sets: '4x', type: 'N' },
      { id: 'c2', name: 'Leg Press (Pés Altos/Afastados)', reps: '12', sets: '4x', type: 'N' },
      { id: 'c3', name: 'Agachamento Búlgaro', reps: '10-12', sets: '3x', type: 'N' },
      { id: 'c4', name: 'Mesa Flexora', reps: '8 + 8', sets: '3x', type: 'DS' },
      { id: 'c5', name: 'Cadeira Extensora (Rotação Externa)', reps: '8 + 8', sets: '3x', type: 'DS' },
      { id: 'c6', name: 'Elevação Pélvica', reps: '15', sets: '4x', type: 'N' },
      { id: 'c7', name: 'Panturrilha em Pé (Rotação Interna)', reps: '15', sets: '4x', type: 'N' },
      { id: 'c8', name: 'Abdução na Máquina', reps: '15', sets: '3x', type: 'N' },
      { id: 'c9', name: 'Adução na Máquina', reps: '15', sets: '3x', type: 'N' },
      { id: 'c10', name: 'Abdominal Infra Banco Declinado', reps: '15', sets: '3x', type: 'N' },
      { id: 'c11', name: 'Bicicleta', reps: '10 min', sets: '1x', type: 'CARDIO' },
    ],
  },
  D: {
    name: 'TREINO D - OMBROS ESPECIALIZADOS',
    day: 'Sexta-feira',
    color: 'bg-purple-600',
    cardio: 'Esteira 10 min',
    exercises: [
      { id: 'd1', name: 'Desenvolvimento com Barra pela Frente', reps: '8-10', sets: '4x', type: 'N' },
      { id: 'd2', name: 'Elevação Lateral com Cabo', reps: '12', sets: '4x', type: 'N' },
      { id: 'd3', name: 'Remada Alta', reps: '10', sets: '3x', type: 'N' },
      { id: 'd4', name: 'Elevação Lateral Inclinada', reps: '12', sets: '3x', type: 'N' },
      { id: 'd5', name: 'Elevação Posterior com Halteres', reps: '12', sets: '3x', type: 'N' },
      { id: 'd6', name: 'Elevação Posterior no Cabo', reps: '12', sets: '3x', type: 'N' },
      { id: 'd7', name: 'Abdominal Supra Declinado com Carga', reps: '15', sets: '3x', type: 'N' },
      { id: 'd8', name: 'Esteira', reps: '10 min', sets: '1x', type: 'CARDIO' },
    ],
  },
  E: {
    name: 'TREINO E - PERNAS VOLUME/BOMBA',
    day: 'Sábado',
    color: 'bg-orange-600',
    cardio: 'Bicicleta 10 min',
    exercises: [
      { id: 'e1', name: 'Agachamento no Smith', reps: '15', sets: '4x', type: 'N' },
      { id: 'e2', name: 'Cadeira Extensora', reps: '15-20', sets: '4x', type: 'N' },
      { id: 'e3', name: 'Leg Press (Pés Juntos)', reps: '20', sets: '3x', type: 'N' },
      { id: 'e4', name: 'Stiff com Halteres', reps: '12', sets: '4x', type: 'N' },
      { id: 'e5', name: 'Mesa Flexora', reps: '15', sets: '3x', type: 'N' },
      { id: 'e6', name: 'Afundo Búlgaro', reps: '12', sets: '3x', type: 'N' },
      { id: 'e7', name: 'Panturrilha Sentado', reps: '20', sets: '4x', type: 'N' },
      { id: 'e8', name: 'Abdução na Máquina', reps: '15', sets: '3x', type: 'N' },
      { id: 'e9', name: 'Adução na Máquina', reps: '15', sets: '3x', type: 'N' },
      { id: 'e10', name: 'Abdominal Oblíquo (Bicicleta)', reps: '15 cada lado', sets: '3x', type: 'N' },
      { id: 'e11', name: 'Bicicleta', reps: '10 min', sets: '1x', type: 'CARDIO' },
    ],
  },
}

const WorkoutTracker: React.FC = () => {
  const [currentWorkout, setCurrentWorkout] = useState<WorkoutKey>('A')
  const [completedExercises, setCompletedExercises] = useState<Record<string, boolean>>({})
  const [workoutHistory, setWorkoutHistory] = useState<Array<{ workout: WorkoutKey; date: string; completed: boolean }>>([])

  const toggleExercise = (workoutId: WorkoutKey, exerciseId: string) => {
    const key = `${workoutId}-${exerciseId}`
    setCompletedExercises(prev => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const getProgress = (workoutId: WorkoutKey) => {
    const exercises = workouts[workoutId].exercises
    const completed = exercises.filter(ex => completedExercises[`${workoutId}-${ex.id}`]).length
    return Math.round((completed / exercises.length) * 100)
  }

  const completeWorkout = () => {
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

      alert(`🔥 Treino ${currentWorkout} concluído! Excelente trabalho! 💪`)
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

  const currentProgress = getProgress(currentWorkout)

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-md mx-auto">
        {/* Cabeçalho */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-blue-600" size={28} />
            <div>
              <h1 className="text-xl font-bold text-gray-800">Workout Tracker</h1>
              <p className="text-gray-600 text-sm">Ombro 3D + Perna de Jogador + Glúteos</p>
            </div>
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
              <div className={`h-3 rounded-full transition-all duration-300 ${workouts[currentWorkout].color}`} style={{ width: `${currentProgress}%` }}></div>
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

                <div className="flex-1 min-w-0">
                  <h3
                    className={`font-medium text-sm ${
                      completedExercises[`${currentWorkout}-${exercise.id}`]
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    {exercise.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-600">{exercise.sets} × {exercise.reps}</span>
                    {exercise.type === 'CARDIO' && (
                      <div className="flex items-center gap-1">
                        {exercise.name.includes('Bicicleta') ? (
                          <Bike size={12} className="text-red-600" />
                        ) : (
                          <Clock size={12} className="text-red-600" />
                        )}
                      </div>
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
                    workouts[currentWorkout].exercises.length -
                    Math.round((currentProgress / 100) * workouts[currentWorkout].exercises.length)
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

        {/* Cronograma semanal */}
        <div className="bg-white rounded-lg shadow-md mb-4 p-4">
          <h3 className="font-bold text-gray-800 mb-3">📅 Cronograma Semanal</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">A</div>
              <span className="text-sm text-gray-700">Segunda - Costas/Bíceps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-red-600 flex items-center justify-center text-white text-xs font-bold">B</div>
              <span className="text-sm text-gray-700">Terça - Peito/Ombros/Tríceps</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">C</div>
              <span className="text-sm text-gray-700">Quarta - Pernas (Pesado)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">-</div>
              <span className="text-sm text-gray-700">Quinta - Descanso/Cardio</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-purple-600 flex items-center justify-center text-white text-xs font-bold">D</div>
              <span className="text-sm text-gray-700">Sexta - Ombros Especializados</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-orange-600 flex items-center justify-center text-white text-xs font-bold">E</div>
              <span className="text-sm text-gray-700">Sábado - Pernas (Volume/Bomba)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-bold">-</div>
              <span className="text-sm text-gray-700">Domingo - Descanso Total</span>
            </div>
          </div>
        </div>

        {/* Dicas */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-4 rounded">
          <h4 className="font-bold text-blue-800 mb-2">💡 Dicas Importantes:</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Foque na técnica perfeita</li>
            <li>• DS = Drop Set (reduza 30-40% do peso)</li>
            <li>• Elevação Lateral 21s = técnica especial</li>
            <li>• Agachamento Búlgaro = pé traseiro no banco</li>
            <li>• Cadeira Abdutora = glúteo médio (formato redondo)</li>
            <li>• Pernas 2x/semana = máxima hipertrofia</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default WorkoutTracker