var lastSeenApp = angular.module('lastSeenApp', []);



lastSeenApp.controller('mainController', ['$scope', '$rootScope','appFactory', function($scope, $rootScope, appFactory){

    
    function checkUserDetail($rootScope){
        
        if (typeof(Storage) !== "undefined") {
        
            var userDetail = JSON.parse(localStorage.getItem("userDetail"));
            if(userDetail){
                if(userDetail.Name){
                     $scope.user = userDetail;
                    j$(".login-link-section").hide();
                    j$(".user-section").show();
                }
               
                
            }
            
        }
    }

   

    checkUserDetail();
    
    $scope.$on('checkUserDetail', function(event, data) {
         checkUserDetail();
    })
  
    

    checkUserDetail();

    $scope.mealType = [
        {Name : "Breakfast"},
        {Name : "Lunch"},
        {Name : "Dinner"},
        {Name : "Indian Veg"},
        {Name : "Indian Non-Veg"},
        {Name : "Chinese Non-Veg"},
        {Name : "Seafood"},
        {Name : "Bread & Roti"},
        {Name : "Rice"}
    ]

    $scope.logout = function(){
        
        localStorage.setItem("userDetail", JSON.stringify({}));
        location.reload();
    }

    $scope.showSelectedMeal = function(mealName){
        $scope.searchMenuItem = mealName;
    }

    $scope.openSignUpModal = function(){
        j$("#signUpModal").modal();
    };

    $scope.openLoginModal = function(){
        
         j$("#loginModal").modal();
    }

    $scope.generateOTP = function(){
        var obj = {
            Name: $scope.Name,
            PhoneNumber: $scope.PhoneNumber,
            EmailId: $scope.EmailId,
            Password: $scope.Password
        }
        appFactory.generateOTP(obj);
    };

    $scope.signUp = function(){
        
        appFactory.signUp($scope.otp);
    };

    $scope.login = function(){
        var obj = {
            PhoneNumber: $scope.loginId,
            Password: $scope.loginPassword
        }

        appFactory.login(obj);
    };


    $scope.cartItems = [];
    $scope.cartTotal = 0;
    $scope.discount = 0;
    var discountPercentage = 5;
    

    // Calling service to load the menu items.
    appFactory.getItemsData($scope);

    function checkIfItemExist(item){
        for(var i=0; i<$scope.cartItems.length;i++){
            if($scope.cartItems[i].itemName === item.ItemName){
                return $scope.cartItems[i];
            }
        }
        return undefined;
    }

    // triggering function to add the item to the cart.
    $scope.addItem = function(item){

        var cartObj = checkIfItemExist(item);
        
        if(cartObj){
            
            cartObj.Quantity = cartObj.Quantity + 1;
            cartObj.price = cartObj.price + item.Price;
            $scope.cartTotal = $scope.cartTotal + item.Price;
            $scope.discount = $scope.cartTotal * discountPercentage / 100;
        }
        else{
            cartObj = {};
            cartObj.itemName = item.ItemName;
            cartObj.Quantity = 1;
            cartObj.price = item.Price;
            $scope.cartTotal = $scope.cartTotal + item.Price;
            $scope.discount = $scope.cartTotal * discountPercentage / 100;
            $scope.cartItems.push(cartObj);
           
        }
      
        
    }

}]);

/*Defining the JQuery variable to avoid conflict with angular */
var j$ = $.noConflict();