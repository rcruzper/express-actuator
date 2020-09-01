'use strict'

class Metrics {
  route (req, res) {
    res.status(200).json({
      mem: process.memoryUsage(),
      uptime: process.uptime()
    })
  }
}
module.exports = Metrics
