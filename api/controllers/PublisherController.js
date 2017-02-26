/**
 * PublisherController
 *
 * @description :: Server-side logic for managing Publishers
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const path = require('path');
const ueditor = require("ueditor");

module.exports = {
  publish: function (req, res) {
    return res.view('publisher/publish');
  },
  ueditor: ueditor('/home/zhang/Desktop/funnyard-on-sails/funnyard/assets', function (req, res, next) {

    console.log(req.param("action"));
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

