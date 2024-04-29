import { getFirestore } from 'firebase/firestore';
import { app } from '../init';

export const db = getFirestore(app);
