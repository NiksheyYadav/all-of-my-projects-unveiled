import { z } from 'zod'

interface Task {
  id: string
  type: string
  description: string
}

export default function TaskCard({ task, onComplete }: { task: Task, onComplete: (id: string) => void }) {
  const taskSchema = z.object({
    id: z.string(),
    type: z.string(),
    description: z.string(),
  })

  taskSchema.parse(task) // Validate

  return (
    <div className="border p-4 mb-4">
      <h3>{task.type}</h3>
      <p>{task.description}</p>
      <button onClick={() => onComplete(task.id)} className="bg-green-500 text-white p-2">Complete</button>
    </div>
  )
}
