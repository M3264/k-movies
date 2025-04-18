// This file should only be imported in server components or API routes
import admin from "firebase-admin"
import { getDatabase } from "firebase-admin/database"
import crypto from "crypto"

// Service account details
const serviceAccount = require("./sA.json")
// Initialize Firebase Admin
let db

// Only initialize Firebase if it hasn't been initialized already
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: "https://kord-db-default-rtdb.firebaseio.com",
    })
    db = getDatabase()
  } catch (error) {
    console.error("Firebase initialization error:", error)
  }
}

// Helper function to calculate checksum
const calculateChecksum = (data: string | Buffer) => {
  return crypto.createHash("sha256").update(data).digest("hex")
}

// Helper function to generate alphanumeric ID (12 characters)
const generateFileId = () => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
  let id = ""
  const bytes = crypto.randomBytes(12)
  for (let i = 0; i < 12; i++) {
    id += chars[bytes[i] % chars.length]
  }
  return id
}

// Helper function to store data in Firebase
export async function storeInFirebase(data: any) {
  try {
    const fileId = generateFileId()
    const jsonString = JSON.stringify(data)
    const buffer = Buffer.from(jsonString)

    const fileData = {
      filename: `json_${Date.now()}.json`,
      originalName: "data.json",
      encoding: "utf-8",
      mimetype: "application/json",
      size: buffer.length,
      data: jsonString,
      checksum: calculateChecksum(buffer),
      uploadedBy: "system",
      uploadedAt: admin.database.ServerValue.TIMESTAMP,
    }

    // Store in Firebase
    await db.ref(`files/${fileId}`).set(fileData)
    return fileId
  } catch (error) {
    console.error("Error storing data in Firebase:", error)
    return null
  }
}

// Helper function to fetch from Firebase
export async function fetchFromFirebase(fileId: string) {
  try {
    const snapshot = await db.ref(`files/${fileId}`).once("value")
    const file = snapshot.val()
    if (!file) return null
    return JSON.parse(file.data)
  } catch (error) {
    console.error("Error fetching from Firebase:", error)
    return null
  }
}

// Reviews specific functions
export async function getMovieReviews(movieId: string) {
  try {
    const snapshot = await db.ref("reviews").orderByChild("movieId").equalTo(movieId).once("value")
    const reviews = snapshot.val()

    if (!reviews) return []

    return Object.keys(reviews)
      .map((key) => ({
        id: key,
        ...reviews[key],
      }))
      .sort((a, b) => b.createdAt - a.createdAt)
  } catch (error) {
    console.error("Error getting reviews from Firebase:", error)
    // Log to monitoring service in production
    // Sentry.captureException(error)
    return []
  }
}

export async function addReview(review: any) {
  try {
    const reviewRef = db.ref("reviews").push()
    const reviewWithTimestamp = {
      ...review,
      createdAt: admin.database.ServerValue.TIMESTAMP,
    }

    await reviewRef.set(reviewWithTimestamp)

    // Get the newly created review
    const snapshot = await reviewRef.once("value")
    return {
      id: reviewRef.key,
      ...snapshot.val(),
    }
  } catch (error) {
    console.error("Error adding review to Firebase:", error)
    throw error
  }
}

export default admin
