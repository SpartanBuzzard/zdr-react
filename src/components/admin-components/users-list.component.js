import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';

const User = props => (
    <tr>
        <td>{props.user.username}</td>
        <td>{props.user.firstname}</td>
        <td>{props.user.lastname}</td>
        <td>{props.user.email}</td>
        <td>{props.user.password}</td>
        <td>{props.user.userlevel}</td>
        <td>
            <Link to={"/edit/"+props.user._id}>edit</Link> | <a href="#" onClick={() => {props.deleteUser(props.user._id)}}>delete</a>
        </td>
    </tr>
)

export default class UserList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
        this.deleteUser = this.deleteUser.bind(this);
    }

    componentDidMount() {
        axios.get('http://localhost:5000/admin/users')
            .then(res => {
                if(res.status === 200) {
                    this.setState({
                        users: res.data
                    })
                }
            })
            .catch(err => console.log(err));
    }

    deleteUser(id) {
        axios.delete('http://localhost:5000/admin/users'+id)
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
        this.setState({
            users: this.state.users.filter(el => el._id !== id)
        })
    }

    userList() {
        if(this.state.users.length > 0) {
            return this.state.users.map(currentuser => {
                return <User user={currentuser} deleteUser={this.deleteUser} key={currentuser._id} />
            })
        }
    }
    render() {
        
        return (
            <div id="userList" className="container-fluid">
                <h3 className="text-center">User List</h3>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th>Username</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>User Level</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        { this.userList() }
                    </tbody>
                </table>
            </div>
        )
    }
}