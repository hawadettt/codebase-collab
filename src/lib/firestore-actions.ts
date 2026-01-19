
"use server";

import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function saveCodeToFirestore(code: string): Promise<string> {
  try {
    const docRef = await addDoc(collection(db, "code-documents"), {
      code,
      createdAt: serverTimestamp(),
      version: 1, // Simple versioning, can be expanded
    });
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Could not save to Firestore.");
  }
}
