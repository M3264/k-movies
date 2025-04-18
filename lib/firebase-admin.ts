// This file should only be imported in server components or API routes
import admin from "firebase-admin"
import { getDatabase } from "firebase-admin/database"
import crypto from "crypto"

// Service account details
const serviceAccount = {
  type: "service_account",
  project_id: "kord-db",
  private_key_id: "19e51be302980cb92fed2946478e0d9b55e26ea1",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCzRZ0ixlw1GS6b\nOG4ll2vuZuB4ly/KjdmyN6hcDw4IZf70eh3svsR+/miJiI/AfoXYW5D19NjL5SVg\nEVidar/BJ2DIjFRdFNvqzV/kOU4eA1Q1atrLXYaAFHBUXbVbruXYrbolXvsaBr6M\nQgu81WWEPOSu4K7Agwcx4wvb40qCm/hRoFt/9Jh6zeOw2QXhRp2pBu9B72s0hziM\nha0/UYhhIHJVqju5Tr8dwD3eduPkURXCqSv0jDXeVq/yM4+3p/D3VAxOIgiT7hWM\n9XeyDJVSEralfMC0VcYV0smmzo6tR3dXVYCMWA8jSymfFXMvh1xJeC8MEiWzWHpB\nOwwu6vqLAgMBAAECggEAQtSnTTD0a+kM2lmxmjr2RgQ9F0eJTfIOn2UnUtZb7V6U\nqrAhmsHNP+h4sRjjOigQnoUYJ9DUx0IP6l3dEqYagRe8eVbzFlYx27kfT9XbHM4x\n5M4GbbzaaMH11EWw19J+JgYxuD/NzTiJbYErngRRmXgX6mehTewq0Pqqz5jOjJyW\nkpW9ohtlfX7cddvTMU8VrAsMXIVmnoioRJPypRv8qTQpbVd8LspMuLpdC4B/58Pd\nVlo9BwHSViAUB3pXTeSEUtCFrqVe7Q9cpzFQ2E0uNFXrQHUUhAEtUXFJDkSrgG/j\niagwILXSqKjvR0JmF6CeoQQ26JKA5UZcKNyY09HcVQKBgQDxylB5QWoOFtbMP5rQ\n18g8OkbJGaGAPD7f6+ZwYdBFyadD/F7hm/eDPUTzoQk8Scmt/lMs4r2r8kDlCdL0\n/GYyH2SSpSY6yJiBGziBB6kSOdzAlFTEc6UEWAl+N/j6O5eF5GAuh4P5RYfWzw0o\nVx/A/Odx3PBdEw3Fib6LJF8RFQKBgQC9zrk0MPYFPoHFotrJ6+fFc6A7tI2n3h7l\nbpoJxx83oSGGDqM2TAbi59IcMdANSuLOZ5TYqKtatoAHvR/YgPJ0QBtaYXP+g4S2\n0qxJdrRQtFHxSPRsC2ayvY4A28ZKCr6eRaMq75rwMnEzXYNx8dqufm2LEvDrKNzs\n+5ZTZ2iFHwKBgCTaZluk+co99u1YwHsWeKGdbE6YhoIqLJcquIvmjL0mWEVHgRq4\nEAjD3O+ZWvQCdyf6/Kh5wtkjanq+fZXzpov7NvQXEfWhv4TmJj2cckuh4CDGOwla\nawt3c7L2Sw+w545z2akd5KKo02SNWH8OkHt00L4NI+G71ryGGzHQEGFlAoGAaIys\n4T2y1hKnIrjgsOabhNx6v0hl2rhz5ka03HvtCxRbRd9cMXVROb0ds+AQTLIaGj1d\n9LV7pXzvKtQW7YehhT0mk/MoFGJXQOjsc47KJcYdeL2JvNXO3Neil4B3SaN/eei7\nxtOyUWpHhlaVJ7djkEgdiMSHJdEdWAAAvrIwFVsCgYEAg9Iql2A2oqurypCBElfB\nwab8xDe9Bx3ZaQbiycaH+UTZP0clu7k6X3Eu2FpxaLUm69HE0ZR1TFaupXmE+eMN\nF1t3BNMDL/Hg9TO7P76hfilMZC+tHj9jn1tB4O55DFlh+vVWx1+N8pDr/1re8K6H\nWNK1O2YoeYrV8r5I/q/kQtM=\n-----END PRIVATE KEY-----\n",
  client_email: "firebase-adminsdk-fbsvc@kord-db.iam.gserviceaccount.com",
  client_id: "116836178943830223773",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40kord-db.iam.gserviceaccount.com",
  universe_domain: "googleapis.com",
}

// Initialize Firebase Admin
let db

// Only initialize Firebase if it hasn't been initialized already
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount as any),
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
