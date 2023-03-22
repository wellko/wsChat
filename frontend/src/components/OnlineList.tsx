import React from 'react';
import {Box, List, ListItem, Paper, Typography} from "@mui/material";
import {IUser} from "../types";

interface props{
    users: IUser[],
}
const OnlineList:React.FC<props> = ({users}) => {
    return (
            <Paper elevation={4}>
                <Box overflow='scroll'>
                <Typography variant='h3'>Online:</Typography>
                <List>
                    {users.map(el=> <ListItem key={Math.random()}>{el.displayName}</ListItem>)}
                </List>
                </Box>
            </Paper>
    );
};

export default OnlineList;