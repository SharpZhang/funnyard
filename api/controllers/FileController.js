const qiniu = require("qiniu");
const path = require('path');
const randomize = require('randomatic');

//需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = '31ULV4j3DA9p76IcvH3ZC3PrIgqXIh3EX8VMpvmD';
qiniu.conf.SECRET_KEY = 'n_aGzUV1G3XdCXLc2abMD62IKS9ZDvKf7fFr_Mtt';
//要上传的空间
bucket = 'funnyard';
//上传到七牛后保存的文件名
key = randomize('*', 3) + '.png';

//构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
function uptoken(bucket, key) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket+":"+key);
  // putPolicy.callbackUrl = 'http://your.domain.com/callback';
  // putPolicy.callbackBody = 'filename=$(fname)&filesize=$(fsize)';
  return putPolicy.token();
}

//生成上传 Token
token = uptoken(bucket, key);

//要上传文件的本地路径
filedir = path.resolve(sails.config.appPath, 'assets/images/temp');
// filePath = './nodejs-logo.png';

//构造上传函数
function uploadFile(uptoken, key, localFile, callback) {
  var extra = new qiniu.io.PutExtra();
  qiniu.io.putFile(uptoken, key, localFile, extra, callback);
}

module.exports = {
  default: function (req, res) {
    req.file('icon').upload({dirname: filedir, saveAs: key}, function (err, uploadedFiles) {
      console.log(uploadedFiles[0].filename);
      // return res.send("see..");
      //调用uploadFile上传
      uploadFile(token, key, path.join(filedir, key), function (err, ret) {
        if(!err) {
          // 上传成功， 处理返回值
          console.log(ret.hash, ret.key, ret.persistentId);
          return res.send("上传成功");
        } else {
          // 上传失败， 处理返回代码
          console.log(err);
          return res.send("上传失败");
        }
      });
    });
  }
};