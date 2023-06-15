import Users from "../models/userModel.js"

const authAdmin = async (req, res, next) => {
 try {
  // Get user information by id
  const user = await Users.findOne({
   _id: req.user.id,
  })

  if (user.role === 0)
   return res
    .status(400)
    .json({ msg: "Quyền truy cập tài nguyên quản trị bị từ chối" })

  next()
 } catch (err) {
  return res.status(500).json({ msg: err.message })
 }
}

export default authAdmin
