import { useState, useEffect } from "react";
import { db } from "../firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export function usePlaces() {
  const [places, setPlaces] = useState([]);
  const [filteredPlaces, setFilteredPlaces] = useState([]);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    const snapshot = await getDocs(collection(db, "visitedPlaces"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setPlaces(list);
    setFilteredPlaces(list);
  };

  const addPlace = async (data) => {
    const docRef = await addDoc(collection(db, "visitedPlaces"), data);
    const newPlace = { id: docRef.id, ...data };
    setPlaces((prev) => [...prev, newPlace]);
    setFilteredPlaces((prev) => [...prev, newPlace]);
  };

  const updatePlace = async (id, data) => {
    const docRef = doc(db, "visitedPlaces", id);
    await updateDoc(docRef, data);
    setPlaces((prev) =>
      prev.map((place) => (place.id === id ? { ...place, ...data } : place))
    );
  };

  const deletePlace = async (id) => {
    const docRef = doc(db, "visitedPlaces", id);
    await deleteDoc(docRef);
    setPlaces((prev) => {
      const updated = prev.filter((place) => place.id !== id);
      setFilteredPlaces(updated);
      return updated;
    });
  };

  const searchPlaces = (query) => {
    if (!query) {
      setFilteredPlaces(places);
    } else {
      const filtered = places.filter((place) =>
        place.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPlaces(filtered);
    }
  };

  return {
    places: filteredPlaces,
    addPlace,
    updatePlace,
    deletePlace,
    searchPlaces,
  };
}
