import Constants from 'expo-constants';
import { FirebaseApp, getApps, initializeApp } from 'firebase/app';
import { Database, getDatabase } from 'firebase/database';

type TFirebaseConfig = {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
};

const config = Constants.expoConfig?.extra?.firebase as TFirebaseConfig;

const appInstance: FirebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(config);

export const firebaseApp = appInstance;
export const firebaseDatabase: Database = getDatabase(appInstance);
