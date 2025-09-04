import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { FirebaseService } from '../firebase/firebase.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async register(email: string, password: string, username: string) {
    const auth = this.firebaseService.getAuth();
    try {
      const user = await auth.createUser({
        email,
        password,
        displayName: username,
      });
      return {
        uid: user.uid,
        username: user.displayName,
        email: user.email,
        createdAt: user.metadata.creationTime,
      };
    } catch (error) {
      throw new BadRequestException({ message: error.message });
    }
  }

  async login(email: string, password: string) {
    const auth = this.firebaseService.getAuth();

    try {
      const apiKey = process.env.FIREBASE_API_KEY;
      const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;

      const response = await axios.post(url, {
        email,
        password,
        returnSecureToken: true,
      });

      const uid = response.data.localId;

      const userRecord = await auth.getUser(uid);

      return {
        uid: userRecord.uid,
        idToken: response.data.idToken,
        refreshToken: response.data.refreshToken,
        displayName: userRecord.displayName,
      };
    } catch (err) {
      throw new UnauthorizedException('Email ou senha inválidos');
    }
  }
}
