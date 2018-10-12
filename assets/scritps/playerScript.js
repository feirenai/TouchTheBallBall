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
        //当前的类型 1 代表自己 2代表对方
        playerType: 1,
    },

    // LIFE-CYCLE CALLBACKS:

     onLoad () {
        this.startX = 0;
        this.startY = 22;
        this.node.x = this.startX;
        this.node.y = this.startY;
     },

    start () {
        
        
    },

    //arr[0] 是x方向 arr[1]是y方向 arr[2]是类型 代表对方或者自己 arr[3]是失败后在玩一次的面板
    onPlay:function(arr){
        //游戏场景组件
        if(arr[3])
        {
            this.playScene = arr[3];
        }

        //设置类型 1 是自己 2 是对方
        if(arr[2])
        {
            this.playerType = arr[2];    
        }

        this.rigidBody = this.node.getComponent(cc.RigidBody);
        //初始化的线性速度
        this.startLinearVelocity = cc.v2(arr[0],arr[1]);

        //设置刚体的线性速度
        //this.rigidBody.linearVelocity = this.startLinearVelocity;
        this.onStartPlayBall();
    },

    //只在两个碰撞体开始接触时被调用一次
    onBeginContact:function(contact,selfCollider,otherCollider){
        //如果碰撞的是球 就处理得分数据更新
        if(otherCollider.body.node.groupIndex == 1)
        {
            
        }else if(otherCollider.body.node.groupIndex == 4)
        {
            //如果碰到下面的底板就游戏结束 并告诉服务器
            this.onCollisionhandling();

            //根据类型来判断成功或者失败
            if(this.playerType == 1)
            {
                //如果失败了就弹出失败面板
                if(this.playScene && this.playScene.playAgin.active == false)
                {
                    //失败的发送事件
                    this.node.dispatchEvent(new cc.Event.EventCustom("onFailure",true));
                }
                
            }else{

            }

            //记录谁失败的标识
            if(gameData.wholose == 0)
            {
                gameData.wholose = this.playerType;
            }
        }
    },

    //重置游戏坐标 再玩一次
    onStartPlayBall:function(){
        
        this.rigidBody.linearVelocity = cc.v2(0,0);
        this.node.x = this.startX;
        this.node.y = this.startY;
        this.node.active = true;
        //延迟两秒可以运动
        this.scheduleOnce(function(dt){
            gameData.isPlayer = true;
            this.rigidBody.linearVelocity = this.startLinearVelocity;
        },1);
    },

    //与底框发生碰撞处理
    onCollisionhandling:function(){
        this.rigidBody.linearVelocity = cc.v2(0,0);
        this.node.active = false;
        //this.x = this.startX;
        //this.y = this.startY;
    },

    //停止
    onStopPlay:function(){
        this.rigidBody.linearVelocity = cc.v2(0,0);
    },

    //只在碰撞触发时调用一次
    onEndContact:function(contact,selfCollider,otherCollider){

    },

    //每次将要碰撞体接触逻辑时被调用
    onPreSolve:function(contact,selfConllider,otherCollider){

    },

    //每次处理完碰撞体接触时调用
    onPostSolve:function(contact,selfConllider,otherConllider){

    },



     update (dt) {
      
        if(gameData.wholose > 0)
        {
            if(this.rigidBody.linearVelocity != cc.v2(0,0))
            {
                this.rigidBody.linearVelocity = cc.v2(0,0);
                //自己赢了
                if(gameData.wholose == 2 && this.playerType == 1)
                {
                    //显示胜利面板
                    if(this.playScene && this.playScene.victoryPanel.active === false )
                    {
                        this.node.dispatchEvent(new cc.Event.EventCustom("onVictory",true))
                    }
                }
            }
        }

     },
});
