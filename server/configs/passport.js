import "dotenv/config";
import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import User from "../models/User.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const googleId = profile.id;
        const name = profile.displayName;
        const email = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        // Check if user already exists with this Google account
        let user = await User.findOne({ googleId }).select("-password");

        if (user) {
          return done(null, user);
        }

        // Check if a user exists with the same email
        if (email) {
          user = await User.findOne({ email }).select("-password");

          if (user) {
            // Link Google account to existing user
            user.googleId = googleId;

            if (avatar) {
              user.avatar = avatar;
            }

            await user.save();

            return done(null, user);
          }
        }

        // Create a new user
        user = await User.create({
          googleId,
          name,
          email,
          avatar,
        });

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user._id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id).select("-password");
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;