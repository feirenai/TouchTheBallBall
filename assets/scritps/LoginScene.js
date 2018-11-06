// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var gameData = require("./config/gameData");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        //判断是否是微信的标识
        if(gameData.wx)
        {
            this.updateManager();
        }
     },

    //新版本的判断(保证用户使用微信最新的版本) 
    updateManager(){
        var self = this;
        if(typeof wx.getUpdateManager === 'function'){
            const updateManager = wx.getUpdateManager();
            updateManager.onCheckForUpdate(function(res){
                //请求版本信息的回调
                //有新版本更新游戏
                if(res.hasUpdate){
                    wx.showModal({
                        title: '更新提示',
                        content: '有新版本正在下载中',
                    });
                }else{
                    //如果没有新版本  直接进行游戏
                    self.login();
                }
            });

            //新版本下载成功
            updateManager.onUpdateReady(function(){
                wx.showModal({
                    title: '更新提示',
                    content: '新版本已经准备好了，是否重启应用?',
                    showCancel: false,
                    success: function(res){
                        if(res.confirm){
                            //新的版本已经下载好了，
                            //调用applayUpdate 应用新版本并重启
                            updateManager.applayUpdate();
                            //更新成功进入游戏
                            self.login();
                        }
                    }
                });
            });

            //更新版本失败
            updateManager.onUpdateFailed(function(){
                wx.showModal({
                    title: '更新提示',
                    content: '新版本下载失败,请删除图标重新搜索',
                    showCancel: false,
                    success: function(res){
                        if(res.confirm){
                            //应用更新失败退出游戏
                            wx.exitMiniProgram();
                        }
                    }
                });
            });
        }else{
            wx.showModel({
                title: '更新提示',
                content: '为了游戏正常运行，建议您先升级微信最新版本',
                showCancel: false,
                success: function(res){
                    if(res.confirm){
                        //微信版本过低退出游戏
                        wx.exitMiniProgram();
                    }
                }
            });
        }
    },

    login(){
        var self = this;
        //判断用户登录状态是否有效
        wx.checkSession({
            success: function(){
                //直接进入小游戏
                self.init();
            },
            fail: function(){
                //调用登录授权
                self.wxGetUserRights();
            },
        });
    },

    start () {
        
    },

    //获取微信用户信息的权限
    wxGetUserRights:function(){
        var _self = this;
        var winSize = cc.director.getWinSize();
        if(typeof wx.createUserInfoButton === 'function'){
            var button = wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: 0,
                    top: 0,
                    width: winSize.width,
                    height: winSize.height,
                    lineHeight: 0,
                    backgroundColor: '',
                    color: '#ffffff',
                    textAlign: 'center',
                    fontSize: 16,
                    borderRadius: 4
                }
            });

            //点击授权按钮
            button.onTap(function(res){
                
                //ios 和 android 对于拒绝授权的回调 errMsg 没有统一处理
                if(res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1){
                    //处理用户拒绝授权的情况
                    self.getWxSetting();
                }else{
                    //保存用户信息
                    wx.setStorageSync('userInfo',res.userInfo);
                    //将用户数据保存在本地中
                    _self.changeScene(res.userInfo);
                    //隐藏登录按钮
                    button.hide();
                    //直接进入游戏
                }
            });
        }else{
            wx.getUserInfo({
                fail: function (res) {
                    // iOS 和 Android 对于拒绝授权的回调 errMsg 没有统一，需要做一下兼容处理
                    if (res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1) {
                        // 处理用户拒绝授权的情况
                        self.getWxSetting();
                    } else {
                        //直接进入游戏
                        _self.changeScene(res.userInfo);
                    }
                }
            });
        }
    },

    //获取用户授权设置
    getWxSetting(){
        var self = this;
        wx.getSetting({
            success: function(res){
                var authSetting = res.authSettin;
                if(authSetting['scope.userInfo'] === true){
                    //用户已经授权，直接调用相关api
                    //直接进入游戏
                    self.init();
                }else if(authSetting['scope.userInfo'] === false)
                {
                    //如果用户拒绝授权，在调用相关api  wx.authorize会失败 需要引导用户到设置面板打开授权
                    //打开用户设置界面
                    wx.openSetting({
                        success:(res)=>{}
                    });
                }else{
                    //未询问过用户授权，调用相关api  wx.authorize 会弹出询问用户
                    if(typeof wx.authorize === 'function'){
                        //向用户发起授权请求,如果用户之前已经同意授权，则不会弹窗，直接返回成成
                        //支持版本 >= 1.2.0
                        wx.authorize({
                            scope: 'scope.record',
                            fail: function(res){
                                //ios 和 android 杜宇拒绝授权的回调 errMsg没有统一 需要特殊处理一下
                                if(res.errMsg.indexOf('auth deny') > -1 || res.errMsg.indexOf('auth denied') > -1){
                                    //处理用户拒绝授权的情况
                                    //打开设置界面
                                    wx.openSetting({
                                        success:function(res){

                                        }
                                    });
                                }
                            }
                        })
                    }
                }
            }
        });
    },

    //授权之后切换场景
    changeScene:function(res){
        gameData.iconUrl = res.avatarUrl;
        gameData.myName = res.nickName;
        cc.director.loadScene("mainScene");
    },

    //加载微信头像资源
    onLoadIcon:function(res){
        var _self = this;
        cc.loader.load({url: res.avatarUrl, type: 'png'}, function (err,texture) {
            if(err)
            {
                
            }else{
               // _self.icon.spriteFrame = new cc.SpriteFrame(texture);
               _self.iconSprite.active = true;
               _self.icon.spriteFrame.setTexture(texture);
            }
        });
    },

    //初始化接口
    init(){
        var self = this;
        //初始化右上角的分享
        wx.showShareMenu({
            withShareTicket: true,
        });

        //监听监听用户点击右上角菜单的“转发”按钮时触发的事件
        wx.onShareAppMessage(function(){
            return {
                title: '来开心呀',
                //转发显示的图片链接，图片窗宽比是 5:4
                //网络图片=》 'https://...'
                imageUrl:cc.url.raw('resources/pig.png'),
            }
        });
    },

    // update (dt) {},
});
