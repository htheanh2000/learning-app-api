function healthCheck (req,res) {
    res.send({
        message: "SERVER IS RUNNING AT " + new Date().toLocaleTimeString()
      });
}

module.exports = {
    healthCheck
}