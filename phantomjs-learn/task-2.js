var page = require('webpage').create();
var system = require('system');
var fs = require('fs');
var url = 'https://baidu.com/s?wd=';
var cdn = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js';
var result = {}, 
  startTime;

if(system.args.length < 3) {

    console.log('Usage: task-2.js <keyword> <device>')
    phantom.exit();

} 

var device = system.args[2];
var config = JSON.parse(fs.read('ua.json'));

if(config[device]) {
    page.viewportSize = {
        'width': config[device]['width'],
        'height': config[device]['height']
    };
    page.settings.userAgent = config[device]['ua'];
} else {
    console.log(device + ' is not found in ua.json file');
    phantom.exit();
}

url = url + encodeURIComponent(system.args[1]);
startTime = Date.now();

page.open(url, function(status) {
    page.render('baidu_s.jpeg', {format: 'jpeg', quality: '100'});
    if(status !== 'success') {

        result = {
            'msg': '抓取失败',
            'code': 0,
            'time': Date.now() - startTime,
            'keyword': system.args[1],
            'device': config[device],
            'dataList': []
        }

        console.dir(result);

    } else {
        
        page.includeJs(cdn, function() {

            var dataList = page.evaluate(function() {
                var dataList = [];
                $('.result').each(function() {
                    var item = {},
                      $this = $(this);

                    item.title = $this.find('h3 a').text();
                    item.link = $this.find('h3 a').attr('href');
                    item.info = $this.find('.c-abstract').text();
                    item.pic = $this.find('.c-img').attr('src');
                    dataList.push(item);
                    
                });
                return dataList;
            })
            result = {
                'code': 1,
                'msg': '抓取成功',
                'keyword': system.args[1],
                'time': Date.now() - startTime,
                'device': config[device],
                'dataList': dataList
            };
            console.log(JSON.stringify(result));
            phantom.exit();
        })
        
    }
    
})
