module.exports.imagePost = (req, res) => {
  res.json({
    location: req.file.path
  })
}