
function getUserName() {
    var querys = window.location.search.substring(1);
    var n = querys.split("=").pop();
    document.getElementById("e").innerHTML = n;
}


function setUser() { //get classes for user
    var querys = window.location.search.substring(1);
    var n = querys.split("=").pop();
    var di ={};
    di["ucid"] = n;
    di["major"] = "Science1";
    var req = {"x": di};
    $.post('../getAllClassesStudent.php',req,(data, textStatus, jqXHR) => {
        console.log(data);
        loadClasses(data);
        loadSemesters(data);
    },"text");
}

function findClassStatus(data) {
    var result = JSON.parse(data);
    var tempGroupArr =[];
    var final=[];
    var refined={};
    var classes = [];
    var inDict = {};
    var classDetail = [];
    var prer = [];
    var check = false;
    var index;
    for (x in result) {
        if(!(tempGroupArr.includes(result[x].group))) {
            tempGroupArr.push(result[x].group);
            final.push({"group":result[x].group});
        }
    }
    txt="";
    for (x in final) {
        final[x]["classes"]=[];
        for(i in result) {
            if(final[x]["group"] == result[i]["group"]){
                classDetail = [];
                inDict = {};
                inDict = {"class":"","detail":classDetail};
                index = result[i].order-1;
                inDict["class"]=result[i].class;
                inDict["code"] = result[i].code;
                if(result[i].prereqs.length == 0) {
                    check = true;
                }
                else {
                    for(y in result[i].prereqs){

                       prer.push(result[i].prereqs[y].prereq);
                       if(result[i].prereqs[y].logic == 'OR' && result[i].prereqs[y].code != null){
                           check = true;
                           break;
                       }
                       else if (result[i].prereqs[y].logic == 'OR' && result[i].prereqs[y].code == null){
                           check = false;
                       }
                       else if (result[i].prereqs[y].logic == 'AND' && result[i].prereqs[y].code != null){
                           check = true;
                       }
                       else if (result[i].prereqs[y].logic == 'AND' && result[i].prereqs[y].code == null){
                           check = false;
                       }
                    }
                }
                if(check == true) {
                    inDict["available"] = 0;
                }
                else {
                    inDict["available"] = 1;
                }
                //this make the prereq array and then empty it for next class
                if(prer.length == 0){
                    prer.push("No Prereq");
                }
                inDict["pre"]=prer;
                prer=[];

                classDetail.push(result[i].description);
                inDict["detail"]=classDetail;
                final[x]["classes"].push(inDict);
            }
        }
    }
    return final;
}

function collapse(grpName) {
    var it = document.getElementsByClassName(grpName);
    if (it[0].style.display == "block") {
        it[0].style.display = "none";
    }
    else {
        it[0].style.display = "block";
    }
}

function loadClasses(data) {// load classses with color code
    let final = findClassStatus(data);
    let fixSpace;
    let temp = "";
    console.log("dshdhashda"+final.length);
    for(x in final) {
        fixSpace = (final[x].group).split(' ').join('_');
        temp+="\""+fixSpace+"\"";
        txt += "<li class=\"gurList\">" +
                "<button class=\"collapse-button\" onclick=\'collapse("+temp+")\'>" + final[x].group + "</button>" +
                "<div class=\"item-collapse "+fixSpace+"\"><ul>";
                temp="";
                for(i in final[x].classes) {
                    if(final[x].classes[i].code != null){
                        txt+= "<li class=\"blueClass h\" >" +
                                "<a>" + final[x].classes[i].class + " (" + final[x].classes[i].detail +")" +
                                "<span class=\"hoverText\">"+ final[x].classes[i].pre+"</span>" + "</a>"+
                            "</li>";
                    }
                    else {
                        if(final[x].classes[i].available == 0){
                            txt+= "<li class=\"greenClass h\" >" +
                                "<a>" + final[x].classes[i].class + " (" + final[x].classes[i].detail +")" +
                                "<span class=\"hoverText\">"+ final[x].classes[i].pre+"</span>" + "</a>"+
                            "</li>";
                        }
                        else {
                            txt+= "<li class=\"redClass h\" >" +
                                "<a>" + final[x].classes[i].class + " (" + final[x].classes[i].detail +")" +
                                "<span class=\"hoverText\">"+ final[x].classes[i].pre+"</span>" + "</a>"+
                            "</li>";
                        }
                    }
                }
                txt+= "</ul><div>" +
            "</li>";
            if(Math.round(final.length/2 - 1) == x) {
                document.getElementById("classesMenuLeft").innerHTML = txt;
                txt="";
            }
    }
    document.getElementById("classesMenuRight").innerHTML = txt;
}


