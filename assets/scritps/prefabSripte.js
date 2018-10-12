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
        ballType: 1,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        var r = Math.floor(Math.random()*255);
        var g = Math.floor(Math.random()*255);
        var b = Math.floor(Math.random()*255);

        this.node.color = cc.color(r,g,b,255);
    },

    randColor:function(){
        var color = Math.floor(Math.random()*255);
        return color;
    },

    //设置数据
    onSetInfo:function(data){
        if(!data)
        {
            return;
        }
    },

    //添加事件侦听
    onEvent:function(){
        //发送加分事件
        this.node.dispatchEvent(new cc.Event.EventCustom("addScore",true));
    },

    //碰撞开始接触的时候调用一次
    onBeginContact:function(contact,selfCollider,otherCollider){
        
    },

    //两个碰撞体结束触发一次
    onEndContact:function(contact,selfCollider,otherCollider){
        this.node.active = false;
        //将加的分数加入数组中
        if(gameData && gameData.scoreList)
        {
            gameData.scoreList.push(this.ballType);
        }

        this.onEvent();
    },

    //重置所有球的状态
    onRestBall:function(){
        this.node.active = true;
    },

    //每次将要处理碰撞体接触的时候调用
    onPreSolve:function(contact,selfCollider,otherCollider){

    },

    //每次处理完碰撞体接触时调用
    onPostSolve:function(contact,selfCollider,otherCollider){

    },

    // update (dt) {},
});
