import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import AddMedicationForm from "../components/AddMedicationForm";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const [medications, setMedications] = useState<any[]>([]);
  const [takenToday, setTakenToday] = useState<Record<string, boolean>>({});

  // Fetch medications
  const fetchMedications = async () => {
    if (!user) return;

    const q = query(
      collection(db, "medications"),
      where("userId", "==", user.uid)
    );

    const snapshot = await getDocs(q);

    const meds = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    setMedications(meds);
  };

  // Mark medication as taken
  const markAsTaken = async (medicationId: string) => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];
    const logId = `${medicationId}_${today}`;

    await setDoc(doc(db, "medicationLogs", logId), {
      medicationId,
      userId: user.uid,
      date: today,
      taken: true,
    });

    setTakenToday((prev) => ({
      ...prev,
      [medicationId]: true,
    }));
  };

  // Check today's logs
  const checkTodayLogs = async () => {
    if (!user) return;

    const today = new Date().toISOString().split("T")[0];

    const q = query(
      collection(db, "medicationLogs"),
      where("userId", "==", user.uid),
      where("date", "==", today)
    );

    const snapshot = await getDocs(q);

    const statusMap: Record<string, boolean> = {};

    snapshot.docs.forEach((doc) => {
      const data = doc.data();
      statusMap[data.medicationId] = true;
    });

    setTakenToday(statusMap);
  };

  useEffect(() => {
    if (user) {
      fetchMedications();
      checkTodayLogs();
    }
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (!user) return <Navigate to="/" />;

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-6 sm:p-8">

          {/* Title */}
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            Medication Dashboard
          </h1>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm text-blue-600">Total Medications</p>
              <p className="text-3xl font-bold text-blue-800">
                {medications.length}
              </p>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm text-green-600">Taken Today</p>
              <p className="text-3xl font-bold text-green-800">
                {Object.keys(takenToday).length}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-sm">
              <p className="text-sm text-red-600">Pending Today</p>
              <p className="text-3xl font-bold text-red-800">
                {medications.length - Object.keys(takenToday).length}
              </p>
            </div>

          </div>

          {/* Add Medication */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-inner mb-10">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Add Medication
            </h2>
            <AddMedicationForm />
          </div>

          {/* Medication List */}
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Your Medications
          </h2>

          {medications.length === 0 ? (
            <div className="text-center text-gray-500 py-10 border rounded-xl bg-gray-50">
              No medications added yet 💊
            </div>
          ) : (
            <ul className="space-y-4">
              {medications.map((med) => (
                <li
                  key={med.id}
                  className="bg-white border border-gray-200 p-5 rounded-xl shadow-sm hover:shadow-lg transition transform hover:-translate-y-1"
                >
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">

                    {/* Left */}
                    <div>
                      <p className="font-semibold text-gray-800 text-lg">
                        {med.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        Dosage: {med.dosage}
                      </p>

                      {takenToday[med.id] ? (
                        <span className="inline-block mt-2 text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
                          ✔ Taken
                        </span>
                      ) : (
                        <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full">
                          ⏳ Pending
                        </span>
                      )}
                    </div>

                    {/* Right */}
                    <button
                      onClick={() => markAsTaken(med.id)}
                      disabled={takenToday[med.id]}
                      className={`w-full sm:w-auto px-4 py-2 rounded-lg text-white transition ${
                        takenToday[med.id]
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      Mark as Taken
                    </button>

                  </div>
                </li>
              ))}
            </ul>
          )}

        </div>
      </div>
    </>
  );
};

export default Dashboard;
