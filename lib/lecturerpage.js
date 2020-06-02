// import angular from 'angular';
var app = angular.module('lectureApp', []);

app.controller('lectureControl', ['$scope', '$http', function($scope, $http, $filter){

    // getting data
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





}]);