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

  const [newMarker, setNewMarker] = useState(null);
  const [newPlace, setNewPlace] = useState({
    placename: "",
    journeyname: "",
    description: "",
    review: "visited",
  });

  const [editPlace, setEditPlace] = useState(null); // edit state

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
    setFilteredPlaces((prev) =>
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
      const filtered = places.filter(
        (place) =>
          (place.placename || "").toLowerCase().includes(query.toLowerCase()) ||
          (place.name || "").toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPlaces(filtered);
    }
  };

  const handleAddPlace = async (e) => {
    e.preventDefault();
    if (!newMarker) return;

    const data = {
      ...newPlace,
      latitude: newMarker.lat,
      longitude: newMarker.lng,
    };

    await addPlace(data);
    resetNewPlace();
  };

  const resetNewPlace = () => {
    setNewMarker(null);
    setNewPlace({
      placename: "",
      journeyname: "",
      description: "",
      review: "visited",
    });
  };

  // EDIT: Submit handler
  const handleEditSubmit = async (e, popupRefs) => {
    e.preventDefault();
    if (!editPlace?.id) return;

    const { id, journeyname, placename, description, review } = editPlace;
    const docRef = doc(db, "visitedPlaces", id);

    await updateDoc(docRef, { journeyname, placename, description, review });

    setPlaces((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, journeyname, placename, description, review } : p
      )
    );
    setFilteredPlaces((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, journeyname, placename, description, review } : p
      )
    );

    //  CLOSE the popup manually
    const popup = popupRefs?.current?.[id];
    if (popup && popup._source?._map) {
      popup._source._map.closePopup(popup);
    }

    setEditPlace(null);
  };

  const cancelEdit = () => setEditPlace(null); //  cancel edit helper

  return {
    // Places
    places: filteredPlaces,
    addPlace,
    updatePlace,
    deletePlace,
    searchPlaces,

    // New marker form
    newMarker,
    setNewMarker,
    newPlace,
    setNewPlace,
    handleAddPlace,
    resetNewPlace,

    // Edit form
    editPlace,
    setEditPlace,
    handleEditSubmit,
    cancelEdit,
  };
}
