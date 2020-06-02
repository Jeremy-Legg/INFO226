var app = angular.module('Info226', []);

app.controller('appController', function($scope, $http) {

    $scope.isStudent = true;
    $scope.showAssignments = true;
    $scope.showMyCourses = true;
    $scope.showAllCourses = true;
    $scope.showLecturer = true;
    $scope.isLoggedIn = true;

    $scope.login = function () {
        let user = $scope.username;
        let pass = $scope.password;


        $http({
            method: 'GET',
            url: 'https://caab.sim.vuw.ac.nz/api/leggjere/user_list.json'
        })
            .then(function (response) {
                console.log(response);
                response.data.users.forEach(function (item) {
                    var id = item.ID;
                    var username = item.LoginName;
                    var password = item.Password;
                    var userType = item.UserType;

                    if (user === username && pass === password) {
                        $scope.showLogin = true;
                        $scope.isLoggedIn = false;
                        if (userType == "student") {
                            $scope.isStudent = false;
                            $scope.showAllCourses = false;
                        }
                        if (userType == "lecturer") {
                            $scope.showLecturer = false;
                        }
                    }
                });
            }), function failed(response) {
            console.log("Failed to attempt to log in");
        }
    }
    $scope.showAllCoursesView = function () {
        $scope.isStudent = false;
        $scope.showAssignments = true;
        $scope.showMyCourses = true;
        $scope.showAllCourses = false;
        $scope.showLecturer = true;
    }

    $scope.showMyCoursesView = function () {
        $scope.isStudent = false;
        $scope.showAssignments = true;
        $scope.showMyCourses = false;
        $scope.showAllCourses = true;
        $scope.showLecturer = true;
    }

    $scope.showAssignmentsView = function () {
        $scope.isStudent = false;
        $scope.showAssignments = false;
        $scope.showMyCourses = true;
        $scope.showAllCourses = true;
        $scope.showLecturer = true;
    }

    $scope.logOutView = function () {
        $scope.isStudent = true;
        $scope.showAssignments = true;
        $scope.showMyCourses = true;
        $scope.showAllCourses = true;
        $scope.showLecturer = true;
        $scope.showLogin = false;
        $scope.isLoggedIn = true;
    }

    $scope.lectureCourses;

    $scope.target = 'https://caab.sim.vuw.ac.nz/api/yeemorg/course_directory.json';
    $scope.getCourseID = function() {
        $http.get($scope.target)
            .then(function successCall(response) {

                    // var courseid = JSON.stringify(response.data.courses);
                    // $scope.courselist = courseid;
                    $scope.lectureCourses = response.data.courses;

                }, function errorCall() {
                    $scope.courselist = "error";
                }
            );
    };

    // display of courses
    // $scope.courses = [
    //     {id:'INFO226', name: 'Application Development', information: 'An introduction to the use of software languages and tools for rapid application development.'},
    //     {id:'INFO234', name: 'Business Process Design', information: 'This course will explore the role and potential of IT to support business process management and design.'},
    // ];

    // hiding and showing add function
    $scope.addForm = false;
    $scope.addCourse = function (){
        $scope.addForm = true;
    }

    // //adding courses to the lecture page
    // $scope.addCourse = function () {
    //     $scope.courses.push($scope.cID);
    //     $scope.courses.push($scope.cName);
    //     $scope.courses.push($scope.cInformation);
    // }

    // deletes courses
    $scope.deleteCourse = function(course){
        // gets the indexOf course
        const {indexOf} = $scope.lectureCourses;
        var index = $scope.lectureCourses.indexOf(course);
        // remove courses
        $scope.lectureCourses.splice(index,1);
    }


    // Save and edit data
    // save(): void {
    //     this.heroService.updateHero(this.hero)
    //         .subscribe(() => this.goBack());
    // }


})

