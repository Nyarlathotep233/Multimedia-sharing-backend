var express = require("express");
var app = express();
var mysearchSpider = require("./spiders/search-spiders/my-search-spider");
var bilisearchSpider = require("./spiders/search-spiders/bilibili-serach-spider");
var migusearchSpider = require("./spiders/search-spiders/migu-search-spider")
var cors = require("cors");
var pool = require("./db.js")
var autospider = require("./autospiders");
var path = require("path");

// https
var fs = require('fs');
var https = require('https').createServer({
  key: fs.readFileSync('./3017312_zhangzec.vip.key'),
  cert: fs.readFileSync('./3017312_zhangzec.vip.crt')
}, app);
var SkyRTC = require('skyrtc').listen(https);
var path = require("path");

var port = 3000;

https.listen(port, () => {
  console.log("app listen port in https://localhost:" + port)
});
// ////////////

// // http
// var http = require('http').createServer(app);
// var SkyRTC = require('skyrtc').listen(http);
// var path = require("path");

// var port = process.env.PORT || 80;
// http.listen(()=>{
//    console.log("app listen port in http://localhost:" + port)
// });
// // /////////////

app.use(express.static(path.join(__dirname, 'public')));

SkyRTC.rtc.on('new_connect', function (socket) {
  console.log('创建新连接');
});

SkyRTC.rtc.on('remove_peer', function (socketId) {
  console.log(socketId + "用户离开");
});

SkyRTC.rtc.on('new_peer', function (socket, room) {
  console.log("新用户" + socket.id + "加入房间" + room);
});

SkyRTC.rtc.on('socket_message', function (socket, msg) {
  console.log("接收到来自" + socket.id + "的新消息：" + msg);
});

SkyRTC.rtc.on('ice_candidate', function (socket, ice_candidate) {
  console.log("接收到来自" + socket.id + "的ICE Candidate");
});

SkyRTC.rtc.on('offer', function (socket, offer) {
  console.log("接收到来自" + socket.id + "的Offer");
});

SkyRTC.rtc.on('answer', function (socket, answer) {
  console.log("接收到来自" + socket.id + "的Answer");
});

SkyRTC.rtc.on('error', function (error) {
  console.log("发生错误：" + error.message);
});

// app.use(
//   cors({
//     origin: ["http://localhost:8080"],
//     methods: ["GET", "POST"],
//     alloweHeaders: ["Conten-Type", "Authorization"]
//   })
// );
app.use(cors())

app.use("/", express.static("./dist"));


app.get("/search", (req, res) => {
  var movieArr = {};
  (async () => {
    console.log('/search:maoyan')
    await mysearchSpider(req.query.searchContent).then((data) => {
      movieArr.maoyan = data;
    });
    console.log('/search:bilibili')
    movieArr.bilibili = await bilisearchSpider(req.query.searchContent);
    res.send(movieArr)
  })();
});
app.get("/searchMusic", (req, res) => {
  var musicArr = {};
  (async () => {
    console.log('/search:migu')
    musicArr.migu = await migusearchSpider(req.query.searchContent);
    res.send(musicArr)
  })()
});
app.get("/movielist", (req, res) => {
  var selectsql = `select * from movies`
  pool.query(selectsql, (err, ret) => {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }

    console.log(
      "--------------------------SELECT----------------------------"
    );
    //console.log('INSERT ID:',result.insertId);
    // console.log("SELECT RET:", ret);
    var list = [];
    for (var i = 0; i < ret.length; i++) {
      let temp = {
        movieTitle: ret[i].moviesname,
        moviePoster: ret[i].moviespicurl,
        movieLink: ret[i].defaultlink,
        movieDetail: ret[i].moviesdetail
      };
      list.push(temp)
    }
    res.send(list);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );
  })
})

