var server = require("/lib/http").server
var router = require("/lib/httpRouter")

print("Hello Server!!")

var port = java.lang.System.getProperty("port")
print("port: ", port)
server.createServer(new Number(port), router)

