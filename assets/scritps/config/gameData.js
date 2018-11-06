var  gameData = {
    //几人游戏
    people: 1,
    //自己是否已经结束游戏
    myComeOver: false,
    //对方是否游戏结束
    otherComeOver: false,
    //自己的分数
    myScore: 0,
    //对方的分数
    otherScore: 0,
    //方向的标识 0代表原始状态  1右  -1左
    ballDirecation:0,
    //微信平台的标识 用于不在微信工具中调试
    wx:true,
    //是自己失败还是对方失败的标识 1代表自己 2代表对方
    wholose:0,
    //当前所加的分数的数组
    scoreList:[],
    //倒计时的时间
    downTime: 30,
    //是否正在游戏
    isPlayer:false,
    //自己的头像地址
    iconUrl:"",
    //自己的名字
    myName:"",
};

module.exports = gameData;
