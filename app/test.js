exports = {
    GET: {
        hello: function (params, req, res) {
            res.write("GET hello!")
        }
    },

    echo: function (params, req, res) {
        print("phello => ", JSON.stringify(params))
        params.server = true
        res.json(params)
    },
    
    POST: {
        phello: function (params, req, res) {
            print("phello => ", JSON.stringify(params))
            res.write("hello!")
        }, 
        pecho: function (params, req, res) {
            print("phello => ", JSON.stringify(params))
            params.server = true
            res.json(params)
        }            
    }
}