app.get("/movierecommend", (req, res) => {
  var selectsql = "select * from movies  order by moviesdetail DESC limit 10"
  pool.query(selectsql, (err, ret) => {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }

    console.log(
      "--------------------------SELECT----------------------------"
    );
    //console.log('INSERT ID:',result.insertId);
    // console.log("SELECT RET:", ret);
    var list = [];
    for (var i = 0; i < ret.length; i++) {
      let temp = {
        movieTitle: ret[i].moviesname,
        moviePoster: ret[i].moviespicurl,
        movieLink: ret[i].defaultlink,
        movieDetail: ret[i].moviesdetail
      };
      list.push(temp)
    }
    res.send(list);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );
  })
})
app.get("/movieListRankingBox", (req, res) => {
  var selectsql = `SELECT * FROM moviesrankinglist where moviestype='rankingBox' order by moviesrank;`
  pool.query(selectsql, (err, ret) => {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }

    console.log(
      "--------------------------SELECT----------------------------"
    );
    //console.log('INSERT ID:',result.insertId);
    // console.log("SELECT RET:", ret);
    var list = [];
    for (var i = 0; i < ret.length; i++) {
      let temp = {
        movieTitle: ret[i].moviesname,
        moviePoster: ret[i].moviespicurl,
        movieLink: ret[i].movieslink,
        movieRank: ret[i].moviesrank
      };
      list.push(temp)
    }
    res.send(list);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );
  })
})
app.get("/movieListMostExcept", (req, res) => {
  var selectsql = `SELECT * FROM moviesrankinglist where moviestype='mostExcept' order by moviesrank;`
  pool.query(selectsql, (err, ret) => {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }

    console.log(
      "--------------------------SELECT----------------------------"
    );
    //console.log('INSERT ID:',result.insertId);
    // console.log("SELECT RET:", ret);
    var list = [];
    for (var i = 0; i < ret.length; i++) {
      let temp = {
        movieTitle: ret[i].moviesname,
        moviePoster: ret[i].moviespicurl,
        movieLink: ret[i].movieslink,
        movieRank: ret[i].moviesrank
      };
      list.push(temp)
    }
    res.send(list);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );
  })
})
app.get("/movieListTop100", (req, res) => {
  var selectsql = `SELECT * FROM moviesrankinglist where moviestype='top100' order by moviesrank;`
  pool.query(selectsql, (err, ret) => {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }

    console.log(
      "--------------------------SELECT----------------------------"
    );
    //console.log('INSERT ID:',result.insertId);
    // console.log("SELECT RET:", ret);
    var list = [];
    for (var i = 0; i < ret.length; i++) {
      let temp = {
        movieTitle: ret[i].moviesname,
        moviePoster: ret[i].moviespicurl,
        movieLink: ret[i].movieslink,
        movieRank: ret[i].moviesrank
      };
      list.push(temp)
    }
    res.send(list);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );
  })
})
app.get("/musicList", (req, res) => {
  pool.query("SELECT * FROM migu_music_billboard order by itemNum;", (err, ret) => {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }
    console.log(
      "--------------------------SELECT----------------------------"
    );
    res.send(ret);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );
  })
})
app.get("/musicNewAlbum", (req, res) => {
  pool.query("SELECT * FROM migu_music_new_album order by albumDate desc;", (err, ret) => {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }
    console.log(
      "--------------------------SELECT----------------------------"
    );
    res.send(ret);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );
  })
})
app.get("/musicNewSong", (req, res) => {
  pool.query("SELECT * FROM migu_music_new_song;", (err, ret) => {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }
    console.log(
      "--------------------------SELECT----------------------------"
    );
    res.send(ret);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );
  })
})
app.get("/musicRecommend", (req, res) => {
  pool.query("SELECT * FROM migu_music_recommend_list;", (err, ret) => {
    if (err) {
      console.log("[SELECT ERROR] - ", err.message);
      return;
    }
    console.log(
      "--------------------------SELECT----------------------------"
    );
    res.send(ret);
    console.log(
      "-----------------------------------------------------------------\n\n"
    );
  })
})
app.get("/updateBySpider", (req, res) => {
  autospider();
  res.send("updating");
})

app.get("/lastUpdate", (req, res) => {
  console.log('/lastUpdate')
  var file = path.join(__dirname, 'data/template.json')
  fs.readFile(file, 'utf-8', function (err, data) {
    if (err) {
      res.send('文件读取失败')
    } else {
      var tData = data.toString()
      tData = JSON.parse(tData)
      console.log(tData.date)
      if (tData.date) {
        res.send({
          date: tData.date
        })
      } else {
        console.log("时间读取失败")
        // 更新时间
        let nowDate = Date.now()
        fs.readFile(file, function (err, data) {
          if (err) {
            return console.error(err)
          }
          var tData = data.toString()
          tData = JSON.parse(tData)
          tData.date = nowDate
          var str = JSON.stringify(tData)
          fs.writeFile(file, str, function (err) {
            if (err) {
              console.error(err)
            }
            console.log('----------时间更新成功-------------')
          })
        })
        res.send({
          date: nowDate
        })
      }

    }
  })
})

// 爬虫自动更新 10小时
setInterval(() => {
  autospider()

  let nowDate = Date.now()
  var file = path.join(__dirname, 'data/template.json')
  fs.readFile(file, function (err, data) {
    if (err) {
      return console.error(err)
    }
    var tData = data.toString() //将二进制的数据转换为字符串
    tData = JSON.parse(tData) //将字符串转换为json对象
    tData.date = nowDate
    var str = JSON.stringify(tData) //因为nodejs的写入文件只认识字符串或者二进制数，所以把json对象转换成字符串重新写入json文件中
    fs.writeFile(file, str, function (err) {
      if (err) {
        console.error(err)
      }
      console.log('----------时间更新成功-------------')
    })
  })
}, 36000000)