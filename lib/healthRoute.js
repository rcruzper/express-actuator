'use strict';

module.exports = function metrics(req, res) {
    res.status(200).json({
        status: "UP"
    });
};
