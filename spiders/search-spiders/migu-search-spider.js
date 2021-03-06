const puppeteer = require('puppeteer')

var func = async function (searchContent) {
  const url = encodeURI("http://music.migu.cn/v3")
  var musicArr = []
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
    // headless: false
  })
  const page = await browser.newPage()
  await page.goto(url)

  console.log(searchContent)
  await page.waitForSelector('.btn-search')
  await page.hover('.btn-search')
  await page.waitForSelector('#search_ipt')
  await page.click('#search_ipt')
  await page.type('#search_ipt', searchContent)
  const link = await page.$('.btn-search')
  const newPagePromise = new Promise(x => browser.once('targetcreated', target => x(target.page()))) // 声明变量
  await link.click() // 点击跳转
  const newPage = await newPagePromise // newPage就是a链接打开窗口的Page对象
  await page.waitFor(1000)
  musicArr = await newPage.evaluate(() => {
    let result = []
    let elements = document.querySelectorAll('.J_CopySong')
    // console.log(elements)
    // console.log(elements.length)
    var i = 0
    for (var element of elements) { // 循环
      i++
      console.log(i)
      var musicObj = {}

      //音乐 名字
      musicObj.musicTitle = element.querySelectorAll('a[class*="song-name-txt"]')[0] && element.querySelectorAll('a[class*="song-name-txt"]')[0].getAttribute('title')
      //音乐链接
      musicObj.musicLink = 'http://music.migu.cn' + element.querySelectorAll('a[class*="song-name-txt"]')[0].getAttribute('href')
      //音乐歌手
      musicObj.singer = element.querySelectorAll('.song-singers>a')[0] && element.querySelectorAll('.song-singers>a')[0].innerText
      //音乐歌手链接
      musicObj.singerLink = 'http://music.migu.cn' + element.querySelectorAll('.song-singers>a')[0].getAttribute('href')
      // 专辑
      musicObj.album = element.querySelectorAll('.song-belongs>a')[0] && element.querySelectorAll('.song-belongs>a')[0].innerText
      // 专辑链接
      musicObj.albumLink = 'http://music.migu.cn/v3/music/album/' + element.querySelectorAll('.song-belongs>a')[0].getAttribute('data-id')
      // console.log(musicObj)
      result.push(musicObj)
    }

    return result
  })
  browser.close()
  // console.log(musicArr)
  return musicArr
}
module.exports = func