import { collection, setDoc, doc, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebase';

export const firestoreSync = {
  // Sync generated timetable to Firestore collection 'timetables'
  syncTimetableToFirestore: async (timetableData) => {
    try {
      const timetableRef = doc(db, 'timetables', timetableData._id || 'active_timetable');
      await setDoc(timetableRef, {
        title: timetableData.title || 'CSE Semester 5 Timetable',
        status: timetableData.status || 'published',
        optimizationScore: timetableData.optimizationScore || 94,
        academicYear: timetableData.academicYear || '2025-2026',
        updatedAt: new Date().toISOString(),
        slots: timetableData.activeVersionId?.slots || timetableData.slots || [],
      }, { merge: true });
      console.log('[Firestore] Timetable synced successfully to timetable-analyzer project!');
      return true;
    } catch (err) {
      console.warn('[Firestore Warning] Sync to Firestore:', err.message);
      return false;
    }
  },

  // Subscribe to real-time timetable updates from Firestore
  subscribeToTimetable: (onUpdate) => {
    try {
      const timetablesCol = collection(db, 'timetables');
      return onSnapshot(timetablesCol, (snapshot) => {
        const items = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        onUpdate(items);
      });
    } catch (err) {
      console.warn('[Firestore Warning] Subscription:', err.message);
      return () => {};
    }
  },
};

export default firestoreSync;
