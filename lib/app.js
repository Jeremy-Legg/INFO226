var app = angular.module('Info226', []);

app.controller('appController', function($scope, $http) {
    let id;
    let studentAllCoursesAsc;
    let allCourses;
    let enrolledCourseID = [];
    let myCourseAsc = [];
    let completedAssignments = [];
    let allAssignments = [];
    $scope.isStudent = true;
    $scope.showAssignments = true;
    $scope.showMyCourses = true;
    $scope.showAllCourses = true;
    $scope.showLecturer = true;
    $scope.showIncorrectLogin = true;
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
                        let valid = false;
                        response.data.users.forEach(function (item) {
                            id = item.ID;
                            var username = item.LoginName;
                            var password = item.Password;
                            var userType = item.UserType;

                            if (user === username && pass === password) {
                                valid = true;
                                $scope.showLogin = true;
                                $scope.isLoggedIn = false;
                                $scope.showIncorrectLogin = true;
                                if (userType == "student") {
                                    $scope.isStudent = false;
                                    $scope.showAllCourses = false;
                                    getAllCourses();
                                    getEnrolledCourseID();
                                }
                                if (userType == "lecturer") {
                                    $scope.showLecturer = false;
                                }
                            }

                        });
                        if (!valid) {
                            $scope.showIncorrectLogin = false;
                        }
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
        getAllCourses();


    }

    getAllCourses = function(){
        $http({
            method: 'GET',
            url: 'https://caab.sim.vuw.ac.nz/api/leggjere/course_directory.json'
        }).then(function (response) {
            $scope.studentAllCourses = response.data.courses;
        }, function failed(response) {
            console.log("Failed to get all courses");
        })
    }

    getEnrolledCourseID = function () {
        enrolledCourseID = [];
        allAssociations = 0;
        $http({
            method: 'GET',
            url: 'https://caab.sim.vuw.ac.nz/api/leggjere/course_association_directory.json'
        }).then(function (response) {
            response.data.courseAssociations.forEach(function (item) {
                if (item.StudentID == id){
                    enrolledCourseID.push(item.CourseID);
                    myCourseAsc.push(item);
                }
            })
        }, function failed(response) {
            console.log("Failed to get all courses");
        })
    }

    $scope.showMyCoursesView = function () {
        $scope.isStudent = false;
        $scope.showAssignments = true;
        $scope.showMyCourses = false;
        $scope.showAllCourses = true;
        $scope.showLecturer = true;

        let myCourses = [];
        getEnrolledCourseID();
        
        $http({
            method: 'GET',
            url: 'https://caab.sim.vuw.ac.nz/api/leggjere/course_directory.json'
        }).then(function (response) {
            response.data.courses.forEach(function (item) {
                if (enrolledCourseID.includes(item.ID)){
                    myCourses.push(item);
                }
            })
            $scope.studentMyCourses = myCourses;
        }, function failed(response) {
            console.log("Failed to get all courses");
        })
    }

    $scope.showAssignmentsView = function () {
        $scope.isStudent = false;
        $scope.showAssignments = false;
        $scope.showMyCourses = true;
        $scope.showAllCourses = true;
        $scope.showLecturer = true;


        if (enrolledCourseID.length == 0){
            getEnrolledCourseID();
        }
        getAssignments();


    }

    getAssignments = function(){
        $http({
            method: 'GET',
            url: 'https://caab.sim.vuw.ac.nz/api/leggjere/assignment_directory.json'
        }).then(function (response) {
            response.data.assignments.forEach(function (item) {
                if (enrolledCourseID.includes(item.CourseID)){
                    let included = false;
                    for (let i = 0; i < allAssignments.length; i++){
                        if (allAssignments[i].ID == item.ID){
                            console.log(item);
                            included = true;
                        }
                    }
                    if (included == false){
                        allAssignments.push(item);
                    }
                }
            })
        }, function failed(response) {
            console.log("Failed to get all courses");
        })

        for (let i = 0; i < allAssignments.length; i++){
            if (completedAssignments.includes(allAssignments[i])){
                allAssignments[i].Completed = "Completed";
            }
            else{
                allAssignments[i].Completed = " ";
            }

        }
        $scope.studentMyAssignments = allAssignments;
    }

    $scope.assignmentCompleted = function(assignment){
        for (let i = 0; i < completedAssignments.length; i++){
            if (completedAssignments[i].CourseID == assignment.CourseID){
                return;
            }
        }
        completedAssignments.push(assignment);
        getAssignments();

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

    $scope.changeEnrollment = function(course) {
        let courseID = course.ID;
        let courseAscId = 0;

        for (let i = 0; i < myCourseAsc.length; i++){
            if (myCourseAsc[i].CourseID == courseID && myCourseAsc[i].StudentID == id){
                courseAscId = myCourseAsc[i].ID;
            }
        }
        if (enrolledCourseID.includes(courseID)) {
            $http({
                method: 'DELETE',
                url: 'https://caab.sim.vuw.ac.nz/api/leggjere/delete.course_association.' + courseAscId + '.json'
            }).then(function (response) {
            }, function failed(response) {
                console.log("Failed to delete from course");
            })

        } else {
            let courseAsc = {
                ID: courseAscId,
                StudentID: id,
                CourseID: courseID,
            };
            $http.post('https://caab.sim.vuw.ac.nz/api/leggjere/update.course_association_directory.json', courseAsc)
            .then(function (response) {
                console.log("Got to here 5");
            }, function failed(response) {
                console.log("Failed to add to course");
            })
        }
    }


    $scope.lectureAddNew = function () {
                $scope.lectureAddCourse = false;
    }

    $scope.lectureNewAssignment = function () {
                $scope.lectureAddAssignment = false;
    }

    $scope.lectureCourses;

    $scope.target = 'https://caab.sim.vuw.ac.nz/api/leggjere/course_directory.json';
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
        $scope.postDeleteCourse = "https://caab.sim.vuw.ac.nz/api/leggjere/delete.course."+ course.ID +".json"
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
        $scope.postLectureCourse = "https://caab.sim.vuw.ac.nz/api/leggjere/update.course_" +
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
    $scope.postEditCourse = "https://caab.sim.vuw.ac.nz/api/leggjere/update.course_" +
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
    $scope.Atarget = "https://caab.sim.vuw.ac.nz/api/leggjere/assignment_directory.json";
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
        $scope.postLectureAssignment = "https://caab.sim.vuw.ac.nz/api/leggjere/update.assignment_directory.json";
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
    $scope.postEditAssignment = "https://caab.sim.vuw.ac.nz/api/leggjere/update.assignment_directory.json"
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
        $scope.postDeleteAssignment = "https://caab.sim.vuw.ac.nz/api/leggjere/delete.assignment."+ assignment.ID +".json"
        const {indexOf} = $scope.lectureAssignments;
        var aIndex = $scope.lectureAssignments.indexOf(assignment);

        $http.delete($scope.postDeleteAssignment)
            .then(function success() {
                alert("Deleted Assignment")
                $scope.lectureAssignments.splice(aIndex,1);
            })}
})

