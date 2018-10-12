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
        //返回按钮
        goBackBtn:{
            default: null,
            type: cc.Button,
        },

        //放所有球的容器
        ballSprite:{
            default:null,
            type: cc.Node,
        },

        //球的预制体
        ballPrefab:{
            default: null,
            type: cc.Prefab,
        },

        //球拍拍的预制体
        ballBeat:{
            default: null,
            type:cc.Prefab,
        },

        //玩家球的预制体
        playerPrefab:{
            default:null,
            type: cc.Prefab,
        },

        //自己的容器
        mySprite:{
            default: null,
            type: cc.Node,
        },

        //对方的容器
        otherSprite:{
            default: null,
            type: cc.Node,
        },

        //左挡板
        leftWall:{
            default: null,
            type: cc.Node,
        },

        //再来一次的面板
        playAgin:{
            default: null,
            type: cc.Node,
        },

        //胜利面板
        victoryPanel:{
            default: null,
            type: cc.Node,
        },

        //积分 时间文本 和 返回按钮的的容器
        topbar:{
            default: null,
            type: cc.Node,
        },

        //球的总共数量
        ballTotalNum: 200,

        //方向标识
        ballDirection: 1,

        //
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        
          //开启物理引擎
        cc.director.getPhysicsManager().enabled = true;
        //设置物理世界的重力(因为此游戏不需要重力 所以设置为0 默认是cc.v2(0,-300))
        cc.director.getPhysicsManager().gravity = cc.v2(0,0);
        //是否打开debug模式
        cc.director.getPhysicsManager().debugDrawFlags = 0;
        /*cc.director.getPhysicsManager().debugDrawFlags = cc.PhysicsManager.DrawBits.e_aabbBit |
        cc.PhysicsManager.DrawBits.e_centerOfMassBit |
        cc.PhysicsManager.DrawBits.e_jointBit |
        cc.PhysicsManager.DrawBits.e_shapeBit |
        cc.PhysicsManager.DrawBits.e_pairBit;*/
     },

    start () {
        //保存所有球的数组
        this.allBallList = [];

        this.playAgin.active = false;
        this.victoryPanel.active = false;

        //判断几人模式
        if(gameData.people < 2)
        {
            this.ballSprite.y = 300;
        }else{
            //初始化对方的坐标
            this.onInitOtherBall();
            this.ballSprite.y = 150;
        }

        //初始化所有的小球
        this.onInitAllBal();

        //初始化自己的坐标
        this.onInitMyBall();
        
        //多人游戏
        if(gameData.people >= 2)
        {
            //初始化对方的坐标
            this.onInitOtherBall();
        }

        //启动监听事件
        this.onAddEvent();
    },

    //初始化所有的球
    onInitAllBal:function(){
        let column = 600/30;
        let row = Math.ceil(this.ballTotalNum/column);
        let offsetX = 30*0.5 - 300;
        let offsetY = 30*0.5 - 150;

        if(this.ballPrefab){

            let ballSpriteX = 0
            if(gameData.people === 1)
            {
                ballSpriteX = 150;
            }

            this.ballSprite.y = ballSpriteX;

            for(var i = 0; i < row; i++)
            {
                for(var j=0; j < column; j++)
                {
                    var ball = cc.instantiate(this.ballPrefab);
                    ball.x = j*ball.width + offsetX;
                    ball.y = i*ball.height + offsetY ;
                    //将所有的球添加在容器中
                    this.ballSprite.addChild(ball);

                    //将所有的球放入数组中便于下次重复利用
                    this.allBallList.push(ball);
                }
            }
        }
    },

    //再来一盘的时候重置所有的球球
    onRestAllBall:function(){
        //this.ballSprite.removeAllChildren();
        for(var i = 0; i < this.allBallList.length; i++)
        {
            //将所有的球设置为可见状态
            this.allBallList[i].active = true;
        }
    },

    //初始化对方的球 和 球拍
    onInitOtherBall:function(){
        //自己的球
        this.otherBall = cc.instantiate(this.playerPrefab);
        //自己的球拍
        this.otherBeat = cc.instantiate(this.ballBeat);

        //添加球 并设置自己球的坐标
        if(this.otherBall)
        {
            this.otherSprite.addChild(this.otherBall)
            this.otherBallComponent = this.otherBall.getComponent("playerScript");
            //球开始移动
            this.otherBallComponent.onPlay([-100,100,2,this]);
        }

        //添加自己的球拍并设置球拍的坐标
        if(this.otherBeat){
            this.otherSprite.addChild(this.otherBeat);
        }

        //开始玩球
        //this.otherBallComponent.onStartPlayBall();
    },

    //初始化自己的球和和球拍
    onInitMyBall:function(){
        //自己的球
        this.myBall = cc.instantiate(this.playerPrefab);
        //自己的球拍
        this.myBeat = cc.instantiate(this.ballBeat);

        //添加球 并设置自己球的坐标
        if(this.myBall)
        {
            this.mySprite.addChild(this.myBall)
            this.myBallComponent = this.myBall.getComponent("playerScript");
            //球开始移动
            this.myBallComponent.onPlay([200,250,1,this]);
        }

        //添加自己的球拍并设置球拍的坐标
        if(this.myBeat){
            this.mySprite.addChild(this.myBeat);
        }

        //开始玩球
        //this.myBallComponent.onStartPlayBall(this.myBallComponent);
    },

    //添加事件侦听
    onAddEvent:function(){
        this.node.on(cc.Node.EventType.TOUCH_START,this.onTouchStart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMove,this);
        this.node.on(cc.Node.EventType.TOUCH_END,this.onTouchEnd,this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL,this.onTouchCancel,this);

        //得分的事件侦听
        this.node.on("addScore",this.onAddScore.bind(this));
        //倒计时结束的时间侦听
        this.node.on("timeOut",this.onTimeOut.bind(this));
        //胜利的发送事件
        this.node.on("onVictory",this.onVictory.bind(this));
        //失败的发送事件
        this.node.on("onFailure",this.onFailure.bind(this));
    },

    //移除所有的侦听事件
    onRemoveEvent:function(){
        this.node.off(cc.Node.EventType.TOUCH_START);
        this.node.off(cc.Node.EventType.TOUCH_MOVE);
        this.node.off(cc.Node.EventType.TOUCH_END);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL);

        //得分的事件侦听
        this.node.off("addScore");
        //倒计时结束的时间侦听
        this.node.off("timeOut");
         //胜利的发送事件
         this.node.off("onVictory");
         //失败的发送事件
         this.node.off("onFailure");
    },

    //时间结束的处理
    onTimeOut:function(){
        this.onRemoveEvent();
        this.myBallComponent.onStopPlay();
        this.playAgin.active = true;
    },

    //监听积分增加的事件
    onAddScore:function(event){
        event.stopPropagation();

        //刷新积分文本
        this.topbar.getComponent("TimeAndScore").onAddScore();
    },

    //胜利弹面板
    onVictory:function(){
        console.log("初始化会调用吗");
        gameData.isPlayer = false
        this.victoryPanel.active = true;
        this.topbar.getComponent("TimeAndScore").onStopTime();
        this.onRemoveEvent();
    },

    //失败弹面板
    onFailure:function(){
        console.log("初始化会调用吗lllll");
        gameData.isPlayer = false
        this.playAgin.active = true;
        this.topbar.getComponent("TimeAndScore").onStopTime();
        this.onRemoveEvent();
    },

    //点击再玩一次按钮
    onPlayAgin:function(event,coustData){
        //重置所的数据
        this.onAddEvent();
        this.onRestData();
        this.playAgin.active = false;
        
    },

    //点击胜利面板
    onClickVictoryPanel:function(event,custData){
        //重置所的数据
        this.onAddEvent();
        this.onRestData();
        this.victoryPanel.active = false;
    },

    //重置数据
    onRestData:function(){
        //重置所有可碰撞的球
        this.onRestAllBall();
        gameData.wholose = 0;

        //重置自己的球和球拍
        this.myBallComponent.onStartPlayBall();
        this.myBeat.x = 0,this.myBeat.y = 0;

        //重置对方的球和球拍
        if(gameData.people === 2)
        {
            this.otherBallComponent.onStartPlayBall();
            this.otherBeat.x = 0, this.otherBeat.y = 0;
        }
        
        //重置积分和时间
        this.topbar.getComponent("TimeAndScore").onRestScoreAndTime();
    },

    //触摸开始
    onTouchStart:function(event){
        //游戏结束不可以移动球拍
        if(gameData.comeOver){
            return;
        }

        if(this.myBeat)
        {
            //当前移动的x坐标
            let moveX = this.myBeat.parent.convertToNodeSpaceAR(cc.v2(event.touch._point)).x;
            //能达到的最小x坐标 小于这个坐标就等于这个坐标
            let minX = this.myBeat.width*0.5 - (this.node.width*0.5 - this.leftWall.width);
            
            gameData.ballDirection = 0;
            //最小坐标设置
            if(moveX <= minX)
            {
                moveX = minX
            }

            //最大坐标设置
            if(moveX >= -minX)
            {
                moveX = -minX
            }

            this.myBeat.x = moveX;
            
            //设置对方玩家球拍的坐标
            if(this.otherBeat)
            {
                this.otherBeat.x = -moveX;
            }

            //初始化球拍的临时坐标
            if(!this.currX){
                this.currX = 0;
            }
        }
    },

    //触摸移动
    onTouchMove:function(event){
        //游戏结束不可以移动球拍
        if(gameData.comeOver){
            return;
        }

        if(this.myBeat)
        {
            
            //当前移动的x坐标
            let moveX = this.myBeat.parent.convertToNodeSpaceAR(cc.v2(event.touch._point)).x;
            if(this.currX < moveX)
            {
                gameData.ballDirection = 1;
            }else
            {
                gameData.ballDirection = -1;
            }
            
            this.currX = moveX;

            //能达到的最小x坐标 小于这个坐标就等于这个坐标
            let minX = this.myBeat.width*0.5 - (this.node.width*0.5 - this.leftWall.width);
           
            //最小坐标设置
            if(moveX <= minX)
            {
                moveX = minX
            }

            //最大坐标设置
            if(moveX >= -minX)
            {
                moveX = -minX
            }

            this.myBeat.x = moveX; 

            //设置对方玩家球拍的坐标
            if(this.otherBeat)
            {
                this.otherBeat.x = -moveX;
            }
        }

    },

    //触摸结束
    onTouchEnd:function(event){
        console.log("触摸抬起");
    },

    //触摸离开
    onTouchCancel:function(event){
        console.log("触摸离开");
    },

    /**点击返回按钮回到主场景中**/
    onClickGoBackBtn:function(event,customData){
        //游戏结束标识的更新
        gameData.comeOver = true;
        this.onTimeOut();
        //移除计时器
        this.topbar.getComponent("TimeAndScore").onStopTime();
        console.log("点击返回");
        cc.director.loadScene("mainScene");
    },

    // update (dt) {},
});
