import express from "express"
import bodyParser from "body-parser"
import axios from "axios"
const port=3000;
var t1={"count":20,"recentSubmissions":[{"title":"Minimum Cost to Convert String I","titleSlug":"minimum-cost-to-convert-string-i","timestamp":"1722039804","statusDisplay":"Accepted","lang":"cpp"},{"title":"Find the City With the Smallest Number of Neighbors at a Threshold Distance","titleSlug":"find-the-city-with-the-smallest-number-of-neighbors-at-a-threshold-distance","timestamp":"1722039789","statusDisplay":"Accepted","lang":"python3"},{"title":"Sort an Array","titleSlug":"sort-an-array","timestamp":"1721892294","statusDisplay":"Accepted","lang":"python3"},{"title":"Sort the Jumbled Numbers","titleSlug":"sort-the-jumbled-numbers","timestamp":"1721806356","statusDisplay":"Accepted","lang":"python3"},{"title":"Sort Array by Increasing Frequency","titleSlug":"sort-array-by-increasing-frequency","timestamp":"1721720088","statusDisplay":"Accepted","lang":"python3"},{"title":"Sort Array by Increasing Frequency","titleSlug":"sort-array-by-increasing-frequency","timestamp":"1721720079","statusDisplay":"Runtime Error","lang":"python3"},{"title":"Sort the People","titleSlug":"sort-the-people","timestamp":"1721678566","statusDisplay":"Accepted","lang":"python3"},{"title":"Build a Matrix With Conditions","titleSlug":"build-a-matrix-with-conditions","timestamp":"1721586781","statusDisplay":"Accepted","lang":"python3"},{"title":"Find Valid Matrix Given Row and Column Sums","titleSlug":"find-valid-matrix-given-row-and-column-sums","timestamp":"1721434346","statusDisplay":"Accepted","lang":"python"},{"title":"Lucky Numbers in a Matrix","titleSlug":"lucky-numbers-in-a-matrix","timestamp":"1721381169","statusDisplay":"Accepted","lang":"python3"},{"title":"Number of Good Leaf Nodes Pairs","titleSlug":"number-of-good-leaf-nodes-pairs","timestamp":"1721287743","statusDisplay":"Accepted","lang":"python3"},{"title":"Delete Nodes And Return Forest","titleSlug":"delete-nodes-and-return-forest","timestamp":"1721287695","statusDisplay":"Accepted","lang":"python3"},{"title":"Step-By-Step Directions From a Binary Tree Node to Another","titleSlug":"step-by-step-directions-from-a-binary-tree-node-to-another","timestamp":"1721114940","statusDisplay":"Accepted","lang":"python3"},{"title":"Create Binary Tree From Descriptions","titleSlug":"create-binary-tree-from-descriptions","timestamp":"1721028878","statusDisplay":"Accepted","lang":"python3"},{"title":"Number of Atoms","titleSlug":"number-of-atoms","timestamp":"1720980755","statusDisplay":"Accepted","lang":"python3"},{"title":"Robot Collisions","titleSlug":"robot-collisions","timestamp":"1720861216","statusDisplay":"Accepted","lang":"python3"},{"title":"Robot Collisions","titleSlug":"robot-collisions","timestamp":"1720861190","statusDisplay":"Time Limit Exceeded","lang":"python3"},{"title":"Maximum Score From Removing Substrings","titleSlug":"maximum-score-from-removing-substrings","timestamp":"1720793791","statusDisplay":"Accepted","lang":"python3"},{"title":"Reverse Substrings Between Each Pair of Parentheses","titleSlug":"reverse-substrings-between-each-pair-of-parentheses","timestamp":"1720683010","statusDisplay":"Accepted","lang":"python3"},{"title":"Crawler Log Folder","titleSlug":"crawler-log-folder","timestamp":"1720651573","statusDisplay":"Accepted","lang":"python3"}]}
const app=express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(express.static("./public"))
app.listen(port,()=>{
    console.log("Server running successfully and recieving requests from port "+port);
})
app.get("/",(req,res)=>{
    res.render("login.ejs");
})
app.post("/profile", async(req,res)=>{
    try{
    const response=await axios.get("http://localhost:3800/userProfile/"+req.body.username);
    var result=response.data;
    const responseB=await axios.get(`http://localhost:3800/${req.body.username}/badges`);
    const resultB=responseB.data;
    if(resultB.errors){throw new Error("Dudeeeee")}
    var badges=generateImgURLS(resultB.badges);
    console.log("Hello")
    const responseC=await axios.get(`http://localhost:3800/${req.body.username}/contest`);
    const resultC=responseC.data;
    const submissions=extractTitles(result);
    console.log(result.recentSubmissions)
    result.ranking=parseRanking(result.ranking);
    // console.log(result.ranking)
    // const submissions=extractTitles(t1);
    // const badges=[];
    // // const result={matchedUserStats:[1,2,3,4]};
    // const resultC=0;
    if(!resultC.contestAttend){
    res.render("index.ejs",{
        username:req.body.username,
        submissions:submissions,
        totalSolved:result.totalSolved,
        easySolved:result.easySolved,
        mediumSolved:result.mediumSolved,
        hardSolved:result.hardSolved,
        ranking:result.ranking,
        easySubmissionsAccepted:result.matchedUserStats.acSubmissionNum[1].submissions,
        mediumSubmissionsAccepted:result.matchedUserStats.acSubmissionNum[2].submissions,
        hardSubmissionsAccepted:result.matchedUserStats.acSubmissionNum[3].submissions,
        easySubmissionsTotal:result.totalSubmissions[1].submissions,
        mediumSubmissionsTotal:result.totalSubmissions[2].submissions,
        hardSubmissionsTotal:result.totalSubmissions[3].submissions,
        badges:badges, //(object List) Has an id attribute, an icon attribute(Image link), has a displayName
    });}
    else{
        res.render("index.ejs",{
            username:req.body.username,
            submissions:submissions,
            totalSolved:result.totalSolved,
            easySolved:result.easySolved,
            mediumSolved:result.mediumSolved,
            hardSolved:result.hardSolved,
            ranking:result.ranking,
            badges:badges,
            contestAttend: resultC.contestAttend,
            contestRating: resultC.contestRating,
            contestGlobalRanking: resultC.contestGlobalRanking,
            totalParticipants: resultC.totalParticipants,
            contestTopPercentage: resultC.contestTopPercentage,
            easySubmissionsAccepted:result.matchedUserStats.acSubmissionNum[1].submissions,
            mediumSubmissionsAccepted:result.matchedUserStats.acSubmissionNum[2].submissions,
            hardSubmissionsAccepted:result.matchedUserStats.acSubmissionNum[3].submissions,
            easySubmissionsTotal:result.totalSubmissions[1].submissions,
            mediumSubmissionsTotal:result.totalSubmissions[2].submissions,
            hardSubmissionsTotal:result.totalSubmissions[3].submissions,
        });
    }
}
    catch(err){
        console.log(err.message);
        res.render("login.ejs",{err:"Username does not exist"});
    }
})
function generateImgURLS(badges2){
    var map={"50 Days Badge 2024":"/images/50Days.gif","100 Days Badge 2024":"/images/100Days.webp",
        "Jul LeetCoding Challenge":"https://assets.leetcode.com/static_assets/public/images/badges/2024/gif/2024-07.gif",
        "Jun LeetCoding Challenge":"/images/Jun.gif",
        "May LeetCoding Challenge":"/images/May.gif.jpeg",
        "Apr LeetCoding Challenge":"/images/Apr.gif",
        "Mar LeetCoding Challenge":"/images/Mar.gif.jpeg",
        "Feb LeetCoding Challenge":"/images/Feb.gif.jpeg",
        "Jan LeetCoding Challenge":"/images/Jan.gif"
    }
    let badges=[];
    for(var i=0;i<badges2.length;i++){
        console.log(badges2[i].displayName)
        if(map[badges2[i].displayName]){
            badges.push(map[badges2[i].displayName]);
        }
    }
    return badges;
}
function extractTitles(t){
    var ret=[];
    for(var i=0;i<t.recentSubmissions.length && i<9;i++){
        ret.push(t.recentSubmissions[i].title);
    }
    return ret;
}
function parseRanking(t){
    var str="";
    var i=0;
    console.log(str)
    while(t>0){
        if(i%3==0){
            str+=","
        }
    str+=(t%10).toString();
    t=Math.floor(t/10);
    i++;
    }
    var str1="";
    for(var i=str.length-1;i>=1;i--){
        str1+=str[i];
    }
    return str1;
}
