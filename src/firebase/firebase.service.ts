import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';

@Injectable()
export class FirebaseService {
  private firestore: admin.firestore.Firestore;
  private auth: admin.auth.Auth;

  constructor() {
    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert(
          process.env.FIREBASE_ADMIN_SDK as admin.ServiceAccount,
        ),
      });
    }

    this.firestore = admin.firestore();
    this.auth = admin.auth();
  }

  getFirestore(): admin.firestore.Firestore {
    return this.firestore;
  }

  getAuth(): admin.auth.Auth {
    return this.auth;
  }
}
