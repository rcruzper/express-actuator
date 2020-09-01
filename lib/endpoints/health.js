'use strict'

class Health {
  route (req, res) {
    res.status(200).json({
      status: 'UP'
    })
  }
}

module.exports = Health
