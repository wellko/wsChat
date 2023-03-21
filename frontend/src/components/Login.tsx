import React, { useState } from 'react';
import {
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    TextField,
    Typography,
} from '@mui/material';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import {LoginType,} from "../types";
import {Alert} from "@mui/lab";

interface props {
    onLogin : (state: LoginType) => void;
    onLoginChange: () => void;
    error: string | null;
}

const Login:React.FC<props> = ({onLogin, onLoginChange, error}) => {
    const [state, setState] = useState<LoginType>({
        username: '',
        password: '',
    });
    const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const submitFormHandler = async (event: React.FormEvent) => {
        event.preventDefault();
        onLogin(state)
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                style={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOpenIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign In
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mt: 3, width: '100%' }}>
                        {error}
                    </Alert>
                )}
                <Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
                    <Grid container spacing={2}>
                        <Grid container item xs={12}>
                            <TextField
                                sx={{ margin: 'auto' }}
                                label="Username"
                                required
                                name="username"
                                autoComplete="current-username"
                                value={state.username}
                                onChange={inputChangeHandler}
                            />
                        </Grid>
                        <Grid container item xs={12}>
                            <TextField
                                sx={{ margin: 'auto' }}
                                label="Password"
                                required
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                value={state.password}
                                onChange={inputChangeHandler}
                            />
                        </Grid>
                    </Grid>
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                      'Sign In'
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button type='button' variant='text' onClick={onLoginChange}>
                                Go to registration
                            </Button>
                        </Grid>
                    </Grid>
                    <Grid container item sx={{ pt: 5 }} gap={2}>
                        </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default Login;