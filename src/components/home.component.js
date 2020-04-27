import React, {useState, useEffect} from 'react';

function Home({user, loggedIn}) {
   
    return(
        <div>
            <h1 className="text-center jumbotron">Home</h1>
            <div>{loggedIn && <span>Welcome back {user.username}</span>}</div>
            {user.userlevel === 'admin' && <div>Congratulations! You are a registered Admin</div>}
        </div>
    )
}     






export default Home