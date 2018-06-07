var express = require('express');
var router = express.Router();

$.ajax({
    type: 'POST',
    data: {'name': name,
        'mail_id' : mail_id,
        'mail_addr' : mail_addr,
        'mail_addr_input' : mail_addr_input},
    url: '/main/study',
    success: function (result) {
        if (result.length === 0) {
            alert('정보가 없습니다.')
        }
        else {
            if(result.check === 0){
                alert(result.message);
                window.location.href = '/';
            }else{
                alert(result.message);
            }
        }
    }
});