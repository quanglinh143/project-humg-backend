import jwt from "jsonwebtoken"

const auth = (req, res, next) => {
 try {
  const token = req.header("Authorization")
  if (!token) return res.status(400).json({ msg: "Không có token" })

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
   if (err) return res.status(400).json({ msg: "Xác thực không hợp lệ." })

   req.user = user
   next()
  })
 } catch (err) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

export default auth
