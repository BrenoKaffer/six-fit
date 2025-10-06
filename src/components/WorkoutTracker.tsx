import React, { useMemo, useState } from 'react'
import { CheckSquare, Square, Target } from 'lucide-react'

type Exercise = { id: string; name: string }

const initialExercises: Exercise[] = [
  { id: 'ex1', name: 'Puxada Anterior Aberta' },
  { id: 'ex2', name: 'Remada Baixa' },
  { id: 'ex3', name: 'Rosca Direta' },
]

const WorkoutTracker: React.FC = () => {
  const [done, setDone] = useState<Record<string, boolean>>({})

  const progress = useMemo(() => {
    const completed = Object.values(done).filter(Boolean).length
    return Math.round((completed / initialExercises.length) * 100)
  }, [done])

  const toggle = (id: string) => {
    setDone(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow p-5 mb-4">
          <div className="flex items-center gap-3 mb-3">
            <Target className="text-blue-600" />
            <div>
              <h1 className="text-lg font-bold text-gray-800">Workout Tracker</h1>
              <p className="text-sm text-gray-600">Exemplo mínimo para validação</p>
            </div>
          </div>
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-gray-700 font-medium">Progresso</span>
              <span className="text-sm font-semibold text-gray-900">{progress}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div className="h-2 bg-blue-600 rounded-full transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-gray-800 font-semibold">Exercícios</h2>
          </div>
          <div className="p-2">
            {initialExercises.map(ex => (
              <button
                key={ex.id}
                onClick={() => toggle(ex.id)}
                className="w-full flex items-center gap-3 p-3 border-b last:border-b-0 hover:bg-gray-50"
              >
                {done[ex.id] ? (
                  <CheckSquare className="text-green-600" />
                ) : (
                  <Square className="text-gray-400" />
                )}
                <span className={`text-sm ${done[ex.id] ? 'line-through text-gray-500' : 'text-gray-800'}`}>{ex.name}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default WorkoutTracker