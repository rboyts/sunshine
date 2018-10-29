const isProd = process.env.NODE_ENV === 'production'

module.exports = {
  indexPath: isProd ? '200.html' : 'index.html',
}
