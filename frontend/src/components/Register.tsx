import React, { useState } from 'react';
import { Avatar, Box, Button, CircularProgress, Container, Grid, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {RegisterMutation} from "../types";

interface props {
	onRegister : (state: RegisterMutation) => void;
	onLoginChange: () => void;
}

const Register: React.FC<props> = ({onRegister, onLoginChange}) => {
	const [loading, setLoading] = useState(false);

	const [state, setState] = useState<RegisterMutation>({
		username: '',
		password: '',
		displayName: '',
	});

	const inputChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setState((prevState) => ({ ...prevState, [name]: value }));
	};

	const submitFormHandler = async (event: React.FormEvent) => {
		event.preventDefault();
		try {
			onRegister(state);
		} catch (e) {
			throw new Error();
		}
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
					<LockOutlinedIcon />
				</Avatar>
				<Typography component="h1" variant="h5">
					Sign up
				</Typography>

				<Box component="form" onSubmit={submitFormHandler} sx={{ mt: 3 }}>
					<Grid container spacing={2}>
						<Grid container item xs={12}>
							<TextField
								sx={{ margin: 'auto' }}
								label="Username"
								name="username"
								required
								autoComplete="new-username"
								value={state.username}
								onChange={inputChangeHandler}
							/>
						</Grid>
						<Grid container item xs={12}>
							<TextField
								sx={{ margin: 'auto' }}
								name="password"
								label="Password"
								type="password"
								required
								autoComplete="new-password"
								value={state.password}
								onChange={inputChangeHandler}
							/>
						</Grid>
						<Grid container item xs={12}>
							<TextField
								sx={{ margin: 'auto' }}
								name="displayName"
								label="Display name"
								required
								value={state.displayName}
								onChange={inputChangeHandler}
							/>
						</Grid>
					</Grid>
					<Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
						{loading ? <CircularProgress /> : 'Sign Up'}
					</Button>
					<Grid container justifyContent="flex-end">
						<Grid item>
							<Button type='button' variant='text' onClick={onLoginChange}>
								Already have an account? Sign in
							</Button>
						</Grid>
					</Grid>
				</Box>
			</Box>
		</Container>
	);
};

export default Register;