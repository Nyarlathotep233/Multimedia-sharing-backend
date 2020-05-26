const puppeteer = require('puppeteer')
var pool = require('../db.js')

module.exports = () => {
  (async () => {


    const browser = await puppeteer.launch({
      // headless: false,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    const page = await browser.newPage()
    await page.goto('http://music.migu.cn/v3')
    // await page.waitFor(1000);
    var homePageArr = await page.evaluate(() => {
      var homePageArr = {
        songList: [],
        song: [],
        album: [],
        billboard1: [],
        billboard2: [],
        billboard3: []
      }
      // songList 只有'推荐'
      // type recommend
      var elements = document.querySelectorAll('#playlist .wrapper-items>.item-contain')
      // console.log(elements)
      elements.forEach((element, i) => {
        var temp = {
          musicListImg: element.querySelectorAll('.item-box>a>img')[0].getAttribute("data-src"),
          musicListLink: 'http://music.migu.cn' + element.querySelectorAll('.item-box>a')[0].getAttribute("href"),
          musicListTitle: element.querySelectorAll('.item-info>a')[0] ? element.querySelectorAll('.item-info>a')[0].innerText : '',
          musicListPlayCount: (element.querySelectorAll('.item-playCnt')[0] && element.querySelectorAll('.item-playCnt')[0].innerText) || ''
        }
        // console.log("-------------")
        // console.log("img:", temp.musicListImg)
        // console.log("link:", temp.musicListLink)
        // console.log("title:", temp.musicListTitle)
        // console.log("playCount:", temp.musicListPlayCount)
        // console.log("-------------")

        homePageArr.songList.push(temp)
      })

      // song 只有'华语'
      // type China
      elements = document.querySelectorAll('#songs .wrapper-items>.item-column')
      // console.log(elements)
      elements.forEach((element, i) => {
        var temp = {
          musicImg: 'http:' + element.querySelectorAll('.item-box>a>img')[0].getAttribute("data-src"),
          musicLink: 'http://music.migu.cn' + element.querySelectorAll('.item-box>a')[0].getAttribute("href"),
          musicTitle: element.querySelectorAll('.item-info>.song-name')[0] ? element.querySelectorAll('.item-info>.song-name')[0].innerText : '',
          musicSinger: element.querySelectorAll('.item-info>.singer')[0] ? element.querySelectorAll('.item-info>.singer')[0].innerText : '',
          musicSingerLink: 'http://music.migu.cn' + element.querySelectorAll('.item-info>.singer>a')[0].getAttribute("href"),
          musicTime: (element.querySelectorAll('.song-time')[0] && element.querySelectorAll('.song-time')[0].innerText) || ''
        }
        // console.log("-------------")
        // console.log("img:", temp.musicImg)
        // console.log("link:", temp.musicLink)
        // console.log("title:", temp.musicTitle)
        // console.log("singer:", temp.musicSinger)
        // console.log("singerLink:", temp.musicSingerLink)
        // console.log("time:", temp.musicTime)
        // console.log("-------------")

        homePageArr.song.push(temp)
      })


      // album
      elements = document.querySelectorAll('#album .wrapper-items>.item-contain')
      // console.log(elements)
      elements.forEach((element, i) => {
        var temp = {
          albumImg: 'http:' + element.querySelectorAll('.item-box>a>img')[0].getAttribute("data-src"),
          albumLink: 'http://music.migu.cn' + element.querySelectorAll('.item-box>a')[0].getAttribute("href"),
          albumTitle: element.querySelectorAll('.item-info>.album-name>a')[0] ? element.querySelectorAll('.item-info>.album-name>a')[0].innerText : '',
          albumSinger: element.querySelectorAll('.item-info>.singer>a')[0] ? element.querySelectorAll('.item-info>.singer>a')[0].innerText : '',
          albumSingerLink: 'http://music.migu.cn' + element.querySelectorAll('.item-info>.singer>a')[0].getAttribute("href"),
          albumDate: (element.querySelectorAll('.update-time')[0] && element.querySelectorAll('.update-time')[0].innerText) || ''
        }
        // console.log("-------------")
        // console.log(element)
        // console.log("img:", temp.albumImg)
        // console.log("link:", temp.albumLink)
        // console.log("title:", temp.albumTitle)
        // console.log("singer:", temp.albumSinger)
        // console.log("singerLink:", temp.albumSingerLink)
        // console.log("time:", temp.albumDate)
        // console.log("-------------")

        homePageArr.album.push(temp)
      })

      // billboard1
      elements = document.querySelectorAll('#billboard .wrapper-scroll>.item-column')
      console.log(elements)
      elements.forEach((element, i) => {
        var temp = {
          itemNum: (element.querySelectorAll('.item-num')[0] && element.querySelectorAll('.item-num')[0].innerText) || '',
          itemImg: 'http:' + (element.querySelectorAll('.item-box>a>img')[0] && element.querySelectorAll('.item-box>a>img')[0].getAttribute("data-src")),
          itemLink: 'http://music.migu.cn' + (element.querySelectorAll('.item-info>.song-name>a')[0] && element.querySelectorAll('.item-info>.song-name>a')[0].getAttribute("href")),
          itemTitle: (element.querySelectorAll('.item-info>.song-name>a')[0] && element.querySelectorAll('.item-info>.song-name>a')[0].innerText) || '',
          itemSinger: (element.querySelectorAll('.item-info>.singer>a')[0] && element.querySelectorAll('.item-info>.singer>a')[0].innerText) || '',
          itemSingerLink: 'http://music.migu.cn' + (element.querySelectorAll('.item-info>.singer>a')[0] && element.querySelectorAll('.item-info>.singer>a')[0].getAttribute("href")),
          itemPlayCount: (element.querySelectorAll('.item-playCnt')[0] && element.querySelectorAll('.item-playCnt')[0].innerText) || '',
          type: 'bill1'
        }
        console.log("-------------")
        console.log("num:", temp.itemNum)
        console.log("img:", temp.itemImg)
        console.log("link:", temp.itemLink)
        console.log("title:", temp.itemTitle)
        console.log("singer:", temp.itemSinger)
        console.log("singerLink:", temp.itemSingerLink)
        console.log("count:", temp.itemPlayCount)
        console.log("-------------")

        homePageArr.billboard1.push(temp)
      })
      // // billboard2
      // elements = document.querySelectorAll('#billboard .thumb-2 .thumb-item>.thumb')
      // // console.log(elements)
      // elements.forEach((element, i) => {
      //   var temp = {
      //     itemNum: element.querySelectorAll('.item-num')[0] ? element.querySelectorAll('.item-num')[0].innerText : '',
      //     itemImg: 'http:' + element.querySelectorAll('.item-box>.item-box-img>a>img')[0].getAttribute("data-src"),
      //     itemLink: 'http://music.migu.cn' + element.querySelectorAll('.item-box>.item-box-img>a')[0].getAttribute("href"),
      //     itemTitle: element.querySelectorAll('.item-info>.song-name>a')[0] ? element.querySelectorAll('.item-info>.song-name>a')[0].innerText : '',
      //     itemSinger: element.querySelectorAll('.item-info>.singer>a')[0] ? element.querySelectorAll('.item-info>.singer>a')[0].innerText : '',
      //     itemSingerLink: 'http://music.migu.cn' + element.querySelectorAll('.item-info>.singer>a')[0].getAttribute("href"),
      //     itemPlayCount: element.querySelectorAll('.item-playCnt')[0] ? element.querySelectorAll('.item-playCnt')[0].innerText : '',
      //     type: 'bill2'
      //   }
      //   // console.log("-------------")
      //   // console.log(element)
      //   // console.log("num:", temp.itemNum)
      //   // console.log("img:", temp.itemImg)
      //   // console.log("link:", temp.itemLink)
      //   // console.log("title:", temp.itemTitle)
      //   // console.log("singer:", temp.itemSinger)
      //   // console.log("singerLink:", temp.itemSingerLink)
      //   // console.log("count:", temp.itemPlayCount)
      //   // console.log("-------------")

      //   homePageArr.billboard2.push(temp)
      // })
      // // billboard3
      // elements = document.querySelectorAll('#billboard .thumb-3 .thumb-item>.thumb')
      // // console.log(elements)
      // elements.forEach((element, i) => {
      //   var temp = {
      //     itemNum: element.querySelectorAll('.item-num')[0] ? element.querySelectorAll('.item-num')[0].innerText : '',
      //     itemImg: 'http:' + element.querySelectorAll('.item-box>.item-box-img>a>img')[0].getAttribute("data-src"),
      //     itemLink: 'http://music.migu.cn' + element.querySelectorAll('.item-box>.item-box-img>a')[0].getAttribute("href"),
      //     itemTitle: element.querySelectorAll('.item-info>.song-name>a')[0] ? element.querySelectorAll('.item-info>.song-name>a')[0].innerText : '',
      //     itemSinger: element.querySelectorAll('.item-info>.singer>a')[0] ? element.querySelectorAll('.item-info>.singer>a')[0].innerText : '',
      //     itemSingerLink: 'http://music.migu.cn' + element.querySelectorAll('.item-info>.singer>a')[0].getAttribute("href"),
      //     itemPlayCount: element.querySelectorAll('.item-playCnt')[0] ? element.querySelectorAll('.item-playCnt')[0].innerText : '',
      //     type: 'bill3'
      //   }
      //   // console.log("-------------")
      //   // console.log(element)
      //   // console.log("num:", temp.itemNum)
      //   // console.log("img:", temp.itemImg)
      //   // console.log("link:", temp.itemLink)
      //   // console.log("title:", temp.itemTitle)
      //   // console.log("singer:", temp.itemSinger)
      //   // console.log("singerLink:", temp.itemSingerLink)
      //   // console.log("count:", temp.itemPlayCount)
      //   // console.log("-------------")

      //   homePageArr.billboard3.push(temp)
      // })
      return homePageArr
    })
    browser.close()
    console.log(homePageArr)
    return homePageArr
  })().then(homePageArr => {
    if (!homePageArr) {
      return
    }
    if (homePageArr.songList !== [])
      pool.query('truncate migu_music_recommend_list;', (err, ret) => {
        if (err) {
          console.log("[DELETE ERROR] - ", err.message)
          return
        }
        homePageArr.songList.forEach((item, i) => {
          var insertSql = `INSERT INTO migu_music_recommend_list (musicListImg,musicListLink,musicListTitle,musicListPlayCount,type)
                VALUES ('` + item.musicListImg + `','` + item.musicListLink + `','` + item.musicListTitle + `','` + item.musicListPlayCount + `','recommend')
                `
          pool.query(insertSql, (err, ret) => {
            if (err) {
              console.log("[INSERT ERROR] - ", err.message)
              return
            }
            console.log(
              "--------------------------INSERT migu_music_recommend_list----------------------------"
            )
            console.log("INSERT URL:", item.musicListLink)
            console.log("INSERT Title:", item.musicListTitle)
            console.log(
              "-----------------------------------------------------------------\n\n"
            )
          })
        })
      })
    if (homePageArr.song !== [])
      pool.query('truncate migu_music_new_song;', (err, ret) => {
        if (err) {
          console.log("[DELETE ERROR] - ", err.message)
          return
        }
        homePageArr.song.forEach((item, i) => {
          var insertSql = `INSERT INTO migu_music_new_song (musicImg,musicLink,musicTitle,musicSinger,musicSingerLink,musicTime,type)
                VALUES ('` + item.musicImg + `','` + item.musicLink + `','` + item.musicTitle + `','` + item.musicSinger + `','` + item.musicSingerLink + `','` + item.musicTime + `','China')
                `
          pool.query(insertSql, (err, ret) => {
            if (err) {
              console.log("[INSERT ERROR] - ", err.message)
              return
            }
            console.log(
              "--------------------------INSERT migu_music_new_song----------------------------"
            )
            console.log("INSERT URL:", item.musicLink)
            console.log("INSERT Title:", item.musicTitle)
            console.log(
              "-----------------------------------------------------------------\n\n"
            )
          })
        })
      })
    if (homePageArr.album !== [])
      pool.query('truncate migu_music_new_album;', (err, ret) => {
        if (err) {
          console.log("[DELETE ERROR] - ", err.message)
          return
        }
        homePageArr.album.forEach((item, i) => {
          var insertSql = `INSERT INTO migu_music_new_album (albumImg,albumLink,albumTitle,albumSinger,albumSingerLink,albumDate)
                VALUES ('` + item.albumImg + `','` + item.albumLink + `','` + item.albumTitle + `','` + item.albumSinger + `','` + item.albumSingerLink + `','` + item.albumDate + `')
                `
          pool.query(insertSql, (err, ret) => {
            if (err) {
              console.log("[INSERT ERROR] - ", err.message)
              return
            }
            console.log(
              "--------------------------INSERT migu_music_new_album----------------------------"
            )
            console.log("INSERT URL:", item.albumLink)
            console.log("INSERT Title:", item.albumTitle)
            console.log(
              "-----------------------------------------------------------------\n\n"
            )
          })
        })
      })
    if (homePageArr.billboard1 !== [] || homePageArr.billboard2 !== [] || homePageArr.billboard3 !== [])
      pool.query('truncate migu_music_billboard;', (err, ret) => {
        if (err) {
          console.log("[DELETE ERROR] - ", err.message)
          return
        }
        homePageArr.billboard1.forEach((item, i) => {
          var insertSql = `INSERT INTO migu_music_billboard (itemNum,itemImg,itemLink,itemTitle,itemSinger,itemSingerLink,itemPlayCount,type)
                VALUES (` + item.itemNum + `,'` + item.itemImg + `','` + item.itemLink + `','` + item.itemTitle + `','` + item.itemSinger + `','` + item.itemSingerLink + `','` + item.itemPlayCount + `','` + item.type + `')
                `
          pool.query(insertSql, (err, ret) => {
            if (err) {
              console.log("[INSERT ERROR] - ", err.message)
              return
            }
            console.log(
              "--------------------------INSERT migu_music_billboard----------------------------"
            )
            console.log("INSERT URL:", item.itemLink)
            console.log("INSERT Title:", item.itemTitle)
            console.log(
              "-----------------------------------------------------------------\n\n"
            )
          })
        })
        homePageArr.billboard2.forEach((item, i) => {
          var insertSql = `INSERT INTO migu_music_billboard (itemNum,itemImg,itemLink,itemTitle,itemSinger,itemSingerLink,itemPlayCount,type)
                VALUES (` + item.itemNum + `,'` + item.itemImg + `','` + item.itemLink + `','` + item.itemTitle + `','` + item.itemSinger + `','` + item.itemSingerLink + `','` + item.itemPlayCount + `','` + item.type + `')
                `
          pool.query(insertSql, (err, ret) => {
            if (err) {
              console.log("[INSERT ERROR] - ", err.message)
              return
            }
            console.log(
              "--------------------------INSERT----------------------------"
            )
            console.log("INSERT URL:", item.itemLink)
            console.log("INSERT Title:", item.itemTitle)
            console.log(
              "-----------------------------------------------------------------\n\n"
            )
          })
        })
        homePageArr.billboard3.forEach((item, i) => {
          var insertSql = `INSERT INTO migu_music_billboard (itemNum,itemImg,itemLink,itemTitle,itemSinger,itemSingerLink,itemPlayCount,type)
                VALUES (` + item.itemNum + `,'` + item.itemImg + `','` + item.itemLink + `','` + item.itemTitle + `','` + item.itemSinger + `','` + item.itemSingerLink + `','` + item.itemPlayCount + `','` + item.type + `')
                `
          pool.query(insertSql, (err, ret) => {
            if (err) {
              console.log("[INSERT ERROR] - ", err.message)
              return
            }
            console.log(
              "--------------------------INSERT----------------------------"
            )
            console.log("INSERT URL:", item.itemLink)
            console.log("INSERT Title:", item.itemTitle)
            console.log(
              "-----------------------------------------------------------------\n\n"
            )
          })
        })
      })
  })
}