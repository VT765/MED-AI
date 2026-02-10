import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH
  ? path.resolve(__dirname, "..", process.env.FIREBASE_SERVICE_ACCOUNT_PATH)
  : path.resolve(__dirname, "..", "firebase-service-account.json");

let serviceAccount;
try {
  serviceAccount = JSON.parse(readFileSync(serviceAccountPath, "utf-8"));
} catch (err) {
  console.error(
    `Firebase service account file not found at: ${serviceAccountPath}\n` +
    "Please download it from Firebase Console → Project Settings → Service Accounts → Generate New Private Key.\n" +
    "Place it at backend/firebase-service-account.json or set FIREBASE_SERVICE_ACCOUNT_PATH in .env."
  );
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

export default admin;