function createSemester() {
    //make it first equal the already innerhtml and then add new and after click submit button enable add button
    var x = document.getElementById("createSem");
    x.style.display = "block";
    document.getElementById("addClasses").innerHTML = "";
    document.getElementById("year").innerHTML = "";
    document.getElementsByClassName('sem')[0].checked = false;
    document.getElementsByClassName('sem')[1].checked = false;
    //document.getElementById('semesterName').value = '';
}

function addClass() {
    var querys = window.location.search.substring(1);
    var n = querys.split("=").pop();
    var di ={};
    di["ucid"] = n;
    di["major"] = "Science1";
    var req = {"x": di};
    $.post('../getAllClassesStudent.php',req,(data, textStatus, jqXHR) => {
        var result = JSON.parse(data);
        var clsArr = [];
        for(i in result) {
            clsArr.push(result[i].class);
        }
        var txt = "";
        var addClass = document.createElement("addClass");
        txt+="<div><input type=\"text\" class=\"eachClass\" list=\"cl\"/>";
        txt+="<a onclick=\"removefield()\" class=\"rm\">X</a></div>";
        txt+="<datalist id=\"cl\">";
        for(x in clsArr) {
            txt+="<option value=\""+clsArr[x]+"\" >";
        }
        txt+="</datalist>";
        addClass.innerHTML = txt;
        document.getElementById("addClasses").appendChild(addClass);
    },"text");

}

function removefield() {
    $(".add-class-field").on("click",".rm", function() {
       $(this).parent('div').remove();
   });
}

