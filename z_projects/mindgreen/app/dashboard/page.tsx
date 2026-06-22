'use client'

import AnimatedForest from '@/components/AnimatedForest'
import TaskCard from '@/components/TaskCard'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { auth as getAuth, db as getDb } from '../providers'

export default function Dashboard() {
  const [points, setPoints] = useState(0)
  const [tasks, setTasks] = useState<any[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const _auth = getAuth()
      const _db = getDb()
      const user = _auth?.currentUser
      if (user && _db) {
        const tasksCol = collection(_db, 'tasks')
        const taskSnapshot = await getDocs(tasksCol)
        setTasks(taskSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })))
        // Fetch points from user doc (mock for now)
        setPoints(50)
      }
    }
    fetchData()
  }, [])

  const completeTask = async (taskId: string) => {
    // Add logic to complete task and earn points
    setPoints(points + 10)
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>Green Points: {points}</p>
      <AnimatedForest points={points} />
      <h2>Tasks</h2>
      {tasks.map((task: any) => (
        <TaskCard key={task.id} task={task} onComplete={completeTask} />
      ))}
    </main>
  )
}
