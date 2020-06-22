var app = angular.module('Info226', []);

app.controller('appController', function($scope, $http) {

    $scope.isStudent = true;
    $scope.showAssignments = true;
    $scope.showMyCourses = true;
    $scope.showAllCourses = true;
    $scope.showLecturer = true;
    $scope.isLoggedIn = true;
    $scope.lectureAddCourse = true;
    $scope.lectureAddAssignment = true;
    $scope.lectureEditCourse = true;
    $scope.lectureEditAssignment = true;
    $scope.lectureAssignmentDire = true;
    $scope.lectureCourseDire = true;

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

    $scope.lectureAddNew = function () {
                $scope.lectureAddCourse = false;
    }

    $scope.lectureNewAssignment = function () {
                $scope.lectureAddAssignment = false;
    }

    $scope.lectureCourses;

    $scope.target = 'https://caab.sim.vuw.ac.nz/api/yeemorg/course_directory.json';
    $scope.getCourseID = function() {
        $scope.lectureCourseDire = false;
        $scope.lectureAssignmentDire = true;
        $scope.lectureAddCourse = true;
        $scope.lectureAddAssignment = true;
        $scope.lectureEditCourse = true;
        $scope.lectureEditAssignment = true;
        $http.get($scope.target)
            .then(function successCall(response) {


                    $scope.lectureCourses = response.data.courses;

                }, function errorCall() {
                    $scope.lectureCourses = "error";
                }
            );
    };


    // // deletes courses
    $scope.deleteCourse = function(course){
        $scope.postDeleteCourse = "https://caab.sim.vuw.ac.nz/api/yeemorg/delete.course."+ course.ID +".json"
        // gets the indexOf course

        const {indexOf} = $scope.lectureCourses;

        var index = $scope.lectureCourses.indexOf(course);


        $http.delete($scope.postDeleteCourse)
            .then(function success() {
                alert("Deleted Course")
                $scope.lectureCourses.splice(index,1);


    })}

    // Adding Function to the post url
    $scope.addCourse = function() {


        // http to post to
        $scope.postLectureCourse = "https://caab.sim.vuw.ac.nz/api/yeemorg/update.course_" +
            "directory.json";
        // Create the course object to post.
        var courseObj = {
            ID: $scope.cID,
            Name: $scope.cName,
            Overview: $scope.cOverview,
            Year: $scope.cYear,
            Trimester: $scope.cTrimester,
            LectureTimes: $scope.cLectureTimes,
            LecturerID: $scope.cLecturerID,
        };

        $http.post($scope.postLectureCourse, courseObj)
            .then(function success() {
                $scope.lectureCourses.push(courseObj)
                alert("Added course");
            },
            function failure(){
                alert("failed to add course")
            }
            )
            ;
    }


//Editing a current course.
    $scope.postEditCourse = "https://caab.sim.vuw.ac.nz/api/yeemorg/update.course_" +
        "directory.json"
$scope.editCourse = function(course){
    $scope.lectureEditCourse = false;
    $scope.editCourseID = course.ID;
    $scope.editCourseName = course.Name;
    $scope.editCourseOverview = course.Overview;
    $scope.editYear = course.Year;
    $scope.editTrimester = course.Trimester;
    $scope.editLectureTimes = course.LectureTimes;
    $scope.editLecturerID = course.LecturerID;
}

//Post contents of edit form to server.
$scope.editPostCourse = function(){

    var courseObj = {
        ID: $scope.editCourseID,
        Name: $scope.editCourseName,
        Overview: $scope.editCourseOverview,
        Year: $scope.editYear,
        Trimester: $scope.editTrimester,
        LectureTimes: $scope.editLectureTimes,
        LecturerID: $scope.editLecturerID,
    };

    $http.post($scope.postEditCourse, courseObj)
        .then(function successCall(data, status, headers, config){
            alert("Edited Course")
            $scope.editFeedback = "Posted Sucessfully";
        }, function errorCall(data, status, headers, config) {
            $scope.editFeedback = "Failed to post";
        })
}

    $scope.lectureAssignments;

    $scope.Atarget = "https://caab.sim.vuw.ac.nz/api/yeemorg/assignment_directory.json";
    $scope.getLectureAssignmentsID = function() {
        $scope.lectureAssignmentDire = false;
        $scope.lectureCourseDire = true;
        $scope.lectureAddCourse = true;
        $scope.lectureAddAssignment = true;
        $scope.lectureEditCourse = true;
        $scope.lectureEditAssignment = true;
        $http.get($scope.Atarget)
            .then(function successCall(response) {


                $scope.lectureAssignments = response.data.assignments;


            }, function errorCall() {
                alert("Failed to get data");
            }
            );
    };


    // Adding Assignments to the url
    $scope.addAssignment = function() {


        // http to post to
        $scope.postLectureAssignment = "https://caab.sim.vuw.ac.nz/api/yeemorg/update.assignment_directory.json";
        // Create the course object to post.
        var assignmentObj = {
            ID: $scope.aID,
            Name: $scope.aName,
            Overview: $scope.aOverview,
            CourseID: $scope.aCourseID,
            DueDate: $scope.aDueDate,
        };

        $http.post($scope.postLectureAssignment, assignmentObj)
            .then(function success() {
                    $scope.lectureAssignments.push(assignmentObj)
                    alert("Added Assignment");
                },
                function failure(){
                    alert("failed to add assignment")
                }
            )
        ;
    }


//Editing a current course.
    $scope.postEditAssignment = "https://caab.sim.vuw.ac.nz/api/yeemorg/update.assignment_directory.json"
    $scope.editAssignment = function(assignment){
        $scope.lectureEditAssignment = false;
        $scope.editAssignmentID = assignment.ID;
        $scope.editAssignmentName = assignment.Name;
        $scope.editAssignmentOverview = assignment.Overview;
        $scope.editAssignmentCourseID = assignment.CourseID;
        $scope.editDueDate = assignment.DueDate;
    }

//Post contents of edit form to server.
    $scope.editPostAssignment = function() {

        var assignmentObj = {
            ID: $scope.editAssignmentID,
            Name: $scope.editAssignmentName,
            Overview: $scope.editAssignmentOverview,
            CourseID: $scope.editAssignmentCourseID,
            DueDate: $scope.editDueDate,
        };

        $http.post($scope.postEditAssignment, assignmentObj)
            .then(function successCall(data, status, headers, config) {
                alert("Edited Assignment")
                $scope.editFeedback = "Posted Sucessfully";
            }, function errorCall(data, status, headers, config) {
                $scope.editFeedback = "Failed to edit";
            })
    }

    //Deleting Assignment
    $scope.deleteAssignment = function(assignment) {
        $scope.postDeleteAssignment = "https://caab.sim.vuw.ac.nz/api/yeemorg/delete.assignment."+ assignment.ID +".json"
        const {indexOf} = $scope.lectureAssignments;
        var aIndex = $scope.lectureAssignments.indexOf(assignment);

        $http.delete($scope.postDeleteAssignment)
            .then(function success() {
                alert("Deleted Assignment")
                $scope.lectureAssignments.splice(aIndex,1);
            })}



})

