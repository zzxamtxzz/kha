import jsonwebtoken from "jsonwebtoken";

export const generateRefreshToken = (sub: string) => {
  const payload = { sub };
  return jsonwebtoken.sign(payload, process.env.REFRESH_TOKEN_PASSWORD ?? "", {
    expiresIn: "30d",
  });
};

export const generateToken = (sub: string) => {
  const payload = { sub };

  return jsonwebtoken.sign(payload, process.env.TOKEN_PASSWORD ?? "", {
    expiresIn: "1h",
  });
};
