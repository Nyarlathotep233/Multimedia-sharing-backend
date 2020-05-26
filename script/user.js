var pool = require("../db.js")
var jwt = require('jsonwebtoken')
const secret = "qwert"
var login = function (req, res) {
  let body = req.body
  console.log('/login', body)
  console.log(req.cookies.token)
  let selectsql = `
  SELECT * FROM user WHERE account='${body.account}' 
  `
  pool.query(selectsql, (err, ret) => {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message, err.code)
      let message = ''
      res.send({ success: false, message })
      return
    }
    console.log(
      "--------------------------SELECT USER----------------------------"
    )
    console.log("RET:", ret[0])
    console.log("USER:", body)
    console.log(
      "-----------------------------------------------------------------\n\n"
    )
    let result = ret[0]
    if (result) {

      // console.log(result)
      if (result.password === body.password) {
        const token = jwt.sign({ account: result.account }, secret)
        res.cookie('token', token, { httpOnly: true, sameSite: 'Lax' })
        res.send({ success: true })
      } else {
        res.cookie('token', token, { maxAge: 0 })
        res.send({ success: false, message: '密码错误' })
      }
    } else {
      res.cookie('token', token, { maxAge: 0 })
      res.send({ success: false, message: '账号不存在' })
    }
  })
}
var register = function (req, res) {
  let body = req.body
  console.log('/register', body)
  console.log(req.cookies.token)
  let selectsql = `INSERT INTO user (account,password)
  VALUES ('${body.account}','${body.password}')`
  pool.query(selectsql, (err, ret) => {
    if (err) {
      console.log("[INSERT ERROR] - ", err.message, err.code)
      let message = ''
      if (err.code === "ER_DUP_ENTRY") {
        message = "用户名重复"
      }
      res.send({ success: false, message })
      return
    }
    console.log(
      "--------------------------INSERT USER----------------------------"
    )
    console.log("RET:", ret)
    console.log("USER:", body)
    console.log(
      "-----------------------------------------------------------------\n\n"
    )
    res.send({ success: true })
  })

}
var state = function (req, res) {
  let body = req.body
  let test = req.body.test
  let token = req.cookies.token
  console.log('/state', body)
  console.log(token)
  if (test) {
    res.send({ state: 'online', account: "zhangzec" })
    return
  }
  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err || decoded === '' || decoded === false || !decoded) {
        console.log(err)
        res.send({ state: 'err' })
      }
      //decoded　是得到的用户信息
      console.log("vertify result: ", decoded)
      res.send({ state: 'online', account: decoded.account })
    })

  } else {
    res.send({ state: 'offline' })
  }
}
module.exports = {
  login,
  register,
  state
}