function loadSemesters(data) {
    //var xmlhttp = new XMLHttpRequest();
    //xmlhttp.onreadystatechange = function() {
        //if (this.readyState == 4 && this.status == 200) {
            var result = JSON.parse(data);
            var final = [];
            var semester = {};
            var cls = [];
            var tempCodeLst = [];
            var txt = "";
            var check = false;
            var clsArr = "\'";
            for(i in result) {
                if(i>0) {
                    clsArr+=",";
                }
                clsArr+=result[i].class;
            }
            clsArr+="\'";
            for(x in result) {
                if(result[x].code != null) {
                    if(final.length > 0) {
                        for(j in final)
                        {
                            if(result[x].code == final[j].code) {
                                //semester["code"] = result[x].code;
                                final[j].classes.push(result[x].class);
                                check = false;
                                break;
                            }
                            else{
                                check = true;
                            }
                        }
                        if(check == true) {
                                semester["code"] = result[x].code;
                                cls.push(result[x].class);
                                semester["classes"] = cls;
                                cls = [];
                                final.push(semester);
                                semester={};
                                check = false;
                        }
                    }
                    else {
                        semester["code"] = result[x].code;
                        cls.push(result[x].class);
                        semester["classes"] = cls
                        final.push(semester);
                        cls = [];
                        semester={};
                    }
                }
            }
            //final.sort(function(a, b){return a.code[2] - b.year[2]});
            var z = 0;
            final.sort(sortYear);
            for(i in final){

              //txt = "";
              if(i == (final.length - 1)) { // last then add edit button
                  let tempCode = final[i].code[0]+
                  final[i].code[1]+final[i].code[2]+final[i].code[3];
                  let seme = "\'"+final[i].code[4]+"\'";
                  txt += "<div class=\"semBox-display\">"+

                            "<p class=\"semesterName\">Year: "+ tempCode;
                            if(seme == "F"){
                                txt+="&nbsp  &nbsp &nbsp Fall</p>";
                            }
                            else {
                                txt+="&nbsp  &nbsp &nbsp Spring</p>";
                            }
                            txt+="<div class=\"box display-class-field\">";
                            let tempArr = "\'";
                            for(k in final[i].classes){
                                z=k;
                                z++;
                                txt+="<p> Class "+z+": "+"</p>";
                                txt+="<input type=\"text\" id=\"last"+z+"\" value=\"" + final[i].classes[k]+"\"" + "disabled>";
                                if(k>0) {
                                    tempArr+=",";
                                }
                                tempArr+=final[i].classes[k];

                            }
                            tempArr+="\'";
                            txt+="</div>"+

                            //in JS hAVE A FOR LOOP TO make class1: Cs100 class 2 class3-->
                            "<button type=\"button\" onclick=\"deleteSemester()\">Delete Semester</button>"+
                            "<button type=\"button\" onclick=\"editSemester("+tempCode+","+seme+","+tempArr+","+clsArr+")\">Edit Semester</button>"+
                            //edit will add all the values in the semester to creatre a nw semester boxand delet the semester and sumbit the semester will repopulate it-->
                        "</div>  ";
              }
              else {
              txt += "<div class=\"semBox-display\">"+

                        "<p class=\"semesterName\">Year: "+ final[i].code[0]+
                        final[i].code[1]+final[i].code[2]+final[i].code[3];
                        if(final[i].code[4] == "F"){
                            txt+="&nbsp  &nbsp &nbsp Fall</p>";
                        }
                        else {
                            txt+="&nbsp  &nbsp &nbsp Spring</p>";
                        }
                        txt+="<div class=\"box display-class-field\">";

                        for(k in final[i].classes){
                            z=k;
                            z++;
                            txt+="<p> Class "+z+": "/*+final[i].classes[k] */+"</p>";
                            txt+="<input type=\"text\" value=\"" + final[i].classes[k]+"\"" + " disabled>";

                        }
                        txt+="</div>"+

                        //in JS hAVE A FOR LOOP TO make class1: Cs100 class 2 class3-->

                        //edit will add all the values in the semester to creatre a nw semester boxand delet the semester and sumbit the semester will repopulate it-->
                    "</div>  ";
                }

            }
            document.getElementById("fillSemester").innerHTML = txt;
}


function sortYear(a, b) { // for sorting semesters
    const yeara = a.code;
    const yearb = b.code;

    let c = 0;
    if (yeara > yearb) {
    c = 1;
    } else if (yeara < yearb) {
    c = -1;
    }
    return c;
}

