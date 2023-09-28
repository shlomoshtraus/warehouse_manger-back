import jsonwebtoken, {JwtHeader, JwtPayload} from "jsonwebtoken";

function getQueryName(req) {
    if (!req.body.query)
        return null;
    const splitByWhitespace = req.body.query.split("(")[0].split(" ");
    return splitByWhitespace[splitByWhitespace.length - 1]
}

export function checkPermission(req, res, next) {
    const queryName = req.body.operationName || getQueryName(req);
    if (["login", "register", "requestPasswordLink", "resetUserPassword", "productStatus"].indexOf(queryName) !== -1) return next();
    const fullToken = req.header("Authorization");
    if (!fullToken)
        return res.status(403).send("Unauthorized!");
    const bearerToken = fullToken.substring(7)
    const secret = process.env.JWT_SECRET
    try {
        const token = jsonwebtoken.verify(bearerToken, secret) as JwtPayload;
        const role = token.user.role;
        switch (role) {
            case "worker":
                if (["makeASell","searchForProducts", "getAllProducts"].indexOf(queryName) === -1)
                    return res.status(403).send("Unauthorized!");
                break
            case "client":
                if (["searchForProducts", "getAllProducts"].indexOf(queryName) === -1)
                    return res.status(403).send("Unauthorized!");
                break
        }

    } catch (e) {
        return res.status(403).send("Unauthorized!");
    }
    next()
}