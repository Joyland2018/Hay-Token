App = {
  web3Provider: null,
  contracts: {},
  // pages: {},
  
  init: function() {
    // Load pets.
    var pages = {};
    var loadPage = function(){
      // var bodyId = $('body').attr('id');
      // if (bodyId == 'index_body') {
      //   console.log('true');
      //   window.open('anotherPage.html');
      // }else{
      //   console.log('false');
      // }
    $.each(pages,function(k,v){
            var sectionId = '#'+k+'_section';
            $('body').delegate(sectionId,'pageinit',function(){
                v.init && v.init.call(v);
            });
            $('body').delegate(sectionId,'pageshow',function(e,isBack){
                //页面加载的时候都会执行
                v.show && v.show.call(v);
                //后退时不执行
                if(!isBack && v.load){
                    v.load.call(v);
                }
            });
        });
    J.Transition.add('flip','slideLeftOut','flipOut','slideRightOut','flipIn');
    Jingle.launch({
            showWelcome : true,
            welcomeSlideChange : function(i){
                switch(i){
                    case 0 :
                        J.anim('#welcome_jingle','welcome_jinlge',1000);
                        break;
                    case 1 :
                        $('#r_head,#r_body,#r_hand_left,#r_hand_right,#r_foot_left,#r_foot_right').hide()
                        J.anim($('#r_head').show(),'r_head',500,function(){
                            J.anim($('#r_body').show(),'r_body',1200,function(){
                                J.anim($('#r_hand_left').show(),'r_hand_l',500);
                                J.anim($('#r_hand_right').show(),'r_hand_r',500,function(){
                                    J.anim($('#r_foot_left').show(),'r_foot_l',500);
                                    J.anim($('#r_foot_right').show(),'r_foot_r',500,function(){
                                        J.anim('#welcome_robot','welcome_robot',2000);
                                    });
                                });
                            });
                        });
                        break;
                    case 2 :
                        $('#w_box_1,#w_box_2,#w_box_3,#w_box_4').hide()
                        J.anim($('#w_box_1').show(),'box_l',500,function(){
                            J.anim($('#w_box_2').show(),'box_r',500,function(){
                                J.anim($('#w_box_3').show(),'box_l',500,function(){
                                    J.anim($('#w_box_4').show(),'box_r',500);
                                });
                            });
                        });
                        break;
                }
            },
            showPageLoading : true,
            remotePage : {
                '#about_section' : 'remote/about_section.html'
            }
        });


    }
    

    var slider;
        $('#community_article').on('articleshow',function(){
            slider = new J.Slider({
                selector : '#slider_test',
                onBeforeSlide : function(){
                    return true;
                },
                onAfterSlide : function(i){
                    //alert(i);
                }
            });
        });
        $('#slider_prev').on('tap',function(){
          slider.prev();
        });
        $('#slider_next').on('tap',function(){
          slider.next();
        });

    $('#acitivities_article').on('articleshow',function(){
    // $('#activityGroup').trigger('change',"aaaa");
    $('#request_list').show();
            $('#accept_list').hide();
    });
    // $('#community_article').trigger('articleshow');


    var page = function(id,factory){
        return ((id && factory)?_addPage:_getPage).call(this,id,factory);
    };
    var _addPage = function(id,factory){
        pages[id] = new factory();
    };
    var _getPage = function(id){
        return pages[id];
    };

    page('index',function(){
      console.log('index_section');
    });
    page('send',function(){

    });

    page('transaction',function(){
      
    });

    loadPage();


    return App.initWeb3();
  },
  // page: function(id,factory){
  //   return ((id && factory)?_addPage:_getPage).call(this,id,factory);
  // },
  // _addPage: function(id,factory){
  //   pages[id] = new factory();
  // },
  // _getPage: function(id){
  //   return pages[id];
  // },

  initWeb3: function() {
    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
    }else{
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
    }

    web3 = new Web3(App.web3Provider);

    return App.initContract();
  },
  getCurrentUser: function(){
    

    // 获取用户账号
    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }

      $('#my_eth_address').text(accounts[0]);

      web3.eth.getBalance(accounts[0],function(error,balance){
        if (error) {
          console.log(error);
        }

        console.log(balance.toNumber());

        var balanceToEth = web3.fromWei(balance).toNumber();
        $('#my_token_total').text(balanceToEth);
      });
    });
  },
  initContract: function() {
    $.getJSON('TransactionContract.json',function(data){
       var TransactionArtifact = data;
       App.contracts.TransactionContract = TruffleContract(TransactionArtifact);
       // Set the provider for our contract
       App.contracts.TransactionContract.setProvider(App.web3Provider);
       
       // Use our contract to retrieve and mark the adopted pets
       // return App.markAdopted();
       return App.getCurrentUser();
     });

    return App.bindEvents();
  },

  bindEvents: function() {
    // $(document).on('click', '.btn-adopt', App.handleAdopt);
    $(document).on('click','#send_request', App.createTransaction);
    $(document).on('click','.accept_driver',App.completeTransaction);
    $(document).on('click','.accept_order',App.acceptOrder);
  },

  markAdopted: function(adopters, account) {
    var transactionInstance;

    App.contracts.TransactionContract.deployed().then(function(instance) {
      transactionInstance = instance;

    }).then(function(balance) {
      // $('#my_eth_address').text(balance.toNumber());
    }).catch(function(err) {
      console.log(err.message);
    });
  },

  // handleAdopt: function(event) {
  //   event.preventDefault();

  //   var petId = parseInt($(event.target).data('id'));

  //   /*
  //    * Replace me...
  //    */
  // },
  createTransaction: function(event){
    event.preventDefault();
    console.log('create transaction.');

    var transactionInstance;
    
    web3.eth.getAccounts(function(error, accounts){
      if (error) {
        console.log(error);
      }
      
      App.contracts.TransactionContract.deployed().then(function(instance){
        transactionInstance = instance;

        return transactionInstance.deposit.sendTransaction({from: accounts[0], value: web3.toWei(0.5, 'ether')});
      }).then(function(contract){
        return transactionInstance.getContractBalance.call();
      }).then(function(balance){
        console.log(balance.toNumber());
      }).catch(function(err){
        console.log(err.message);
      });


    });

  },
  acceptOrder: function(event){
    event.preventDefault();

    var transactionInstance;
    App.contracts.TransactionContract.deployed().then(function(instance){
      transactionInstance = instance;

      transactionInstance.setAcceptor.call('0x21B0536b98F42B8Af22048F687d51c3F3F47eb0c');
      return transactionInstance.getAcceptor.call();
    }).then(function(account){
      console.log(account);
    }).catch(function(err){
      console.log(err.message);
    });
  },
  completeTransaction: function(event){
    event.preventDefault();

    var transactionInstance;
    App.contracts.TransactionContract.deployed().then(function(instance){
        transactionInstance = instance;

        transactionInstance.confirmReceived.call();
    }).catch(function(err){
        console.log(err.message);
    });
  },

};


$(function() {
  $(window).load(function() {
    App.init();
  });

  // window.open('anotherPage.html');
});
