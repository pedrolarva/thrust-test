var Charset = Java.type("java.nio.charset.Charset")

var router = {
    applicationDirectory: "./",

    middlewares: [],

    endpoints: {
    },

    vroutes: {
        "/": function runningThrust(params, request, response) {
            response.contentType = "text/html; charset=utf-8"
            response.write("<H1>Thrust is running!!!</H1>")
        }
    },

    process: function (params, request, response) {
        var mimes = ["text/html", "text/xml", "text/plain", "text/javascript", "application/javascript", "application/json"]
        
        var isItOK = this.middlewares.reduce(function execMiddleware(flag, middFnc) {
            flag = (flag === undefined) ? true : flag

            return flag && middFnc(params, request, response)
        }, true)

        if (isItOK) {
            this.processRoute(params, request, response)
        }

        var httpResponse = response.httpResponse

        httpResponse.setStatus(response.status)
        httpResponse.setContentType(response.contentType)
        httpResponse.setCharacterEncoding(response.charset)

        for (var key in response.headers) {
            httpResponse.setHeader(key, response.headers[key])
        }

        var type = response.contentType.split(";")[0]

        if (mimes.indexOf(type) >= 0) {
            var sout = (response.contentType.indexOf("json") >= 0) ?
                response.toJson() :
                response.toString()

            httpResponse.setContentLength(sout.getBytes(Charset.forName(response.charset)).length)
            httpResponse.getWriter().println(sout)
            httpResponse.flushBuffer()

        } else {
            var ops = httpResponse.getOutputStream()

            httpResponse.setContentLength(response.contentLength)
            ops.write(response.out[0])
            ops.flush()
        }        

    },

    processRoute: function (paramsObject, request, response) {
        var params = paramsObject || {}
        var nurl = request
            .rest
            .replace(/\/$/g, "")
        var keys = Object.keys(this.vroutes)
        var vrota
        var rrota

        function runMethodOnModule(rrota) {
            var path = router.applicationDirectory
                .concat(rrota)
                .replace(/^\//, "")
                .split("/")
            var methodName = path.pop()
            var module = require(path.join("/") + ".js")
            var fnc_metodo = module[methodName]

            fnc_metodo = (fnc_metodo)
                ? fnc_metodo
                : module[
                    request
                        .method
                        .toUpperCase()
                ][methodName]
            fnc_metodo(paramsObject, request, response)
        }

        var splitRoute = nurl
            .replace(/^\//, "")
            .split("/")

        nurl = (nurl === "")
            ? "/"
            : nurl
        vrota = ["/" + splitRoute.shift()].join("")

        if (vrota.charAt(1) === "@" && keys.indexOf(vrota) >= 0) {

            rrota = this.vroutes[vrota]
            rrota = rrota.concat((splitRoute.length == 0)
                ? ""
                : [
                    "/", splitRoute.shift()
                ].join(""))

            if (Object.keys(params).toString() === "") 
                paramsObject = splitRoute

        } else

        /* É simplesmente um virtual path? */
        if (keys.indexOf(nurl) >= 0) {

            rrota = this.vroutes[nurl]

        } else {/* Ou é uma rota com placeholder ou é uma url do tipo ../modulo/metodo */

            var vrout = keys.map(function (rt, index) {
                return {
                    rota: rt.replace(/:(\w+)/g, "(\\w+)"),
                    index: index
                }
            })
                .filter(function (rotaIndex) {
                    return new RegExp("^" + rotaIndex.rota + "$").test(nurl)
                })[0]

            /* É uma rota com placeholder? */
            if (vrout !== undefined) {
                vrota = keys[vrout.index]
                rrota = (vrout)
                    ? this.vroutes[vrota]
                    : rrota

                var mat
                var regIds = /:(\w+)/gi
                var ids = []

                while ((mat = regIds.exec(vrota)) !== null) {
                    ids.push(mat[1])
                }

                var values = nurl
                    .match(vrout.rota)
                    .slice(1)

                for (var i = 0; i < ids.length; i++) {
                    params[ids[i]] = values[i]
                }
            } else {/* Não, é uma rota do tipo ../module/method */
                rrota = nurl
            }
        }

        // print("\nnurl => [" + nurl + "]")
        // print("\nvrota => [" + vrota + "]")
        // print("\ntypeof(rrota) => [" + typeof(rrota) + "]")

        if (typeof(rrota) == "function") 
            rrota(params, request, response)
        else 
            runMethodOnModule(rrota)
    }
}

exports = router