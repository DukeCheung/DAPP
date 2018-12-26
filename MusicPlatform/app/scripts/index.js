import '../styles/app.css'

import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

import musicianArtifact from '../../build/contracts/Musician.json'

const Musician = contract(musicianArtifact)

let accounts
let account
let musicianAccount
let currentAccount

const App = {
  start: function () {
  	const self = this

    // Bootstrap the Musician abstraction for Use.
    Musician.setProvider(web3.currentProvider)

    // Get the initial account balance so it can be displayed.
    web3.eth.getAccounts(function (err, accs) {
      if (err != null) {
        alert('There was an error fetching your accounts.')
        return
      }

      if (accs.length === 0) {
        alert("Couldn't get any accounts! Make sure your Ethereum client is configured correctly.")
        return
      }

      accounts = accs
      account = accounts[0]
      musicianAccount = accounts[0]

    })
  },
  setStatus: function (message) {
    const status = document.getElementById('screen')
    status.value = message
  },

  createMusic: function(){
  	const self = this
  	const name = document.getElementById("name").value
  	const singer = document.getElementById("singer").value
  	const price = parseInt(document.getElementById("price").value)
  	this.setStatus('Initiating transaction... (please wait)')
  	self.setStatus('')
  	let meta
    Musician.deployed().then(function (instance){
      meta = instance
      return meta.createMusic.sendTransaction(name, singer, price, {from: musicianAccount, gas:300000})
    }).then(function(){
      self.setStatus('Success')
      document.getElementById("name").value = ''
      document.getElementById("singer").value = ''
      document.getElementById("price").value = ''
    }).catch(function (e){
      console.log(e)
      self.setStatus('Failed')
    })
  },
  queryPrice: function(){
  	const self = this
  	const name = document.getElementById("queryPriceName").value

  	self.setStatus('')
  	let meta
  	let result
  	Musician.deployed().then(function (instance){
      meta = instance
      return meta.queryMusicPrice.call(name)
    }).then(function(result){
        self.setStatus(result)
        document.getElementById("queryPriceName").value = ''
    }).catch(function (e){
      console.log(e)
      self.setStatus('Failed')
    })
  },
  buyMusic: function(){
  	const self = this
  	const name = document.getElementById("songName").value
  	const price = parseInt(document.getElementById("value").value)
  	currentAccount = document.getElementById("account").value
  	self.setStatus('')
  	let meta
  	Musician.deployed().then(function (instance){
      meta = instance
      return meta.buyMusic.sendTransaction(name, {from: currentAccount, value: web3.toWei(price, "ether"), gas:300000})
    }).then(function(result){
      self.setStatus('Success')
      document.getElementById("songName").value = ''
      document.getElementById("value").value = ''
      document.getElementById("account").value = ''
    }).catch(function (e){
      console.log(e)
      self.setStatus(currentAccount)
    })
  },
  withdraw: function(){
  	const self = this
  	self.setStatus('')
  	let meta
  	Musician.deployed().then(function (instance){
      meta = instance
      return meta.withdraw.sendTransaction({from: musicianAccount})
    }).then(function(){
      self.setStatus('Success')
    }).catch(function (e){
      console.log(e)
      self.setStatus('Failed')
    })
  },
  getBalance: function(){
  	const self = this
  	self.setStatus('')

  	let meta
  	Musician.deployed().then(function (instance){
      meta = instance
      return meta.getBalance.call()
    }).then(function(result){
      self.setStatus(result)
    }).catch(function (e){
      console.log(e)
      self.setStatus('Failed')
    })
  },

  getCount: function(){
  	const self = this
  	self.setStatus('')

  	let meta
  	Musician.deployed().then(function (instance){
      meta = instance
      return meta.getMusicCount.call()
    }).then(function(result){
      self.setStatus(result)
    }).catch(function (e){
      console.log(e)
      self.setStatus('Failed')
    })
  },

  getMusicList: function(){
  	const self = this
  	self.setStatus('')

  	let meta

  	Musician.deployed().then(function (instance){
      meta = instance
      return meta.getMusicList.call()
    }).then(function(result){
        self.setStatus(result)
    }).catch(function (e){
      console.log(e)
      self.setStatus('Failed')
    })
  },

  getMyMusicList: function(){
  	const self = this
  	self.setStatus('')
  	currentAccount = document.getElementById("account2").value

  	let meta
  	Musician.deployed().then(function (instance){
      meta = instance
      return meta.getMyMusic.call({from: currentAccount})
    }).then(function(result){
    	self.setStatus(result)
    	document.getElementById("account2").value = ''
    }).catch(function (e){
      console.log(e)
      self.setStatus('Failed')
    })
  }

}

window.App = App

window.addEventListener('load', function () {
  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    console.warn(
      'Using web3 detected from external source.' +
      ' If you find that your accounts don\'t appear or you have 0 Musician,' +
      ' ensure you\'ve configured that source properly.' +
      ' If using MetaMask, see the following link.' +
      ' Feel free to delete this warning. :)' +
      ' http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // Use Mist/MetaMask's provider
    window.web3 = new Web3(web3.currentProvider)
  } else {
    console.warn(
      'No web3 detected. Falling back to http://127.0.0.1:9545.' +
      ' You should remove this fallback when you deploy live, as it\'s inherently insecure.' +
      ' Consider switching to Metamask for development.' +
      ' More info here: http://truffleframework.com/tutorials/truffle-and-metamask'
    )
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    window.web3 = new Web3(new Web3.providers.HttpProvider('http://127.0.0.1:8545'))
  }

  App.start()
})
