const { isValidHttpUrl } = require("./utils/helper.js")

process.argv.slice(2).forEach(e => {
    console.log(e, isValidHttpUrl(e))
})