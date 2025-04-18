import { storeInFirebase, fetchFromFirebase } from "./firebase"

// API functions for server components to use Firebase
export async function storeMovieData(movieData) {
  return await storeInFirebase(movieData)
}

export async function getMovieData(fileId) {
  return await fetchFromFirebase(fileId)
}

// Function to store user activity
export async function logUserActivity(userId, activity) {
  const activityData = {
    userId,
    activity,
    timestamp: Date.now(),
  }

  return await storeInFirebase(activityData)
}
