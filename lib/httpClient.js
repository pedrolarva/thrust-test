var Scanner = Java.type("java.util.Scanner")
var URL = Java.type("java.net.URL")
var StandardCharsets = Java.type("java.nio.charset.StandardCharsets")


function mount_http_request(method, url, params) {
    var request = this
    var params = http.serializeParams(params || {})
    var properties = {
        charset: StandardCharsets.UTF_8,
        "Content-Type": "application/x-www-form-urlencoded"
    }

    var fluent = {
        params: (function (pars) {
            params = http.serializeParams(pars)
            
            return fluent
        }).bind(request),
    
        property: (function (property, value) {
            properties[property] = value
            
            return request
        }).bind(request),

        charset: (function (value) {
            properties["Accept-Charset"] = value

            return fluent
        }).bind(request),

        contentType: (function (value) {
            properties["Content-Type"] = value

            return fluent
        }).bind(request),

        get_content: function(http_connection) {
            var inputStream = http_connection.getInputStream()
            var scanner = new Scanner(inputStream, "UTF-8")
            var content = scanner.useDelimiter("\\Z|\\A").next()
    
            scanner.close()
    
            return content
        },

        fetch: (function _fetch() {
            var http_connection

            if (method.toUpperCase() == "POST") {
                var output;

                http_connection = new URL(url).openConnection()        
                http_connection.setRequestMethod(method)
                
                Object.keys(properties).forEach(function(prop) {
                    http_connection.setRequestProperty(prop, properties[prop])
                })

                http_connection.setDoOutput(true)
                http_connection.setRequestMethod(method)
                
                try {
                    (output = http_connection.getOutputStream()).write(params.getBytes(properties.charset))
                } catch(exception) {
                    // if (output)
                    //     output.close()
                } 
            } else /* if (method.toUpperCase() == "GET") */ {
                url += "?" + params
                http_connection = new URL(url).openConnection()
            }
            
            return fluent.get_content(http_connection)
        }).bind(request)
    }

    return fluent
}


/**
  * Busca informações em uma api REST
  * @example
  * // returns {nome: "David", idade: 10}
  * HTTPClient.post("http://localhost:8080/test/pecho").charset("UTF-8").fetch()
  * @example
  * // returns "Hello World!"
  * HTTPClient.post("http://localhost:8080/test/hello").fetch()
  */
var HTTPClient = {
    get: function (url, params) { return mount_http_request("GET", url, params) },
    post: function (url, params) { return mount_http_request("POST", url, params) },
    put: function (url, params) { return mount_http_request("PUT", url, params) },
    delete: function (url, params) { return mount_http_request("DELETE", url, params) },
}

exports = HTTPClient


/*
print ("\n",
    HTTPClient
        // .post("http://localhost:8080/test/pecho", {params: {nome: "P Paulo", idade: 13}})
        .post("http://localhost:8080/test/pecho")
        .params({params: {nome: "David", idade: 10}})
        // .get("http://example.com")
        // .get("http://localhost:8080/test/json")
        // .get("http://localhost:8080/test/echo", {params: {nome: "P Paulo", idade: 13}})
        // .get("http://localhost:8080/test/echo")
        // .params({params: {nome: "P Paulo", idade: 13}})
        .charset("UTF-8")
        .fetch()
    , "\n"
)
*/
