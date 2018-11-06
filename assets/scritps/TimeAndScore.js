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

        //分数文本
        scoreTxt:{
            default: null,
            type: cc.Label,
        },

        //倒计时文本
        timeTxt:{
            default: null,
            type: cc.Label,
        },

        //当前的积分
        currScore: 0,
        //当前的时间
        currTime: 0,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.scoreTxt.string = "0";
        this.currTime = gameData.downTime
        this.timeTxt.string = this.onFormatTime(1,gameData.downTime);
        this.onAddEvent();
    },

    onAddEvent:function(){
        if(this.currTime > 0){
            this.schedule(this.onTimeDown.bind(this),1);
        }
    },

    //增加积分
    onAddScore:function(){
        
        if(gameData && gameData.scoreList && gameData.scoreList.length > 0)
        {
            for(var i = 0; i < gameData.scoreList.length; i++)
            {
                this.currScore += gameData.scoreList[i];
                gameData.scoreList[i] = 0;
            }
            
            //刷新积分文本
            this.scoreTxt.string = this.currScore + "";
            gameData.myScore = this.currScore;
        }
    },

    //重置积分和时间
    onRestScoreAndTime:function(){
        //重置积分文本
        this.currScore = 0
        this.scoreTxt.string = this.currScore + "";
        gameData.myScore = this.currScore;
        
        //重置倒计时文本
        this.timeTxt.string = this.onFormatTime(1,gameData.downTime);
        //重置倒计时时间
        this.currTime = gameData.downTime;
        //启动时间侦听器
        this.onAddEvent();
    },

    //停止倒计时
    onStopTime:function(){
        this.unscheduleAllCallbacks();
    },

    //定时器的回调函数
    onTimeDown:function(dt){
        if(this.currTime > 0)
        {
            this.currTime = this.currTime - 1;
            this.timeTxt.string = this.onFormatTime(1,this.currTime);
        }
        
        //倒计时结束
        if(this.currTime <= 0)
        {
            this.unscheduleAllCallbacks();
            this.node.dispatchEvent(new cc.Event.EventCustom("timeOut",true))
        }
    },

    /*
        格式化时间格式
        type 1 00:00 2 00:00:00 3 00:00:00:00
    */
    onFormatTime:function(type,time){
        var str
        var minutes
        var seconds
        if(type === 1)
        {
            minutes = Math.floor(time/60)
            if(minutes < 10)
            {
                minutes = "0" + minutes;
            }

            str = minutes + ":";
        }
        
        seconds = time%60
        if(seconds < 10)
        {
            seconds = "0" + seconds;
        }
        str += seconds; 
        return str;
    },

    update (dt) {
        
    },
});
