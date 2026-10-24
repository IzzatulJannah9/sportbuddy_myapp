export interface Workout {
  id: number
  name: string
  sport: string
  duration: number
  calories: number
  date: string
}

const STORAGE_KEY = 'sportbuddy_workouts'

export function getWorkouts(): Workout[] {
  const data = localStorage.getItem(STORAGE_KEY)

  if (!data) {
    return []
  }

  return JSON.parse(data)
}

export function addWorkout(
  name: string,
  sport: string,
  duration: number,
  calories: number,
  date: string
): Workout {

  const workouts = getWorkouts()

  const newWorkout: Workout = {
    id: Date.now(),
    name,
    sport,
    duration,
    calories,
    date
  }

  workouts.unshift(newWorkout)

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(workouts)
  )

  return newWorkout
}

export function updateWorkout(
  id: number,
  name: string,
  sport: string,
  duration: number,
  calories: number,
  date: string
) {

  const workouts = getWorkouts()

  const index = workouts.findIndex(
    workout => workout.id === id
  )

  if (index !== -1) {

    workouts[index] = {
      id,
      name,
      sport,
      duration,
      calories,
      date
    }

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(workouts)
    )
  }
}

export function deleteWorkout(id: number) {

  const workouts = getWorkouts()

  const filtered = workouts.filter(
    workout => workout.id !== id
  )

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(filtered)
  )
}