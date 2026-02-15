import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import nodemailer from "nodemailer";

admin.initializeApp();

export const dailyMedicationCheck = onSchedule(
  {
    schedule: "0 21 * * *", // 9 PM daily
    timeZone: "Asia/Kolkata",
  },
  async () => {
    console.log("Running daily medication check...");

    const db = admin.firestore();
    const today = new Date().toISOString().split("T")[0];

    const usersSnapshot = await db.collection("users").get();

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const userId = userDoc.id;

      const medicationsSnapshot = await db
        .collection("medications")
        .where("userId", "==", userId)
        .get();

      let missedMedications: string[] = [];

      for (const medDoc of medicationsSnapshot.docs) {
        const logId = `${medDoc.id}_${today}`;

        const logDoc = await db
          .collection("medicationLogs")
          .doc(logId)
          .get();

        if (!logDoc.exists) {
          missedMedications.push(medDoc.data().name);
        }
      }

      if (missedMedications.length > 0) {
        console.log(
          `User ${userData.name} missed: ${missedMedications.join(", ")}`
        );

        const transporter = nodemailer.createTransport({
          service: "gmail",
          auth: {
            user: process.env.GMAIL_USER,
            pass: process.env.GMAIL_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.GMAIL_USER,
          to: userData.caretakerEmail,
          subject: "Medication Alert 🚨",
          text: `Patient ${userData.name} missed the following medications today:\n\n${missedMedications.join(
            "\n"
          )}`,
        });
      }
    }

    console.log("Daily medication check completed.");
  }
);
