var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/demoproject";
const userId = localStorage.getItem("userId");
var app = angular.module('myApp', []);
app.controller('myCtrl', function ($scope) {
    $scope.onload = function () {
        $scope.userData = localStorage.getItem("userData");
        $scope.userData = JSON.parse($scope.userData);
        $scope.playerDetailsData = [];
        $scope.teamDetailsData = [];
        $scope.teamDetails = {};
        $("#viewPlayersTableDivId").show();
        $("#teamMemberDivId").hide();
        getTeamMemberData();
        getUserPlayersDetails();
    }
    $scope.getPlayerData = function (data) {
        $("#ammountId").val(data.biddingPrice);
        $scope.teamDetails = data;
    }
    $scope.updateBid = function () {
        if ($scope.teamDetailsData.length > 15) {
            alert("Maximum member should not be more than 15");

        } else {
            if ($("#bidAmmountId").val() == "") {
                alert("Please enter ammount");
            } else {
                if (Number($("#ammountId").val()) >= Number($("#bidAmmountId").val())) {
                    alert("Bid ammount should be more than bidding price");
                } else {
                    let requestBody = {
                        "biddingPrice": $("#bidAmmountId").val(),
                        "userDetails": $scope.userData
                    }
                    $.ajax({
                        type: 'patch',
                        contentType: "application/json",
                        dataType: 'json',
                        cache: false,
                        url: URL + "/tournamentLogReg/" + $scope.teamDetails.userId + ".json",
                        data: JSON.stringify(requestBody),
                        success: function (response) {
                            $('#biddingModelId').modal('hide');
                            getUserPlayersDetails();
                            alert("Data Updated sucessfully!!!");
                        }, error: function (error) {
                            alert("Something went wrong");
                        }
                    });
                }
            }
        }
    }
    $scope.logout = function () {
        localStorage.removeItem("userId");
        localStorage.removeItem("userData");
        localStorage.clear();
        window.location.href = "loginReg.html";
    }
    function getUserPlayersDetails() {
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/tournamentLogReg.json",
            success: function (response) {
                let loginUserList = [];
                for (let i in response) {
                    let data = response[i];
                    data["userId"] = i;
                    loginUserList.push(data);
                }
                if ($scope.userData.userType == 'TEAM') {
                    $scope.playerDetailsData = loginUserList;
                } else {
                    $scope.playerDetailsData = loginUserList.filter(function (obj) {
                        return obj.userId == userId;
                    });
                }

                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.addTeam = function () {
        let requestBody = {};
        requestBody['teamDetails'] = $scope.teamDetails.userDetails;
        requestBody['playerDetails'] = $scope.userData;
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addTeam/" + $scope.teamDetails.userId + ".json",
            data: JSON.stringify(requestBody),
            success: function (response) {
                $('#biddingModelId').modal('hide');
                updateBid();

                alert("Data Updated sucessfully!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    function updateBid() {
        let requestBody = {};
        requestBody['isAccepted'] = true;
        $.ajax({
            type: 'patch',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/tournamentLogReg/" + userId + ".json",
            data: JSON.stringify(requestBody),
            success: function (response) {
                $scope.getUserPlayersDetails();
                getTeamMemberData();
                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    function getTeamMemberData() {
        $scope.teamDetailsData = [];
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/addTeam.json",
            success: function (response) {
                let teamData = [];
                for (let data in response) {
                    for (let x in response[data]) {
                        let team = response[data][x];
                        team["userId"] = data;
                        team["childUserId"] = x;
                        teamData.unshift(team);
                    }
                }
                if ($scope.userData.userType == 'TEAM') {
                    $scope.teamDetailsData = teamData.filter(function (obj) {
                        return $scope.userData.title === obj.teamDetails.title;
                    })
                } else {
                    $scope.teamDetailsData = teamData;
                }

                $scope.$apply();
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
    $scope.switchMenu = function (type, id) {
        $(".menuCls").removeClass("active");
        $('#' + id).addClass("active");
        $("#viewPlayersTableDivId").hide();
        $("#teamMemberDivId").hide();
        if (type == "PLAYER_DETAILS") {
            getUserPlayersDetails();
            $("#viewPlayersTableDivId").show();
        } else if (type == "TEAM_MEMBER") {
            $("#teamMemberDivId").show();
            getTeamMemberData();

        }

    }
});
