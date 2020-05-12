import angular from 'angular';

angular.module('Login', []).controller('LoginController', [
    '$scope', '$http', function ($scope, $http){
        $scope.login = function () {
            let user = $scope.username;
            let pass = $scope.password;

            console.log(user);

            $http({
                method: 'GET',
                url: 'https://caab.sim.vuw.ac.nz/api/leggjere/user_list.json' })
                .then(function(response) {
                    console.log(response);
                    response.data.users.forEach(function(item){
                        var id = item.ID;
                        var username = item.LoginName;
                        var password = item.Password;
                        var userType = item.UserType;

                        if (user === username && pass === password) {
                            console.log('successful login');
                        }
                    });
                }), function failed(response){
                console.log("Failed to attempt to log in");
            }

        }
    }
])
