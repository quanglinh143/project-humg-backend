import jwt from "jsonwebtoken"
import Users from "../models/userModel.js"
import Payments from "../models/paymentModel.js"
import bcrypt from "bcrypt"

const register = async (req, res) => {
 try {
  const { name, email, password } = req.body

  const user = await Users.findOne({ email })
  if (user) return res.status(400).json({ msg: "Email đã tồn tại" })
  if (password.length < 6)
   return res.status(400).json({ msg: "Mật khẩu dài ít nhất 6 ký tự" })

  // Password Encryption
  const passwordHash = await bcrypt.hash(password, 10)

  const newUser = new Users({
   name,
   email,
   password: passwordHash,
  })

  // Save mongodb
  await newUser.save()

  const accesstoken = createAccessToken({ id: newUser._id })
  const refreshtoken = createRefreshToken({ id: newUser._id })

  res.cookie("refreshtoken", refreshtoken, {
   httpOnly: true,
   path: "/user/refresh_token",
   maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  })

  res.json({ accesstoken })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const login = async (req, res) => {
 try {
  const { email, password } = req.body
  const user = await Users.findOne({ email })
  if (!user) return res.status(400).json({ msg: "Người dùng không tồn tại" })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(400).json({ msg: "Mật khẩu không đúng" })

  // If login success , create access token and refresh token
  const accesstoken = createAccessToken({ id: user._id })
  const refreshtoken = createRefreshToken({ id: user._id })
  res.cookie("refreshtoken", refreshtoken, {
   httpOnly: true,
   path: "/user/refresh_token",
   maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
  })

  return res.json({ accesstoken })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const loginDashboard = async (req, res) => {
 try {
  const { email, password } = req.body
  const user = await Users.findOne({ email })
  if (!user) return res.status(400).json({ msg: "Người dùng không tồn tại" })

  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) return res.status(400).json({ msg: "Mật khẩu không đúng" })
  if (user.role == 0) {
   return res.status(400).json({ msg: "Tài khoản không phải ADMIN" })
  }
  if (user.role == 1) {
   // If login success , create access token and refresh token
   const accesstoken = createAccessToken({ id: user._id })
   const refreshtoken = createRefreshToken({ id: user._id })
   res.cookie("refreshtoken", refreshtoken, {
    httpOnly: true,
    path: "/user/refresh_token",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7d
   })

   return res.json({ accesstoken })
  }
  return res.status(200).json({ msg: "Đăng nhập thành công" })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const logout = async (req, res) => {
 try {
  res.clearCookie("refreshtoken", { path: "/" })
  res.json({ msg: "Đăng xuất!" })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const changePassword = async (req, res) => {
 try {
  const { id, oldPassword, password, rePassword } = req.body
  if (password.length < 6)
   return res.status(400).json({ msg: "Mật khẩu ít nhất 6 ký tự" })
  if (password !== rePassword)
   return res.status(400).json({ msg: "Nhập lại mật khẩu" })
  // Password Encryption
  const passwordHash = await bcrypt.hash(password, 10)
  const user = await Users.findById(id)
  if (!user) return res.status(400).send("Người dùng không tồn tại")
  // validate old password
  const isValidPassword = await bcrypt.compare(oldPassword, user.password)
  if (!isValidPassword) {
   return res.status(400).send({ msg: "Vui lòng nhập mật khẩu" })
  }

  // update user's password
  if (oldPassword === password) {
   return res.status(500).json({ msg: "Mật khẩu mới phải khác mật khẩu cũ" })
  }
  await Users.findOneAndUpdate(
   { _id: id },
   { password: passwordHash },
   { new: true }
  )
  return res.status(200).json({ msg: "Đổi mật khẩu thành công" })
 } catch (error) {
  res.status(500).json({ msg: error.message })
 }
}

const updateInfo = async (req, res) => {
 const { id, name, avatar, phone_number, date_of_birth, address, gender } =
  req.body
 try {
  await Users.findOneAndUpdate(
   { _id: id },
   {
    name: name,
    avatar: avatar,
    phone_number: phone_number,
    date_of_birth: date_of_birth,
    address: address,
    gender: gender,
   },
   { new: true }
  )
  return res.json({ msg: "Cập nhật thành công" })
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const getUser = async (req, res) => {
 try {
  const user = await Users.findById(req.user.id)
  if (!user) return res.status(400).json({ msg: "Người dùng không tồn tại" })

  const listPayment = await Payments.find()

  const checkListPayment = listPayment.filter((i) => {
   return i.user_id === user._id.toString() && i.status === "3"
  })

  const totalPayment = checkListPayment?.reduce((prev, item) => {
   return prev + item.totalPurchasePrice
  }, 0)
  const setRank = (totalPayment) => {
   if (totalPayment <= 0 || (totalPayment > 0 && totalPayment <= 5000)) {
    return "đồng"
   } else if (totalPayment > 5000000 && totalPayment <= 8000000) {
    return "bạc"
   } else if (totalPayment > 8000000 && totalPayment <= 13000000) {
    return "vàng"
   } else if (totalPayment > 13000000 && totalPayment <= 20000000) {
    return "bạch kim"
   } else {
    return "kim cương"
   }
  }
  const setDiscount = (totalPayment) => {
   if (totalPayment <= 0 || (totalPayment > 0 && totalPayment <= 5000)) {
    return 0
   } else if (totalPayment > 5000000 && totalPayment <= 8000000) {
    return 1
   } else if (totalPayment > 8000000 && totalPayment <= 13000000) {
    return 3
   } else if (totalPayment > 13000000 && totalPayment <= 20000000) {
    return 5
   } else {
    return 10
   }
  }
  await Users.findOneAndUpdate(
   { _id: user._id.toString() },
   {
    totalPayment: totalPayment.toFixed(2) || 0,
    rank: setRank(totalPayment),
    discount: setDiscount(totalPayment),
   }
  )

  return res.status(200).json(user)
 } catch (error) {
  return res.status(500).json({ msg: error.message })
 }
}

const addCart = async (req, res) => {
 try {
  const user = await Users.findById(req.user.id)
  if (!user) return res.status(400).json({ msg: "Người dùng không tồn tại" })

  await Users.findOneAndUpdate(
   { _id: req.user.id },
   {
    cart: req.body.cart,
   }
  )
  res.status(200).json({ msg: "Thêm vào giỏ hàng thàng công" })
 } catch (error) {
  res.status(500).json({ msg: error.message })
 }
}

const history = async (req, res) => {
 try {
  const history = await Payments.find({ user_id: req.user.id }).sort({
   createdAt: -1,
  })
  res.json(history)
 } catch (error) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

const getTotalUser = async (req, res) => {
 const currentPage = req.query.currentPage
 const limit = req.query.limit
 const startIndex = (currentPage - 1) * limit
 const lastIndex = currentPage * limit

 let results = {}
 try {
  const users = await Users.find()
  if (users) {
   const customers = users.filter((item) => {
    return item.role !== 1
   })
   results.totalBrands = customers.length
   results.pageCount = Math.ceil(customers.length / limit)

   if (lastIndex < customers.length) {
    results.next = {
     currentPage: currentPage + 1,
    }
   }

   if (startIndex > 0) {
    results.prev = {
     currentPage: currentPage - 1,
    }
   }
   results.total = customers.length
   results.result = customers.slice(startIndex, lastIndex)
  }
  res.json(results)
 } catch (error) {
  return res.status(500).json({ msg: "Đã có lỗi xảy ra" })
 }
}

const refreshToken = async (req, res) => {
 try {
  const rf_token = req.cookies.refreshtoken
  // const rf_token = sessionStorage.getItem("refreshtoken")
  if (!rf_token)
   return res
    .status(400)
    .json({ msg: "Vui lòng đăng nhập hoặc đăng ký - refresh token" })

  jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
   if (err)
    return res
     .status(400)
     .json({ msg: "Vui lòng đăng nhập hoặc đăng ký  - verify token" })

   const accesstoken = createAccessToken({ id: user.id })

   res.json({ accesstoken })
  })
 } catch (err) {
  return res.status(500).json({ msg: err.message })
 }
}

const createAccessToken = (user) => {
 return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" })
}

const createRefreshToken = (user) => {
 return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "1d" })
}

export default {
 register,
 refreshToken,
 login,
 logout,
 getUser,
 addCart,
 history,
 changePassword,
 updateInfo,
 loginDashboard,
 getTotalUser,
}
