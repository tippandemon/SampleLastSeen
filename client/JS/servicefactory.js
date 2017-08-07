lastSeenApp.factory('appFactory', function($http, $rootScope){
    var factory = {};
    var userDetail;
    var config = {
            headers : {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

    factory.getItemsData = function($scope){
        
        
        $http.get("/data")
        .then(function(response) {
            console.log(response.data);
            $scope.itemsList = response.data;
        });
   
    };

    factory.signUp = function(otp){
        var data = userDetail;
        data.otp=otp;
       
        $http.post('/signup', data).then(function(response) {
            localStorage.setItem("userDetail", JSON.stringify(response.data));
            $rootScope.$broadcast("checkUserDetail");
            
        });
    };

    factory.generateOTP = function(obj){
        var data = {
            Name: obj.Name,
            PhoneNumber: obj.PhoneNumber,
            EmailId: obj.EmailId,
            Password: obj.Password
        };
       
        userDetail = data;
    

        $http.post('/generateOTP', data).then(function(success) {
            console.log("success");
            j$("#signUpSection").hide();
            j$("#otpSection").show();
            
        });
    }

    factory.login = function(obj){
        var data = {
            PhoneNumber: obj.PhoneNumber,
            Password: obj.Password
        };
        

        $http.post('/login', data).then(function(response) {
            localStorage.setItem("userDetail", JSON.stringify(response.data));
            $rootScope.$broadcast("checkUserDetail");
        });
    };
    

    return factory;
});