import { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { useAuth } from "../context/AuthContext";

const AddMedicationForm = () => {
  const [name, setName] = useState<string>("");
  const [dosage, setDosage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { user } = useAuth();

  const handleAddMedication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!name.trim() || !dosage.trim()) return;

    try {
      setLoading(true);

      await addDoc(collection(db, "medications"), {
        name,
        dosage,
        userId: user.uid,
        createdAt: serverTimestamp(),
      });

      setName("");
      setDosage("");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

 return (
  <form
    onSubmit={handleAddMedication}
    className="bg-white p-6 rounded-xl shadow-sm border border-gray-200"
  >
    <h2 className="text-lg font-semibold text-gray-700 mb-5">
      Add Medication
    </h2>

    <div className="flex flex-col sm:flex-row gap-4">

      <input
        type="text"
        placeholder="Medication name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        required
      />

      <input
        type="text"
        placeholder="Dosage (e.g., 500mg)"
        value={dosage}
        onChange={(e) => setDosage(e.target.value)}
        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`px-6 py-2 rounded-lg text-white font-medium transition ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {loading ? "Adding..." : "Add"}
      </button>

    </div>
  </form>
);

};

export default AddMedicationForm;
