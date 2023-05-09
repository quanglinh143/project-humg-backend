import express from "express"
import cloudinary from "cloudinary"
import fs from "fs"
import authMiddleware from "../middleware/auth.js"
import dotenv from "dotenv"
const router = express.Router()
dotenv.config()
cloudinary.config({
 cloud_name: process.env.CLOUD_NAME,
 api_key: process.env.CLOUD_API_KEY,
 api_secret: process.env.CLOUD_API_SECRET,
})

router.post("/upload", authMiddleware, (req, res) => {
 try {
  if (!req.files || Object.keys(req.files).length === 0)
   return res.status(400).json({ msg: "No files were uploaded." })

  const file = req.files.file
  if (file.size > 1024 * 1024) {
   removeTmp(file.tempFilePath)
   return res.status(400).json({ msg: "Size too large" })
  }

  if (file.mimetype !== "image/jpeg" && file.mimetype !== "image/png") {
   removeTmp(file.tempFilePath)
   return res.status(400).json({ msg: "File format is incorrect." })
  }

  cloudinary.v2.uploader.upload(
   file.tempFilePath,
   { folder: "imgECommerce" },
   async (err, result) => {
    if (err) throw err
    removeTmp(file.tempFilePath)
    res.json({ public_id: result.public_id, url: result.secure_url })
   }
  )
 } catch (error) {
  res.status(500).json({ msg: error.message })
 }
})

// delete img
router.post("/destroy", authMiddleware, (req, res) => {
 try {
  const { public_id } = req.body
  if (!public_id) return res.status(400).json({ msg: "No image selected!" })
  cloudinary.v2.uploader.destroy(public_id, async (err, result) => {
   if (err) throw err
   res.json({ msg: "Delete Image" })
  })
 } catch (error) {
  res.status(500).json({ msg: error.message })
 }
})
const removeTmp = (path) => {
 fs.unlink(path, (err) => {
  if (err) throw err
 })
}

export default router
