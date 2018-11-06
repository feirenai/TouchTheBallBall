// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        nodeScript:{
            default:null,
            type: cc.Node,
        },

    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.subContextView = this.nodeScript.getComponent(cc.WXSubContextView);
     },

    start () {
        
    },

    //向开放数据域上传数据
    postMessage(type,value){
        wx.postMessage({
            type: type,
            value: value,
        });

        if(this.subContextView){
            //this.subContextView.update();
        }

    },

    //是否隐藏组件
    hideIsShow(boo){
        this.node.acitve = boo;
        this.subContextView.enabled = boo;
    },  

    //更新分数
    sendScore(score){
        this.postMessage('score',score);
    },

    //隐藏排行榜（子域无法自己关闭）
    hideRank(){
        this.postMessage('hide');
        this.hideIsShow(false);
    },

    //打开好友排行
    openFriendRank(){
        this.hideIsShow(true);
        this.postMessage('friend');
    },

    //打开群排行
    openCrowdRank(shareTicket){
        this.hideIsShow(true);
        this.postMessage('crowd',shareTicket);
    },

    //主动转发
    shareAppMessage(){
        wx.shareAppMessage({
            title:'来玩呀',
            imageUrl: cc.url.raw('resources/pig.png'),
            query: 'openid=110',
            success:function(){
                console.log('分享成功');
            },
            fail:function(){
                console.log("分享失败");
            },
        });
    },

    // update (dt) {},
});
