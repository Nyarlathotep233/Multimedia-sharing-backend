const request = require('request');
const cheerio = require('cheerio');
//用来暂时保存解析到的内容和图片地址数据



module.exports = async function (searchContent) {

    function getMovies(searchContent) {
        const maoyanurl = encodeURI("https://maoyan.com/query?kw=" + searchContent);

        var movieArr = [];

        var i = 0;
        return new Promise((resolve, reject) => {
            console.log('begin');

            // 猫眼的搜索结果
            request(maoyanurl, function (err, response, body) {
                console.log('request')
                if (err) {
                    console.log(err);
                }
                if (!err && response.statusCode == 200) {
                    const $ = cheerio.load(body);
                    var item = $('.movie-list dd');
                    item.map(function (i, val) {

                        var movieObj = {};
                        //电影链接
                        movieObj.movieLink = 'https://maoyan.com' + $(val).find('.movie-item').children('a').attr('href');
                        //电影图片
                        movieObj.moviePoster = $(val).find('.movie-poster').children('img').last().attr('data-src');
                        //电影 名字
                        movieObj.movieTitle = $(val).find('.movie-item-title').text();
                        //movieObj.movieTitle = $(val).find('.channel-detail movie-item-title').children('a').text();
                        //电影评分
                        movieObj.movieScore = parseFloat($(val).find('.absolute-info .channel-detail-orange').text());
                        //movieObj.movieDetail = $(val).find('.channel-detail channel-detail-orange').text();
                        //把抓取到的内容 放到数组里面去
                        movieArr.push(movieObj);

                        i++;
                        // console.log(i);
                        // console.log('movieObj.movieTitle:' + movieObj.movieTitle);

                    })

                    //说明 数据获取完毕
                    if (movieArr.length > 0) {
                        console.log('im here')
                        resolve(movieArr, false)
                        // return Promise.resolve(movieArr, false)
                    } else {
                        // return Promise.resolve('', 'no movie')
                        reject('', 'no movie')
                    }

                }
            })

        })
    }
    var data;
    var err;
    await getMovies(searchContent).then((movieArr, errMessage) => {
        data = movieArr;
        err = errMessage;
    }).catch((movieArr, errMessage) => {
        data = movieArr;
        err = errMessage;
    })
    return Promise.resolve(data, err)
}