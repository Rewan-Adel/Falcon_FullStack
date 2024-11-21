exports.serverErrorMessage = (error, res) =>{
    return res.status(500).json({
        status: "error",
        message: "Internal Server Error!",
        data: error.message
    });
};

exports.badRequestMessage = (msg, res) =>{
    return res.status(400).json({
        status: "fail",
        message: msg || "Bad Request",
        data: null
    });
};

exports.unAuthorizedMessage = (msg, res) =>{
    return res.status(401).json({
        status : "fail",
        message: msg,
        data: null
    });
};

exports.notFoundError = (msg, res) =>{
    return res.status(404).json({
        status : "fail",
        message: msg ,
        data: null
    });
};

exports.notFoundMessage = (msg, res) =>{
    return res.status(200).json({
        status : "success",
        message: msg || "Not found!",
        data: null
    });
}