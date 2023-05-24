import Passport from "passport";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { secretKey } from "./config";
import { userService } from "../user/service";

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: secretKey,
};

Passport.use(
  new JwtStrategy(
    jwtOptions,
    async (jwtPayload: { sub: string; iat: number }, done) => {
      const activeUser = await userService.getUserById(jwtPayload.sub);

      if (activeUser) {
        console.log("activeUser", activeUser);
        return done(null, activeUser);
      } else {
        console.log("activeUser not found");
        return done(null, false);
      }
    }
  )
);
