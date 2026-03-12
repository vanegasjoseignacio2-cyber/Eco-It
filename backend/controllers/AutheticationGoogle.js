import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';

// Exported as a function so it only runs AFTER dotenv.config() has loaded env vars
export function setupGoogleAuth() {
  passport.use(new GoogleStrategy({
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "http://localhost:3000/api/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Buscar si el usuario ya existe
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Crear nuevo usuario con datos de Google
          user = await User.create({
            googleId: profile.id,
            nombre: profile.name.givenName,
            apellido: profile.name.familyName,
            email: profile.emails[0].value,
            // No requiere password para login con Google
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  ));

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err, null);
    }
  });
}

export default passport;
