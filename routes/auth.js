const express = require('express');
const router = express.Router();
const passport = require('passport')
    , LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');
const session = require('express-session');
router.use(flash());
//app.use(bodyParser.json);
const bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser');
const connection = require('../config/db')();
const app = express();
app.set('view engine', 'jade');
app.set('views', './views');
router.use(bodyParser.urlencoded({ extended: false}));
// catch 404 and forward to error handler
router.use(cookieParser());

router.use(session({
    secret: 'atc54321',
    resave: false,
    saveUninitialized: true
}));
// 익스프레스 세션 암호화
router.use(passport.initialize());
router.use(passport.session());
// 미들웨어 설정


passport.use(new LocalStrategy({
    usernameField : 'username',
    passwordField : 'password'
}, function (username, password, done) {
    connection.query('SELECT * FROM mastertable WHERE `username`=?', [username], function (err, rows) {
        const user = rows[0];
        if(err) {
            return done(err);
        }
        if (!user) {
            return done(null, false, { message : '아이디가 다릅니다'});
        }
        if (user.password !== password) {
            return done(null, false, { message : '비밀번호가 다릅니다.'});
        }
        return done(null, user, {message : '로그인 성공!'});
    });
}));

passport.serializeUser(function (user, done) {
    done(null, user.username);
});
passport.deserializeUser(function (username, done) {
    // DB에서 ID를 이용하여 User를 얻어 Done 호출
    connection.query('SELECT * FROM mastertable WHERE `username`=?', [username], function (err, rows) {
        const user = rows[0];
        done(err, user);
    });
});

router.post(['/login', '/auth/login'], passport.authenticate('local',{
    successRedirect: '/master_main',
    failureRedirect: '/login',
    failureFlash: true
}));
router.get('/login', function (req, res) {
    console.log(req.flash('error'));
    if (req.user) {
        res.render('./session_login/session_main');
    } else {
        res.render('./session_login/login');
    }
});

router.get('/logout', (req, res) => {
    delete req.session.user_uid;
    res.redirect('/main');
});
router.get(['./master_main', '../master_main', '/auth/master_main'], function (req, res) {
    if (req.user) {
        res.render('./session_login/session_main')
    } else {
        res.send('<script type="text/javascript">alert("올바르지 않은 사용자 입니다 사용자의 정보를 서버로 전송합니다.");</script>');
    }
});

router.get(['./master_main/master_study', '/master_main/master_study/:No'], function (req, res) {
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

router.get('./master_main/master_study/add', function (req, res) {
    const sql = 'SELECT Name, Title, Content FROM board01';
    connection.query(sql, function (err, board01, fields) {
        if (err) {
            console.log(err);
            res.status(500).send('서버 오류!');
        }
        res.render('./study/study_add', {boards: board01});
    });
});

router.post('./master_main/master_study/add', function (req, res) {
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
module.exports = router;
return router;