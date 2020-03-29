var maoyanSpider = require("./spiders/maoyanSpider");
var maoyanlistSpider = require("./spiders/maoyanlistSpider");
var miguMusicSpider = require("./spiders/miguSpider")
var pool = require("./db.js");

module.exports = () => {
  console.log("start");
  update();
}

/*var timmer = setInterval(() => {
  console.log("周期性定时器");
  circle();
}, 5000 * 60 * 60);*/

function update() {

  // maoyan autospider
  maoyanSpider(
    function () {
      console.log("write file end");
    },
    data => {
      // console.log(data);
      console.log("----------------save to database");
      data.forEach((movie, index) => {
        imgUrl = movie.moviePoster;
        var pos = imgUrl.indexOf("@");
        var imgUrlresult = imgUrl.substring(0, pos);
        var imgName = imgUrlresult.split("/").pop();

        console.log("movieTitle", movie.movieTitle);
        console.log("moviePoster", movie.moviePoster);
        console.log("piclocal", imgName);
        console.log("movieDetail", movie.movieDetail);
        console.log("spidermark", {
          maoyan: movie.movieLink.slice(7)
        });
        var addSql = '';
        addSql =
          `INSERT INTO movies (moviesname,moviespicurl,moviespiclocal,moviesdetail,spidermark,defaultlink) 
              SELECT '` +
          movie.movieTitle +
          `','` +
          movie.moviePoster +
          `','` +
          imgName +
          `','` +
          movie.movieDetail +
          `','` +
          JSON.stringify({
            maoyan: movie.movieLink.slice(7)
          }) +
          `','` + "https://maoyan.com" + movie.movieLink + `'
              FROM dual
              WHERE NOT EXISTS(SELECT * FROM movies WHERE spidermark->'$.maoyan'='` +
          movie.movieLink.slice(7) +
          `')
              ;`;

        console.log(addSql);
        var addSqlParams = [
          movie.movieTitle,
          movie.moviePoster,
          imgName,
          movie.movieDetail,
          JSON.stringify({
            maoyan: movie.movieLink.slice(7)
          })
        ];
        pool.query(addSql, function (err, result) {
          if (err) {
            console.log("[INSERT ERROR] - ", err.message);
            return;
          }

          console.log(
            "--------------------------INSERT----------------------------"
          );
          //console.log('INSERT ID:',result.insertId);
          console.log("INSERT ID:", result.insertId);
          console.log(
            "-----------------------------------------------------------------\n\n"
          );
          if (result.insertId == 0) {
            var selectMovieId =
              `SELECT * FROM movies WHERE spidermark->'$.maoyan'='` +
              movie.movieLink.slice(7) +
              `'`;
            pool.query(selectMovieId, (err, result) => {
              if (err) {
                console.log("[INSERT ERROR] - ", err.message);
                return;
              }

              console.log(
                "--------------------------SELECT----------------------------"
              );
              //console.log('INSERT ID:',result.insertId);
              var findMovieId = result[0].idmovies;
              console.log(findMovieId);
              console.log(
                "-----------------------------------------------------------------\n\n"
              );
              var addLinkSql = "";
              if (!parseFloat(movie.movieDetail)) {
                addLinkSql =
                  `INSERT INTO moviesources (idmovies,sourceurl,sourceowner,scorefromsource) 
                      VALUES ('` +
                  findMovieId +
                  `','` +
                  "https://maoyan.com" +
                  movie.movieLink +
                  `','maoyan',` +
                  -1 +
                  `)`;
              } else {
                addLinkSql =
                  `INSERT INTO moviesources (idmovies,sourceurl,sourceowner,scorefromsource) 
                      VALUES ('` +
                  findMovieId +
                  `','` +
                  "https://maoyan.com" +
                  movie.movieLink +
                  `','maoyan',` +
                  parseFloat(movie.movieDetail) +
                  `)`;
              }
              pool.query(addLinkSql, addLinkSql, (err, result) => {
                if (err) {
                  console.log("[INSERT ERROR] - ", err.message);
                  return;
                }
                console.log(
                  "--------------------------INSERT----------------------------"
                );
                console.log(
                  "INSERT URL:",
                  "https://maoyan.com" + movie.movieLink
                );
                console.log(
                  "-----------------------------------------------------------------\n\n"
                );
              });
            });
          } else {
            var addLinkSql = "";
            if (!parseFloat(movie.movieDetail)) {
              addLinkSql =
                `INSERT INTO moviesources (idmovies,sourceurl,sourceowner,scorefromsource) 
                      VALUES ('` +
                result.insertId +
                `','` +
                "https://maoyan.com" +
                movie.movieLink +
                `','maoyan',` +
                -1 +
                `)`;
            } else {
              addLinkSql =
                `INSERT INTO moviesources (idmovies,sourceurl,sourceowner,scorefromsource) 
                      VALUES ('` +
                result.insertId +
                `','` +
                "https://maoyan.com" +
                movie.movieLink +
                `','maoyan',` +
                parseFloat(movie.movieDetail) +
                `)`;
            }
            pool.query(addLinkSql, addLinkSql, (err, result) => {
              if (err) {
                console.log("[INSERT ERROR] - ", err.message);
                return;
              }
              console.log(
                "--------------------------INSERT----------------------------"
              );
              console.log("INSERT URL:", "https://maoyan.com" + movie.movieLink);
              console.log(
                "-----------------------------------------------------------------\n\n"
              );
            });
          }
        });
      });
    }
  );

  // maoyanlist autospider
  maoyanlistSpider((err, rankingBoxArr, mostExceptArr, top100Arr) => {
    if (err) {
      console.log(err);
      return;
    }
    console.log(rankingBoxArr)
    console.log(mostExceptArr)
    console.log(top100Arr)
    pool.query('truncate multimediasharing.moviesrankinglist;', (err, ret) => {
      if (err) {
        console.log("[DELETE ERROR] - ", err.message);
        return;
      }
      rankingBoxArr.forEach((movie, index) => {
        var selectListSql = `
        INSERT INTO moviesrankinglist (moviestype,moviesname,moviespicurl,movieslink,moviesrank)
        VALUES ('rankingBox','` + movie.movieTitle + `','` + movie.moviePoster + `','` + `https://maoyan.com` + movie.movieLink + `',` + movie.rank + `)
        `
        pool.query(selectListSql, (err, ret) => {
          if (err) {
            console.log("[INSERT ERROR] - ", err.message);
            return;
          }
          console.log(
            "--------------------------INSERT----------------------------"
          );
          console.log("INSERT URL:", "https://maoyan.com" + movie.movieLink);
          console.log("INSERT Title:", movie.movieTitle);
          console.log(
            "-----------------------------------------------------------------\n\n"
          );
        })
      })
      mostExceptArr.forEach((movie, index) => {
        var selectListSql = `
        INSERT INTO moviesrankinglist (moviestype,moviesname,moviespicurl,movieslink,moviesrank)
        VALUES ('mostExcept','` + movie.movieTitle + `','` + movie.moviePoster + `','` + `https://maoyan.com` + movie.movieLink + `',` + movie.rank + `)
        `
        pool.query(selectListSql, (err, ret) => {
          if (err) {
            console.log("[INSERT ERROR] - ", err.message);
            return;
          }
          console.log(
            "--------------------------INSERT----------------------------"
          );
          console.log("INSERT URL:", "https://maoyan.com" + movie.movieLink);
          console.log("INSERT Title:", movie.movieTitle);
          console.log(
            "-----------------------------------------------------------------\n\n"
          );
        })
      })
      top100Arr.forEach((movie, index) => {
        var selectListSql = `
        INSERT INTO moviesrankinglist (moviestype,moviesname,moviespicurl,movieslink,moviesrank)
        VALUES ('top100','` + movie.movieTitle + `','` + movie.moviePoster + `','` + `https://maoyan.com` + movie.movieLink + `',` + movie.rank + `)
        `
        pool.query(selectListSql, (err, ret) => {
          if (err) {
            console.log("[INSERT ERROR] - ", err.message);
            return;
          }
          console.log(
            "--------------------------INSERT----------------------------"
          );
          console.log("INSERT URL:", "https://maoyan.com" + movie.movieLink);
          console.log("INSERT Title:", movie.movieTitle);
          console.log(
            "-----------------------------------------------------------------\n\n"
          );
        })
      })
    })
  })

  miguMusicSpider();
}