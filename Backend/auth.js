const jwt= require('jsonwebtoken');
const secret="Studytime@1"
function setToken(user) {
    const token = jwt.sign({email: user.email, password: user.password},secret);
    return token;}
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, secret);
        return decoded;
    } catch (error) {
        return null;
    }
}
module.exports = { setToken, verifyToken };
