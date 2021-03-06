const path = require('path');
const ueditor = require("ueditor");
const ueditor_options = ueditorQiniuConfigService.options;
const randomstring = require("randomstring");
const moment = require('moment');

module.exports = {

  publish: function (req, res) {
    Keyword.find().exec(function (err, records) {
      if (err) {
        console.log(err);
        return res.send(err);
      }
      return res.view('publisher/publish', {
        keywords: records
      });
    });

  },

  getQiniu: function (req, res, next) {
    // return res.send('???');
    var params = req.query;

    var action = params['action'];
    if (action == 'config') {
      res.send(ueditor_options.ueditorConfig);
    }
    else if (action == 'listimage' || action == 'listfile') {
      var start = parseInt(params['start'] || 0);
      var size = parseInt(params['size'] || 10);

      var storeParams = {
        prefix: action == 'listimage' ? 'image/' : 'file/',
        start: start,
        limit: size
      };

      qiniuStoreService.listQiniu(storeParams, function (err, ret) {
        return res.send(ret);
        // return next();
      });

    } else {
      return res.send();
    }

    // return next();
  },

  postQiniu: function (req, res, next) {
    var params = req.query;

    var action = params['action'];

    var key = '/' + moment().format('YYYYMMDD') + '/' + (+new Date()) + randomstring.generate(6);

    switch (action) {
      case 'uploadvideo':
        key = 'video' + key;
        break;
      case 'uploadfile':
        key = 'file' + key;
        break;
      default:
        key = 'image' + key;
        break;
    }

    var storeParams = {};

    if (action == 'uploadimage' || action == 'uploadvideo' || action == 'uploadfile') {
      req.file('upfile').upload({dirname: require('path').resolve(sails.config.appPath, 'assets/images/temp')}, function (err, uploadedFiles) {
        if (err) return res.send(err);
        // console.log(uploadedFiles[0]);
        if (action == 'uploadfile') {
          key += '/' + uploadedFiles[0].filename;
        }
        storeParams = {
          key: key,
          filePath: uploadedFiles[0].fd,
          fileName: uploadedFiles[0].filename
        };
        qiniuStoreService.fileToQiniu(storeParams, function (err, ret) {
          return res.send(ret);
          // return next();
        });
      });
    }
    else if (action == 'uploadscrawl') {
      console.log('action=uploadscrawl');
      //这里不能用
      var data = params['upfile'];
      if (!data) {
        return res.send();
        // return next();
      }

      console.log("have file");
      storeParams = {
        key: key,
        data: new Buffer(data, 'base64')
      };

      qiniuStoreService.dataToQiniu(storeParams, function (err, ret) {
        console.log("data uploaded");
        console.log(ret);
        return res.send(ret);
        // return next();
      })
    }
  },

  ueditor: ueditor('/home/zhang/Desktop/funnyard-on-sails/funnyard/assets', function (req, res, next) {

    // console.log(req.param("action"));
    // ueditor 客户发起上传图片请求
    if (req.param("action") === 'uploadimage') {

      // 这里你可以获得上传图片的信息
      var foo = req.ueditor;
      console.log(foo.filename); // exp.png
      console.log(foo.encoding); // 7bit
      console.log(foo.mimetype); // image/png

      // 下面填写你要把图片保存到的路径 （ 以 path.join(__dirname, 'public') 作为根路径）
      var img_url = '/images';
      res.ue_up(img_url); //你只要输入要保存的地址 。保存操作交给ueditor来做
    }

    //  客户端发起图片列表请求
    else if (req.param("action") === 'listimage') {
      var dir_url = '/images'; // 要展示给客户端的文件夹路径
      res.ue_list(dir_url); // 客户端会列出 dir_url 目录下的所有图片
    }

    // 客户端发起其它请求
    else {
      res.setHeader('Content-Type', 'application/json');

      // 这里填写 ueditor.config.json 这个文件的路径
      res.redirect('/ueditor/nodejs/config.json')
    }
  })
};
