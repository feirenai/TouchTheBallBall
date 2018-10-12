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
        //开始按钮
        startBnt:{
            default: null,
            type: cc.Button,
        },

        //排行按钮
        rankBtn:{
            default: null,
            type: cc.Button,
        },

        //世界排行按钮
        worldBtn:{
            default: null,
            type: cc.Button,
        },

        //好友排行按钮
        friendBtn:{
            default: null,
            type: cc.Button,
        },

        //世界排行和好友排行的背景框
        worldFriendBg:{
            default: null,
            type:cc.Node,
        },
        
        //广告按钮
        advertisingBtn:{
            default: null,
            type: cc.Button,
        },

        //排行榜面板容器
        rankSrpit:{
            default: null,
            type: cc.Node,
        },

        //排行榜的关闭按钮
        rankBackBtn:{
            default: null,
            type: cc.Button,
        },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        
    },

    start () {
        //初始化的时候隐藏世界排行按钮和好友排行按钮
        this.on_worldFriendBg_init();

        this.opanPanel = this.rankSrpit.getComponent("openDomain");

        this.iconSprite = this.node.getChildByName("iconSprite");
        this.icon = this.iconSprite.getChildByName("iconMask").getChildByName("icon").getComponent(cc.Sprite);
        this.myNameTxt = this.iconSprite.getChildByName("name").getComponent(cc.Label);
        this.iconSprite.active = false;

        if(gameData.wx)
        {
            this.init();
            //加载头像
            this.onLoadIcon();
        }
    },

    //加载微信头像资源
    onLoadIcon:function(){

        //第一种显示的处理方法
        /*if(!gameData.iconUrl || gameData.iconUrl == "")
        {//如果加载的资源地址不对就不做处理
            return;
        }

        let _self = this;
        //开始记载头像资源
        cc.loader.load({url: gameData.iconUrl, type: 'png'}, function (err,texture) {
            if(err)
            {
                console.log(err);
            }else{
               // _self.icon.spriteFrame = new cc.SpriteFrame(texture);
               _self.iconSprite.active = true;
               //设置自己的头像
               _self.icon.spriteFrame.setTexture(texture);
               //设置自己的名字
               _self.myNameTxt.string = gameData.myName;
            }
        });*/
        let _self = this;
        let user = wx.getStorageSync('userInfo');

        //设置自己的名字
        _self.myNameTxt.string = user.nickName;

        //显示头像
        let image = wx.createImage();
        image.onload = function(){
            let texture = new cc.Texture2D();
            texture.initWithElement(image);
            texture.handleLoadedTexture();
            _self.icon.spriteFrame.setTexture(texture);
            _self.iconSprite.active = true;
        };
        image.src = user.avatarUrl;

    },

    //初始化的时候隐藏世界排行按钮和好友排行按钮
    on_worldFriendBg_init:function()
    {
        //世界排行按钮的x坐标为0
        this.worldBtn.node.x = 0;
        //好友排行按钮的x坐标为0
        this.friendBtn.node.x = 0;
        //世界排行按钮和好友排行按钮的背景框的scaleX
        this.worldFriendBg.scaleX = 0;
    },

    //点击开始按钮
    onStartClick:function(){
        cc.director.loadScene("gameScene");
    },

    //点击排行榜按钮
    onClickRankBtn:function(){
        
        if(this.worldFriendBg)
        {
            var animationWorld;
            var animationFriend;
            var animationBg;
            var tiem = 0.3;

            if(this.worldFriendBg.scaleX == 1)
            {//如果是展开的状态就缩进
                //世界排行榜按钮的移动
                animationWorld = cc.moveTo(tiem,cc.v2(0,this.worldBtn.node.y));
                
                //好友排行榜的移动
                animationFriend = cc.moveTo(tiem,cc.v2(0,this.friendBtn.node.y));
                
                //好友排行榜 和 世界排行榜背景框的缩进
                animationBg = cc.scaleTo(tiem,0,1);
                

            }else if(this.worldFriendBg.scaleX == 0)
            {//如果缩进状态就展开
                //世界排行榜按钮的移动
                animationWorld = cc.moveTo(tiem,cc.v2(-150,this.worldBtn.node.y));
                //好友排行榜的移动
                animationFriend = cc.moveTo(tiem,cc.v2(150,this.friendBtn.node.y));
                //好友排行榜 和 世界排行榜背景框的缩进
                animationBg = cc.scaleTo(tiem,1,1);
            }

            this.worldBtn.node.runAction(animationWorld);
            this.friendBtn.node.runAction(animationFriend);
            this.worldFriendBg.runAction(animationBg);
        }
    },

    //点击广告按钮
    onClickAdvertisingBtn:function(){

    },

    //点击好友排行按钮
    onClickFriendBtn:function(){
        this.rankSrpit.active = true;
    },

    //点击排行榜关闭按钮
    onClickRankBackBtn:function(){
        this.rankSrpit.active = false;
        postMessage
    },

    init(){
         //开启监听 返回小程序启动参数（只有第一次激活生效）
         let launchOption = wx.getLaunchOptionsSync();
         console.log('首次开启 launchOption');
         console.log(launchOption);

         //开启监听小游戏回到前台的事件(分享返回，下拉框的返回)
         wx.onShow(function(dt){
            console.log("回到前台onshow");
            console.log(dt);
            if(launchOption.scene == 1044){
                //判断是否从群分享链接进入 打开群分享排行
                console.log("主域发送1",aunchOption.shareTicket);
                self.opanPanel.openCrowdRank(launchOption.shareTicket);
            }else if(dt.scene == 1044)
            {
                console.log("主域发送1",dt);
                self.opanPanel.openCrowdRank(dt,shareTicket);
            }else if(launchOption.scene == 1007){
                //从分享页面进入
                console.log('分享好友开启' + launchOption.qurey.openid);
            }else if(dt.scene == 1077){
                console.log('分享好友开启' + dt.qurey.openid);
            }
         });
    }

    // update (dt) {},
});
