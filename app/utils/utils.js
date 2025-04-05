import jwt from "jsonwebtoken";

const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
};

export const setCookie = (userId, res) => {
    const token = generateToken(userId);
    res.cookie("token", token, { maxAge: 24 * 60 * 3600, httpOnly: true, sameSite: "strict", secure: false });
};

export const getAvatar = (firstName, lastName) => {
    return `https://avatar.iran.liara.run/username?username=${firstName}+${lastName}`;
};

export function omitFields(obj, keys) {
    const newObj = { ...obj };
    keys.forEach((key) => {
        delete newObj[key];
    });
    return newObj;
}
