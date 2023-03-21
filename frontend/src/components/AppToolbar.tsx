import React from 'react';
import {AppBar, Button, Grid, Toolbar, Typography} from '@mui/material';
import {IUser} from "../types";

interface props{
    user: IUser;
    onLogout: (arg:string) => void;
}

const AppToolbar:React.FC<props> = ({user, onLogout}) => {

    return (
        <AppBar position="sticky" sx={{ mb: 2 }}>
            <Toolbar>
                <Grid container justifyContent="space-between" alignItems="center">
                    <Typography variant="h6" component="div">
                        Chat-WS
                    </Typography>
                    <Grid item>  Hello, {user.displayName} <Button onClick={()=> onLogout(user.username)} type='button' variant='contained' color='warning'>Log out!</Button></Grid>
                </Grid>
            </Toolbar>
        </AppBar>
    );
};

export default AppToolbar;