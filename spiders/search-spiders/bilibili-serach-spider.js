const puppeteer = require('puppeteer');

module.exports =

    async (searchContent) => {
        const bilibiliurl = encodeURI("https://search.bilibili.com/all?keyword=" + searchContent)
        var movieArr = [];
        const browser = await puppeteer.launch({
            // headless: false
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(bilibiliurl);
        // await page.waitFor(1000);
        var pageHeight = await page.evaluate(() => {
            return document.body.scrollHeight;
        })
        console.log("pageHeight:", pageHeight)
        for (var i = 500; i < pageHeight; i = i + 1000) {
            await page.evaluate((position) => {
                window.scrollTo(0, position)
                console.log(position)
            }, i)
            await page.waitFor(400);
        }
        movieArr = await page.evaluate(() => {
            let result = [];
            let elements = document.querySelectorAll('.bangumi-list>.bangumi-item');
            for (var element of elements) { // 循环
                var movieObj = {};
                //电影链接
                if (element.getElementsByClassName('left-img')[0]) {
                    movieObj.movieLink = element.getElementsByClassName('left-img')[0].href;
                }

                //电影图片
                if (element.getElementsByClassName('lazy-img')[0] && element.getElementsByClassName('lazy-img')[0].getElementsByTagName("img")[0]) {
                    movieObj.moviePoster = element.getElementsByClassName('lazy-img')[0].getElementsByTagName("img")[0].src;
                }

                //电影 名字
                if (element.getElementsByClassName('title')[0]) {
                    movieObj.movieTitle = element.getElementsByClassName('title')[0].innerText;
                }

                //电影评分
                console.log(element.getElementsByClassName('score-num')[0])
                if (element.getElementsByClassName('score-num')[0]) {
                    movieObj.movieScore = parseFloat(element.getElementsByClassName('score-num')[0].innerText);
                }
                //把抓取到的内容 放到数组里面去
                result.push(movieObj);
            }
            let elements2 = document.querySelectorAll('.pgc-list>.pgc-item');
            for (var element of elements2) { // 循环
                var movieObj = {};
                //电影链接
                if (element.getElementsByClassName('left-img')[0]) {
                    movieObj.movieLink = element.getElementsByClassName('left-img')[0].href;
                }

                //电影图片
                if (element.getElementsByClassName('lazy-img')[0] && element.getElementsByClassName('lazy-img')[0].getElementsByTagName("img")[0]) {
                    movieObj.moviePoster = element.getElementsByClassName('lazy-img')[0].getElementsByTagName("img")[0].src;
                }

                //电影 名字
                if (element.getElementsByClassName('title')[0]) {
                    movieObj.movieTitle = element.getElementsByClassName('title')[0].innerText;
                }

                //电影评分
                console.log(element.getElementsByClassName('score-num')[0])
                if (element.getElementsByClassName('score-num')[0]) {
                    movieObj.movieScore = parseFloat(element.getElementsByClassName('score-num')[0].innerText);
                }
                //把抓取到的内容 放到数组里面去
                result.push(movieObj);
            }

            return result;
        });
        // await page.waitFor(1000);
        browser.close();
        return movieArr;
    }