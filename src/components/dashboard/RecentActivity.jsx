import "../../styles/recentActivity.css";

function RecentActivity(){

const activity=[

"New Project Created",

"Employee Added",

"Task Completed",

"Project Updated",

"Leader Assigned"

];

return(

<div className="recent-activity">

<h3>Recent Activity</h3>

<ul>

{

activity.map((item,index)=>(

<li key={index}>

{item}

</li>

))

}

</ul>

</div>

);

}

export default RecentActivity;