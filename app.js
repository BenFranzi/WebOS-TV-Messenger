const lgtv = require("lgtv")
const express = require('express')
const morgan = require('morgan')
const path = require('path')
const bodyParser = require('body-parser');
const app = express()

var port = process.env.PORT || 8080
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

function messageTV(message) {
  var retry_timeout = 10
  lgtv.discover_ip(retry_timeout, (err, ipaddr) => {
    if (err) {
      console.log("failed to connect")
    } else {
      console.log(ipaddr);
      lgtv.connect(ipaddr, function(err, response){
        if (!err) {
          lgtv.show_float(message, function(err, response){
            if (!err) {
              lgtv.disconnect()
            }
          })
        }
      })
    }
  })
}
app.get('/', (req,res) => {
  res.sendFile(path.join(__dirname + '/page.html'))
})
app.post('/', (req,res) => {
  console.log(`Sending message: ${req.body.message}`);
  messageTV(req.body.message)
  res.redirect('/')
})


app.listen(port)
console.log(`running on ${port}`);
