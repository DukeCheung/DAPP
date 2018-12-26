pragma solidity ^0.4.24;
pragma experimental ABIEncoderV2;

contract Musician{
    address owner;
    uint musicNumber;
    
    constructor() public{
        owner = msg.sender;
        musicNumber = 0;
    }
    
    mapping (address=>string[]) database;
    
    struct Music{
        string name;
        string singer;
        uint price;
        uint saleCount;
    }
    
    Music[] private music;
    
    function createMusic(string name, string singer, uint price) onlyOwner public returns(bool){
        for(uint i = 0;i < music.length;i++){
            if(bytes(music[i].name).length==bytes(name).length){
                if(keccak256(bytes(music[i].name))==keccak256(bytes(name))){
                    return false;
                }
            }
        }
        music.push(Music(name, singer, price, 0));
        database[owner].push(name);
        musicNumber++;
        return true;
    }
    
    function queryMusicPrice(string name) public constant returns(string,uint) {
        for (uint i = 0;i < music.length;i++){
            if(bytes(music[i].name).length==bytes(name).length){
                if(keccak256(bytes(music[i].name))==keccak256(bytes(name))){
                    return ("价格为：", music[i].price);
                }
            }
        }
        return ("此歌曲不存在",0);
    }
    

    function buyMusic(string song) payable public returns(string, uint) {
        require(msg.sender != owner, "版权拥有者无需购买");
        require(!isBounght(song), "您已购买过此曲，无需重复消费");
        for(uint i = 0;i < music.length;i++){
            if(bytes(music[i].name).length==bytes(song).length){
                if(keccak256(bytes(music[i].name))==keccak256(bytes(song))){
                    require(msg.value >= music[i].price, "金额不足");
                    msg.sender.transfer(msg.value-music[i].price);
                    music[i].saleCount++;
                    database[msg.sender].push(music[i].name);
                    return ("购买成功，返还余额：", msg.value-music[i].price);
                }
            }
        }
        msg.sender.transfer(msg.value);
        return ("购买失败，此曲不存在，返还余额：", 0);
    }
    modifier onlyOwner() {
        require(
            msg.sender == owner,
            "只有版权拥有者才可操作此项"
        );
        _;
    }
    
    function withdraw() public onlyOwner {
        owner.transfer(address(this).balance);
    }
    
    function getBalance() public constant onlyOwner returns(uint) {
        return address(this).balance;
    }
    
    function isBounght(string name) payable public returns(bool){
        for(uint i = 0;i < database[msg.sender].length;i++){
            if(bytes(database[msg.sender][i]).length==bytes(name).length){
                if(keccak256(bytes(database[msg.sender][i]))==keccak256(bytes(name))){
                    return true;
                }
            }
        }
        return false;
    }
    
    function getMusicCount() payable public returns(uint){
        return database[msg.sender].length;
    }
    
    function getMusicList() payable public returns(string[]){
        string[] memory list = new string[](database[owner].length+1);
        for(uint i = 0; i < database[owner].length;i++){
            list[i] = database[owner][i];
        }
        return list;
    }
    function getMyMusic() payable public returns(string[]){
        string[] memory list = new string[](database[msg.sender].length+1);
        for(uint i = 0; i < database[msg.sender].length;i++){
            list[i] = database[msg.sender][i];
        }
        return list;
    }
}