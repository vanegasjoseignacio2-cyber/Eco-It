import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/user.js';
import { sendWelcomeEmail } from '../utils/emailService.js';
import AuditLog from '../models/AuditLog.js';
import { createAuditLog } from '../utils/auditLogger.js';

// Exported as a function so it only runs AFTER dotenv.config() has loaded env vars
export function setupGoogleAuth() {
  passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/api/auth/google/callback",
    passReqToCallback: true
  },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // Primero buscar por googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          // Si no existe por googleId, buscar por email
          user = await User.findOne({ email });

          if (user) {
            // Usuario existe con email pero sin googleId → vincular cuenta
            user.googleId = profile.id;
            user.authProvider = 'google';
            await user.save();
          } else {
            // Usuario nuevo → crear
            user = await User.create({
              googleId: profile.id,
              nombre: profile.name.givenName,
              apellido: profile.name.familyName,
              email,
              authProvider: 'google',
              perfilCompleto: false
            });
            // envia el correo de bienvenida al registrar con google
            sendWelcomeEmail(user.email, user.nombre)
            // Audit Log
            await createAuditLog(req.app, {
              type: 'register',
              action: 'Nuevo Usuario (Google)',
              details: `Usuario registrado vía Google: ${user.email}`,
              user: `${user.nombre} ${user.apellido || ''}`.trim() || user.email
            });
          }
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
