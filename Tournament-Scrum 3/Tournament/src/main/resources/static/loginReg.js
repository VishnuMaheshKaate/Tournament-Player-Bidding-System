var URL = "https://fir-1c7de-default-rtdb.firebaseio.com/demoproject";
function checkIsNull(value) {
    return value === "" || value === undefined || value === null ? true : false;
}
let teamsDetails = [{
    "mailId": "csk@gmail.com",
    "title": "CSK",
    "teamName": "Chennai Super Kings",
    "logo": "./logo/CSKoutline.png",
    "password": "Admin@123",
    "userId": "1",
    "userType": "TEAM"

}, {
    "mailId": "dc@gmail.com",
    "title": "DC",
    "teamName": "Delhi Capitals",
    "logo": "./logo/DCoutline.png",
    "password": "Admin@123",
    "userId": "2",
    "userType": "TEAM"

}, {
    "mailId": "gt@gmail.com",
    "title": "GT",
    "teamName": "Gujarat Titans",
    "logo": "./logo/GToutline.png",
    "password": "Admin@123",
    "userId": "3",
    "userType": "TEAM"

}, {
    "mailId": "kkr@gmail.com",
    "title": "KKR",
    "teamName": "Kolkata Knight Riders",
    "logo": "./logo/KKRoutline.png",
    "password": "Admin@123",
    "userId": "4",
    "userType": "TEAM"

}, {
    "mailId": "lsg@gmail.com",
    "title": "LSG",
    "teamName": "Lucknow Super Giants",
    "logo": "./logo/LSGoutline.png",
    "password": "Admin@123",
    "userId": "5",
    "userType": "TEAM"

}, {
    "mailId": "mi@gmail.com",
    "title": "MI",
    "teamName": "Mumbail Indians",
    "logo": "./logo/MIoutline.png",
    "password": "Admin@123",
    "userId": "6",
    "userType": "TEAM"

}, {
    "mailId": "pk@gmail.com",
    "title": "PK",
    "teamName": "Punjab Kings",
    "logo": "./logo/PBKSoutline.png",
    "password": "Admin@123",
    "userId": "7",
    "userType": "TEAM"

}, {
    "mailId": "rr@gmail.com",
    "title": "RR",
    "teamName": "Rajasthan Royals",
    "logo": "./logo/RRoutline.png",
    "password": "Admin@123",
    "userId": "8",
    "userType": "TEAM"

}, {
    "mailId": "rcb@gmail.com",
    "title": "RCB",
    "teamName": "Royal Challengers Bangalore",
    "logo": "./logo/RCBoutline.png",
    "password": "Admin@123",
    "userId": "9",
    "userType": "TEAM"

}, {
    "mailId": "sh@gmail.com",
    "title": "SH",
    "teamName": "Sunrisers Hyderabad",
    "logo": "./logo/SRHoutline.png",
    "password": "Admin@123",
    "userId": "10",
    "userType": "TEAM"

}];
function loginUser() {

    let requestBody = {
        "emailId": $("#emailId").val(),
        "password": $("#pwdId").val()
    }
    if (checkIsNull($("#emailId").val()) || checkIsNull($("#pwdId").val())) {
        alert("Please fill Required Data");

    } else {
        for (let i = 0; i < teamsDetails.length; i++) {
            if (teamsDetails[i].mailId == $("#emailId").val() && teamsDetails[i].password == $("#pwdId").val()) {
                localStorage.setItem("userId", teamsDetails[i].userId);
                localStorage.setItem("userData", JSON.stringify(teamsDetails[i]));
                window.location.href = "tournaentPlayer.html";

            }
        }
        $.ajax({
            type: 'get',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            url: URL + "/tournamentLogReg.json",
            data: JSON.stringify(requestBody),
            success: function (lresponse) {
                let loginUserList = [];
                for (let i in lresponse) {
                    let data = lresponse[i];
                    data["userId"] = i;
                    loginUserList.push(data);
                }
                let isValid = false;
                for (let i = 0; i < loginUserList.length; i++) {
                    if (loginUserList[i].userEmailId == $("#emailId").val() && loginUserList[i].passwordId == $("#pwdId").val()) {
                        isValid = true;
                        localStorage.setItem("userId", loginUserList[i].userId);
                        localStorage.setItem("userData", JSON.stringify(loginUserList[i]));
                        window.location.href = "tournaentPlayer.html";

                    }
                }
                if (!isValid) {
                    alert("User not found");
                }
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
}
function registerUser() {
    isvalidField = true;
    $(".fieldCls").each(function () {
        if (checkIsNull($(this).val())) {
            isvalidField = false;
        }
    });
    if (!isvalidField || checkIsNull($("input[name='genderRadio']:checked").val())) {
        alert("Please fill all the required data");
    } else {
        let requestBody = {};
        $(".fieldCls").each(function () {
            requestBody[$(this).attr('id')] = $(this).val();
        });
        requestBody['gender'] = $("input[name='genderRadio']:checked").val();
        requestBody['userType'] = "PLAYER";
        requestBody['biddingPrice'] = $("#basePriceId").val();
        requestBody['isAccepted'] = false;
        $.ajax({
            type: 'post',
            contentType: "application/json",
            dataType: 'json',
            cache: false,
            cache: false,
            url: URL + "/tournamentLogReg.json",
            data: JSON.stringify(requestBody),
            success: function (lresponse) {
                $('#regModelId').modal('hide');
                alert("Registerd sucessfully!!!");
            }, error: function (error) {
                alert("Something went wrong");
            }
        });
    }
}
function resetData() {
    $(".fieldCls").each(function () {
        $(this).val('');
    });
    $("input[type=radio][name=genderRadio]").prop("checked", false);

}
$(document).ready(function () {
    $('#regModelId').on('hidden.bs.modal', function (e) {
        resetData();
    })
});
