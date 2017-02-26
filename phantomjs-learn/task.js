var page = require('webpage').create();
var system = require('system');
var url = 'https://baidu.com/s?wd=';
var cdn = 'https://cdnjs.cloudflare.com/ajax/libs/jquery/3.1.1/jquery.min.js';
var result = {}, 
  t;

if(system.args.length === 1) {

    console.log('please enter a keyword!')
    phantom.exit();

} 

result.keyword = system.args[1];
url = url + encodeURIComponent(result.keyword);
t = Date.now();

page.open(url, function(status) {
    
    if(status !== 'success') {

        result.msg = '抓取失败';
        result.code = 0;
        result.time = Date.now() - t;

        console.log(result);

    } else {
        
        result.time = Date.now() - t;
        result.msg = '抓取成功';
        result.code = 1;
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
            result.dataList = dataList;
            console.log(JSON.stringify(result));
            phantom.exit();
        })
        
    }
    
})
