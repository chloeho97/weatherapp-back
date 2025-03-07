function checkBody(body, requiredFields) {
    return requiredFields.every(field => body[field] && body[field] !== '');
}


module.exports = {checkBody};