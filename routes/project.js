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
        const sql = 'SELECT * FROM board01';
        connection.query(sql, function (err, boards, fields) {
            const No = req.params.No;
            if (No) {
                const sql = 'SELECT * FROM board01 WHERE No=?';
                connection.query(sql, [No], function (err, board01, fields) {
                    if (err) {
                        console.log(err);
                        res.status(500).send('Internal Server Error');
                    } else {
                        res.render('./project/project', {boards: boards, board01: board01[0]});
                    }
                });
            } else {
                res.render('./project/project', {boards: boards});
            }
        });
    });
route.get(['/project/read/:No', '/project/:No'],function (req,res,next) {
    const sql = 'SELECT * FROM board01';
    connection.query(sql, function (err, boards, fields) {
        const No = req.params.No;
        if (No) {
            const sql = 'SELECT * FROM board01 WHERE No=?';
            connection.query(sql, [No], function (err, board01, fields) {
                if (err) {
                    console.log(err);
                    res.status(500).send('Internal Server Error');
                } else {
                    res.render('./project/project_read', {boards: boards, board01: board01[0]});
                }
            });
        } else {
            res.render('./project/project', {boards: boards});
        }
    });
});
route.get('/project/add', function(req, res) {
    const sql = 'SELECT Title, Content FROM board01';
    connection.query(sql, function (err, board01, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
        }
        res.render('./project/project_add', {boards: board01});
    });
});
route.post('/project/add', function (req, res) {
    var Title = req.body.Title;
    var Content = req.body.Content;
    var sql = 'INSERT INTO board01 (Title, Content) VALUES(?, ?)';
    connection.query(sql, [Title, Content], function (err, board01, fields) {
        if(err) {
            console.log(err);
            res.status(500).send('Server Error');
        } else {
            res.redirect('./main/project/read'+board01.InsertId);
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
    const sql = 'SELECT * FROM board01';
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
    const sql = 'SELECT * FROM board01';
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