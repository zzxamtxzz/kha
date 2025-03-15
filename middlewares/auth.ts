import Session from "@/models/session";
import jwt from "jsonwebtoken";

const env = process.env.NODE_ENV === "development";

export const authMiddleware = async (sessionId: string) => {
  let session;
  try {
    session = (await Session.findByPk(Number(sessionId)))?.dataValues;
  } catch (error) {}

  if (!session) return false;
  const sessionData = env ? JSON.parse(session.session) : session.session;
  let sub;

  try {
    let decoded = jwt.verify(sessionData.token, process.env.TOKEN_PASSWORD!);
    sub = decoded.sub;
  } catch (error) {
    if (!sessionData.refreshToken) return false;
    try {
      let decoded = jwt.verify(
        sessionData.refreshToken,
        process.env.REFRESH_TOKEN_PASSWORD!
      );
      sub = decoded.sub;
      return sub;
    } catch (error) {
      return false;
    }
  }
  return sub;
};
