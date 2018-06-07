const route = require('express').Router();
const connection = require('../config/db')();
route.get(['/main', '/'], function (req, res) {
    console.log("왜!");
    res.render('main.jade');
});
route.get('/main/profile', function (req, res) {
    res.render('./profile/profile');
});

    route.get(['/main/project', '/project'], function (req, res) {
        const sql = 'SELECT * FROM board02';
        connection.query(sql, function (err, boards, fields) {
            const no = req.params.no;
            if (no) {
                const sql = 'SELECT * FROM board02 WHERE no=?';
                connection.query(sql, [no], function (err, board02, fields) {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.render('./project/project', {boards: boards, board01: board02[0]});
                    }
                });
            } else {
                res.render('./project/project', {boards: boards});
            }
        });
    });
    route.get(['/project/read/:no', '/project/:no'],function (req,res,next) {
        const no = req.params.no;
        console.log("no : "+no);

        connection.beginTransaction(function(err){
            if(err) console.log(err);
            connection.query('update board02 set hit=hit+1 where no=?', [no], function (err) {
                if(err) {
                    /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백함.*/
                    console.log(err);
                    connection.rollback(function () {
                        console.error('rollback error1');
                    })
                }
                connection.query('select * from board02 where no=?',[no],function(err,rows)
                {
                    if(err) {
                        /* 이 쿼리문에서 에러가 발생했을때는 쿼리문의 수행을 취소하고 롤백합니다.*/
                        console.log(err);
                        connection.rollback(function () {
                            console.error('rollback error2');
                        })
                    }
                    else {
                        connection.commit(function (err) {
                            if(err) console.log(err);
                            console.log("row : " + rows);
                            res.render('./project/project_read',{title:rows[0].title , rows : rows});
                        })
                    }
                })
            })
        })
    });
    route.get('/project/add', function(req, res) {
        const sql = 'SELECT title, content FROM board02';
        connection.query(sql, function (err, board02, fields) {
            if (err) {
                console.log(err);
                res.status(500).send('Internal Server Error');
            }
            res.render('./project/project_add', {boards: board02});
        });
    });
    route.post('/project/add', function (req, res) {
        var title = req.body.title;
        var content = req.body.content;
        var sql = 'INSERT INTO board02 (title, content) VALUES(?, ?)';
        connection.query(sql, [title, content], function (err, board02, fields) {
            if(err) {
                console.log(err);
                res.status(500).send('Server Error');
            } else {
                res.redirect('./main/project/read'+board02.InsertId);
            }
        })
    });
route.get(['./master_main', '../master_main', '/auth/master_main'], function (req, res) {
    if (req.user) {
        res.render('./session_login/session_main')
    } else {
        res.send('<script type="text/javascript">alert("올바르지 않은 사용자 입니다 사용자의 정보를 서버로 전송합니다.");</script>');
    }
});

route.get(['./master_main/master_study', '/master_main/master_study/:No'], function (req, res) {
    const sql = 'SELECT No, Title, Content FROM board01';
    connection.query(sql, function (err, boards, fields) {
        const No = req.params.No;
        if (No) {
            const sql = 'SELECT * FROM board01 WHERE No=?';
            connection.query(sql, [No], function (err, board01, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('./session_login/session_study', {boards: boards, board01: board01[0]});
                }
            });
        } else {
            res.render('./session_login/session_study', {boards: boards});
        }
    });
});

route.get('./master_main/master_study/add', function (req, res) {
    const sql = 'SELECT Name, Title, Content FROM board01';
    connection.query(sql, function (err, board01, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('서버 오류!');
        }
        res.render('./study/study_add', {boards: board01});
    });
});

route.post('./master_main/master_study/add', function (req, res) {
    const Title = req.body.Title;
    const Content = req.body.Content;
    const Name = req.body.Name;
    const sql = 'INSERT INTO board01 (Title, Content, Reddate, Name) VALUES(?, ?, now(), ?)';
    connection.query(sql, [Title, Content, Name], function (err, result, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        } else {
            res.redirect('/master_main/master_study/' + result.InsertId);
        }
    })
});
route.get(['/main/study', '/study/:No', '/study'], function (req, res) {
    const sql = 'SELECT No, Title, Content FROM board01';
    connection.query(sql, function (err, boards, fields) {
        const No = req.params.No;
        if (No) {
            const sql = 'SELECT * FROM board01 WHERE No=?';
            connection.query(sql, [No], function (err, board01, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('./study/study', {boards: boards, board01: board01[0]});
                }
            });
        } else {
            res.render('./study/study', {boards: boards});
        }
    });
});

module.exports = route;
return route;