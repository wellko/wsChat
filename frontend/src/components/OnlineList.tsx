import React from 'react';
import {List, ListItem} from "@mui/material";
import {IUser} from "../types";

interface props{
    users: IUser[],
}
const OnlineList:React.FC<props> = ({users}) => {
    return (
        <List>
            {users.map(el=> <ListItem key={Math.random()}>{el.displayName}</ListItem>)}
        </List>
    );
};

export default OnlineList;