function sumbmitSemester() {
    var querys = window.location.search.substring(1);
    var n = querys.split("=").pop();
    var di ={};
    di["ucid"] = n;
    di["major"] = "Science1";
    var req = {"x": di};
    $.post('../getAllClassesStudent.php',req,(data, textStatus, jqXHR) => {
        var x = document.getElementById("createSem");
        x.style.display = "none";
        var semesterName = document.getElementById("year").value;
        var clss = [];
        var arr = document.getElementsByClassName('eachClass');
        for(i=0 ; i < arr.length ; i++) {
            clss.push(arr[i].value);
        }

        let final = findClassStatus(data);
        let alertSet = [];
        let tempDict = {};
        let notAllowed = false;
        for(x in final) {
            for(i in final[x].classes) {
                if(final[x].classes[i].code != null && clss.indexOf(final[x].classes[i].class) > -1){
                    tempDict["class"] = final[x].classes[i].class;
                    tempDict["prereq"] = "taken";
                    alertSet.push(tempDict);
                    tempDict = {};
                    notAllowed = true;
                }
                else {
                    if(final[x].classes[i].available == 0){
                        //gree
                    }
                    else if(final[x].classes[i].available != 0 && clss.indexOf(final[x].classes[i].class) > -1) {
                        tempDict["class"] = final[x].classes[i].class;
                        tempDict["prereq"] = final[x].classes[i].pre;
                        alertSet.push(tempDict);
                        tempDict = {};
                        notAllowed = true;
                    }
                }
            }
        }


        //if = 0 means the classes are not before taken or are not red do below
        if(notAllowed != true) {
            var code ="";
            code+=semesterName;
            if( document.getElementsByClassName('sem')[0].checked == true) {
                code+="S";
            }
            else {
                code+="F";
            }
            var last=[];
            var di ={}
            //get username
            var querys = window.location.search.substring(1);
            var n = querys.split("=").pop();
            for(j in clss) {
                di["name"]=clss[j];
                di["ucid"]=n;
                di["code"]=code;
                di["major"]="Science1";
                last.push(di);
                di={};
            }

            var f={"x":last};
            var finals = JSON.stringify(f);

            $.post('../updateStudentRecords.php',f,(data, textStatus, jqXHR) => {console.log(data); setUser();},"text");
        }
        else {
            let c = "";
            for(i in alertSet) {
                c += alertSet[i].class;
                if(alertSet[i].prereq != "taken") {
                    c += " Missing PreReq: ";
                    for(x in alertSet[i].prereq) {
                        c += alertSet[i].prereq[x];
                        c += ", ";
                    }
                    c += "\n";
                }
                else {
                    c += ": Already Taken";
                    c += "\n";
                }
            }
            alert(c);
        }
    },"text");

}
function editSemester(tempCode,seme,str,cls) {
    document.getElementById("addClasses").innerHTML = "";
    document.getElementById("year").innerHTML = "";
    document.getElementsByClassName('sem')[0].checked = false;
    document.getElementsByClassName('sem')[1].checked = false;
    var x = document.getElementById("createSem");
    let tempArr = str.split(",");
    let listClasses = cls.split(",");
    for(j in tempArr) {
        let txt = "";
        var addClass = document.createElement("addClass");
        txt+="<div><input type=\"text\" class=\"eachClass\" value=\'"+tempArr[j]+"\' list=\"cl\"/>";
        txt+="<a onclick=\"removefield()\" class=\"rm\">X</a></div>";
        txt+="<datalist id=\"cl\">";
        for(y in listClasses) {
            txt+="<option value=\""+listClasses[y]+"\" >";
        }
        txt+="</datalist>";
        addClass.innerHTML = txt;
        document.getElementById("addClasses").appendChild(addClass);
    }
    x.style.display = "block";
    //document.getElementById("addClasses").innerHTML = tempArr;
    document.getElementById("year").value = tempCode;
    if(seme == "F") {
        document.getElementsByClassName('sem')[1].checked = true;
    }
    else {
        document.getElementsByClassName('sem')[0].checked = true;
    }
    deleteSemester();
}
function deleteSemester() {
    var querys = window.location.search.substring(1);
    var n = querys.split("=").pop();
    let clas = []
    let di = {};
    //var x = document.getElementById("createSem");
    //var y = document.getElementById("last2").value;
    var z = 1;
    var id = "last"+z;
    while(document.getElementById(id) != null) {
        di["ucid"] = n;
        di["name"] = document.getElementById(id).value;
        di["major"] = "Science1";
        clas.push(di);
        di={};
        z++;
        id="last"+z;
    }
    let final = {"x":clas};

    $.post('../revertStudentRecords.php',final,(data, textStatus, jqXHR) => {setUser();},"text");
    //x.style.display = "block";
    //x.innerHTML = final["x"]["ucid"];

}
