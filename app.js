const crypto = require('crypto')
const util = require('util')
const exec = util.promisify(require('child_process').exec)
const app = require('express')()
const bodyParser = require('body-parser')

app.use(bodyParser.json())
app.use(verifySignature)

function verifySignature (req, res, next){
    const bodyInPlainText = JSON.stringify(req.body)
    const hmac = crypto.createHmac('sha1', process.env.SECRET)
    const digest = 'sha1=' + hmac.update(bodyInPlainText).digest('hex')
    const checksum = req.get('X-Hub-Signature')
    if (!checksum || !digest || checksum !== digest) {
        return res.status(403).send({message: "FORBIDDEN"})
    }
    next()
}

app.post('/push', async function (req, res) {
    try {
        if (req.body.ref !== 'refs/heads/master') {
           throw Error("not master branch")
        }
        // run Ansible script
        console.log('start deployment...')
        const cmdResult = await exec(`ansible-playbook ${process.env.ANSIBLE_PLAYBOOK} \
--extra-vars "@${process.env.ANSIBLE_EXTRA_VARS_FILE}" \
--extra-vars "{\\"deploy_just_static_content\\": true}" \
--vault-id prod@${process.env.ANSIBLE_PWD_FILE}`)
        console.log('Result: ', cmdResult)
     } catch (e) {
         console.log('Error: ', e)
     }
      res.status(200).send({ received: true })
})


const server = app.listen(process.env.PORT)
console.log("API listen on port %d", process.env.PORT)
module.exports = server
