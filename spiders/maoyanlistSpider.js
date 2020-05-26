const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
//用来暂时保存解析到的内容和图片地址数据



module.exports = function (callback) {
  const url = encodeURI("https://maoyan.com/");
  //const url = "https://maoyan.com/films";


  let content = '';
  let imgs = [];
  let flag1 = false;
  let flag2 = false;
  let flag3 = false;
  let counter1 = 0;
  let counter2 = 0;


  function getMovies(url) {
    var rankingBoxArr = [];
    var mostExceptArr = [];
    var top100Arr = [];
    return new Promise((resolve, reject) => {
      console.log('begin');
      request(url, function (err, response, body) {
        console.log('request')
        if (err) {
          console.log(err);
        }
        if (!err && response.statusCode == 200) {
          const $ = cheerio.load(body);
          var item = $('.ranking-box-wrapper li');
          item.map(function (i, val) {
            var movieObj = {};

            movieObj.type = 'rankingBox';
            movieObj.rank = i + 1;
            //电影链接
            movieObj.movieLink = $(val).children('a').attr('href');
            //电影图片
            if (i == 0) {
              movieObj.moviePoster = $(val).find('.ranking-top-left').children('img').last().attr('data-src');
            } else {
              movieObj.moviePoster = null
            }
            //电影 名字
            if (i == 0) {
              movieObj.movieTitle = $(val).find('.ranking-top-moive-name').text();
            } else {
              movieObj.movieTitle = $(val).find('.ranking-movie-name').text();
            }
            //movieObj.movieTitle = $(val).find('.channel-detail movie-item-title').children('a').text();
            //电影评分
            // if (i == 0) {
            //     movieObj.movieDetail = $(val).find('.ranking-top-wish').text();
            // } else {
            //     movieObj.movieDetail = $(val).find('.ranking-num-info').text();
            // }

            //movieObj.movieDetail = $(val).find('.channel-detail channel-detail-orange').text();
            //把抓取到的内容 放到数组里面去
            rankingBoxArr.push(movieObj);

            console.log(i + ':');
            console.log('movieObj.type', movieObj.type);
            console.log('movieObj.movieLink', movieObj.movieLink);
            console.log('movieObj.moviePoster', movieObj.moviePoster);
            console.log('movieObj.movieTitle', movieObj.movieTitle);
            console.log('movieObj.movieDetail', movieObj.movieDetail);
          })
          var item2 = $('.most-expect-wrapper li');
          item2.map(function (i, val) {
            var movieObj = {};

            movieObj.type = 'rankingBox';
            movieObj.rank = i + 1;
            //电影链接
            movieObj.movieLink = $(val).children('a').attr('href');
            //电影图片
            if (i == 0) {
              movieObj.moviePoster = $(val).find('.ranking-top-left').children('img').last().attr('data-src');
            } else {
              movieObj.moviePoster = null
            }
            //电影 名字
            if (i == 0) {
              movieObj.movieTitle = $(val).find('.ranking-top-moive-name').text();
            } else {
              movieObj.movieTitle = $(val).find('.ranking-movie-name').text();
            }
            //movieObj.movieTitle = $(val).find('.channel-detail movie-item-title').children('a').text();
            //电影评分
            // if (i == 0) {
            //     movieObj.movieDetail = $(val).find('.ranking-top-wish').text();
            // } else {
            //     movieObj.movieDetail = $(val).find('.ranking-num-info').text();
            // }

            //movieObj.movieDetail = $(val).find('.channel-detail channel-detail-orange').text();
            //把抓取到的内容 放到数组里面去
            mostExceptArr.push(movieObj);

            console.log(i + ':');
            console.log('movieObj.type', movieObj.type);
            console.log('movieObj.movieLink', movieObj.movieLink);
            console.log('movieObj.moviePoster', movieObj.moviePoster);
            console.log('movieObj.movieTitle', movieObj.movieTitle);
            console.log('movieObj.movieDetail', movieObj.movieDetail);
          })
          var item3 = $('.top100-wrapper li');
          item3.map(function (i, val) {
            var movieObj = {};

            movieObj.type = 'rankingBox';
            movieObj.rank = i + 1;
            //电影链接
            movieObj.movieLink = $(val).children('a').attr('href');
            //电影图片
            if (i == 0) {
              movieObj.moviePoster = $(val).find('.ranking-top-left').children('img').last().attr('data-src');
            } else {
              movieObj.moviePoster = null
            }
            //电影 名字
            if (i == 0) {
              movieObj.movieTitle = $(val).find('.ranking-top-moive-name').text();
            } else {
              movieObj.movieTitle = $(val).find('.ranking-movie-name').text();
            }
            //movieObj.movieTitle = $(val).find('.channel-detail movie-item-title').children('a').text();
            //电影评分
            // if (i == 0) {
            //     movieObj.movieDetail = $(val).find('.ranking-top-wish').text();
            // } else {
            //     movieObj.movieDetail = $(val).find('.ranking-num-info').text();
            // }

            //movieObj.movieDetail = $(val).find('.channel-detail channel-detail-orange').text();
            //把抓取到的内容 放到数组里面去
            top100Arr.push(movieObj);

            console.log(i + ':');
            console.log('movieObj.type', movieObj.type);
            console.log('movieObj.movieLink', movieObj.movieLink);
            console.log('movieObj.moviePoster', movieObj.moviePoster);
            console.log('movieObj.movieTitle', movieObj.movieTitle);
            console.log('movieObj.movieDetail', movieObj.movieDetail);
          })
          // console.log(rankingBoxArr)
          // console.log(mostExceptArr)
          // console.log(top100Arr)
          //说明 数据获取完毕
          callback(false, rankingBoxArr, mostExceptArr, top100Arr)
          // resolve(rankingBoxArr, mostExceptArr, top100Arr);
          // if (rankingBoxArr.length > 0 && mostExceptArr.length > 0 && top100Arr > 0) {
          //     resolve(rankingBoxArr, mostExceptArr, top100Arr);
          // } else {
          //     // resolve(rankingBoxArr, mostExceptArr, top100Arr);
          //     reject('no movie')
          // }
        }
      })
    })
  }

  getMovies(url);
}